---
author: Sreehari
pubDatetime: 2025-10-15T10:00:00Z
title: "We Built a Ransomware Detector That Lives Inside the Linux Kernel"
featured: true
draft: false
tags:
  - eBPF
  - Go
  - Linux Kernel
  - Security Research
  - Spider R&D
description: "How Spider's cybersecurity team built REKD — an eBPF engine that hooks the VFS layer, scores write entropy in real-time, and kills ransomware processes before encryption finishes."
---

## It Started With a Simple Question

What if you could catch ransomware *before* it finished encrypting your files?

Not after the fact. Not by signature matching. Not by watching file extension changes. Before the damage is done — at the exact moment the ciphertext is being written to disk.

That was the original question behind **REKD** (Ransomware Encryption Kernel Detector). The cybersecurity team at [Spider R&D](https://github.com/SpiderNitt) spent a few months turning that question into something that actually runs.

---

## Why User-Space Detection Keeps Losing

Most ransomware detection runs in user-space. It watches the filesystem, monitors process behaviour, checks hashes against signature databases. And ransomware authors know this — which is why modern strains come packed, obfuscated, and polymorphic. Signatures are useless against a payload you've never seen before.

But here's the thing ransomware can never escape: it must write encrypted data to disk. That's the whole point. And encrypted data has a very specific mathematical property — **high entropy**. Encrypted bytes look like noise. They're uniformly distributed. You can measure that.

So we thought: what if we hook the write path at the kernel level, before it even hits the filesystem? What if we score the entropy of every write, in real-time, and kill anything that looks like it's encrypting your disk?

That's REKD.

---

## Getting Into the Kernel

To intercept writes at the kernel level, we needed to hook `vfs_write` — the VFS layer function that every file write in Linux eventually passes through, regardless of filesystem.

The first instinct was kprobes. They're the classic way to instrument kernel functions from eBPF. We tried them. The problem with kprobes is that they work by inserting a software breakpoint at the target address — a `int3` on x86. Every hit causes a trap, a context switch into the debug handler, and a return. At high write throughput, that latency compounds badly.

We switched to **fentry trampolines** instead. fentry hooks attach at the very entry point of a function, before the prologue runs, using a dedicated BPF trampoline mechanism. No breakpoints. No trap overhead. The hook runs synchronously with near-zero latency and hands us direct access to the `vfs_write` arguments — including the write buffer pointer and the byte count.

```c
SEC("fentry/vfs_write")
int BPF_PROG(vfs_write_enter, struct file *file, const char __user *buf,
             size_t count, loff_t *pos) {
    // we're inside the kernel, on every write, before it happens
    return 0;
}
```

This is where things get interesting.

---

## The Noise Problem

The Linux kernel is loud. At idle, it generates thousands of micro-writes per second — SQLite WAL checkpoints, journal flushes, log rotations, pipe buffers. If we tried to score entropy on every single one of these, we'd either peg the CPU or drown in false data.

We solved this with a three-layer filter inside the kernel, before any data ever leaves to userspace:

**1. The 512-byte floor.** Any write smaller than 512 bytes is dropped immediately inside the kernel. The vast majority of system noise lives well below this. One comparison, one return.

**2. The inode mask.** We check the file's `i_mode` with a bitwise mask — `i_mode & 0x8000`. This is the regular-file bit. If it's not set, we're looking at a socket, a pipe, or a special device. We drop it. We only care about writes to real files on real filesystems.

**3. The scattered read.** This one took the most thought. eBPF's verifier is strict about memory access — you can't just read an arbitrary slice of userspace memory in a loop. The verifier needs to statically prove every memory access is safe at load time.

For small writes we read the whole buffer. For large writes we can't — but we also don't need to. We use a **scattered read strategy**: three targeted 512-byte reads at the header, midpoint, and footer of the write buffer, capped at 1536 bytes total. The statistical argument is that a ransomware-encrypted buffer will show high entropy uniformly across its length. Sampling three points gives us a representative picture without fighting the verifier.

After all three filters, only writes that are plausibly worth examining make it into the BPF ring buffer and up to userspace.

---

## The Math

All the heavy computation happens in userspace — Go handles it asynchronously so the kernel is never waiting on floating-point arithmetic.

We compute **Shannon entropy** on each sampled buffer:

```
H = -Σ p(x) * log₂(p(x))
```

You build a byte frequency histogram, compute the probability of each byte value, and sum the weighted log. The result is a score from 0.0 (perfectly uniform, like a file of all zeroes) to 8.0 (maximally random, like AES-CTR ciphertext). Plaintext English prose sits around 4.5. Encrypted data sits above 7.5.

We set our threshold at **7.5**. Anything above that is flagged as a high-entropy write.

---

## The False Positive Problem

Here's where naive entropy-based detection falls apart: compressed files are also high-entropy. gzip output looks almost identical to AES output from an entropy perspective. If we fired on every high-entropy write, we'd be killing every backup tool, every package manager, every browser downloading a file.

We needed a way to distinguish "writing one compressed file" from "encrypting the entire filesystem."

Two gates:

**The 70% ratio gate.** A process must demonstrate that at least 70% of its *total* VFS write volume — across all writes since we started tracking it — is high-entropy. One big `.tar.gz` write doesn't make you ransomware. Consistently encrypting everything you touch does.

**The 1MB cumulative gate.** A process must also write a cumulative total of at least 1MB of high-entropy data before an alert fires. This stops short-lived processes that write a single encrypted blob from triggering the detector.

Both gates must be satisfied at the same time. When they are, the Go daemon issues a `SIGKILL`.

---

## The Go Rewrite

The original prototype was Python. It worked, conceptually. It also used over 6% CPU at idle — not viable for anything running as a system service.

The Go implementation is structured around a producer-consumer model. A dedicated goroutine drains the BPF ring buffer continuously into a channel. A worker pool on the other side handles the CPU-bound entropy calculations. The two are fully decoupled, so I/O bursts don't stall the math and vice versa.

Idle CPU overhead in the Go version: **under 1.4%**.

The Python POC lives in `poc/` for posterity.

---

## What We Know It Misses

We want to be honest about this.

**Vectorized writes.** Advanced ransomware groups — Akira being a notable example — use `pwritev` instead of `write`. Vectorized I/O passes multiple memory buffers to the kernel in a single syscall. Instrumenting `vfs_writev` and iterating over a scatter-gather list inside eBPF runs into verifier loop complexity limits we haven't fully solved yet. This is on the roadmap.

**Entropy splitting.** A sufficiently advanced variant could theoretically split its ciphertext across writes such that each individual write sits below the 7.5 threshold — mathematically disjointed shares that only add up to encrypted data when recombined. This is a known theoretical attack against entropy-based detection. We haven't seen it in the wild, but we're aware of it.

---

## Testing It

There's an AES-CTR encryption simulator in `tests/` that stands in for real ransomware. It encrypts files with configurable chunk sizes and write patterns. Running the test suite generates a `thekey.key` file locally — that's the simulator's encryption key, gitignored, nothing to worry about.

The detector reliably catches it. The process gets killed mid-encryption.

---

## Where It Lives

REKD is a [Spider R&D](https://github.com/SpiderNitt) project — built and maintained by the cybersecurity sub-domain. The repository is at [github.com/SpiderNitt/rekd](https://github.com/SpiderNitt/rekd).

It runs as a systemd daemon. It ships with a live TUI mode that shows active PIDs, cumulative write volumes, and per-process entropy ratios in real-time. Install is a single script:

```bash
sudo ./scripts/install.sh
```

We're still building on it. The vectorized write gap is the next real problem to solve.

---

The question we started with — *can you catch ransomware before it finishes?* — turns out to have an answer. The math works. The kernel overhead is manageable. The hard part was everything in between.
