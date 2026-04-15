---
author: Sreehari
pubDatetime: 2025-10-15T10:00:00Z
title: "REKD: A Kernel-Level Ransomware Detection Engine"
featured: true
draft: false
tags:
  - eBPF
  - Go
  - Linux Kernel
  - Security Research
description: "How REKD uses eBPF fentry hooks and Shannon entropy to catch ransomware at the VFS layer before encryption completes — with under 1.4% CPU overhead."
---

**REKD (Ransomware Encryption Kernel Detector)** is a high-performance, kernel-level ransomware detection engine. It hooks the Virtual File System (VFS) layer using eBPF, calculating the Shannon entropy of data being written to disk to catch ransomware in real-time — regardless of obfuscation, packing, or polymorphism.

---

## The Core Insight

Ransomware has one unavoidable property: it must write highly randomized, encrypted ciphertext to disk. No amount of obfuscation changes this. By mathematically evaluating write entropy at the kernel level, we can detect cryptographic extortion before it completes.

The challenge is doing this without tanking storage throughput.

---

## System Design

### Why fentry, not kprobes

Legacy kprobes instrument kernel functions via software breakpoints — every hit causes a context switch with significant latency. REKD uses **fentry BPF trampolines** instead, which provide synchronous, near-zero latency access to `vfs_write` buffers. The hook looks like this:

```c
SEC("fentry/vfs_write")
int BPF_PROG(vfs_write_enter, struct file *file, const char __user *buf,
             size_t count, loff_t *pos) {
    // filter, extract, and ship to userspace ring buffer
    return 0;
}
```

### Kernel-side filtering

The Linux kernel generates thousands of micro-writes per second — SQLite WAL flushes, log rotations, pipe flushes. Scanning everything is not viable. Three filters run inside the kernel before any data leaves:

1. **512-byte minimum** — writes smaller than 512 bytes are dropped immediately. This alone eliminates the vast majority of noise.
2. **Regular-file gate** — a bitwise mask (`i_mode & 0x8000`) on the inode ensures only writes to regular files are tracked. Sockets, pipes, and special files are ignored.
3. **Scattered read extraction** — eBPF verifier limits prevent reading arbitrary memory regions. For large writes, instead of reading linearly (which would hit verifier loop limits), REKD applies a **scattered read strategy** capped at 1536 bytes: three targeted 512-byte chunks at the header, midpoint, and footer of the buffer. This gives a statistically representative sample of the payload without violating verifier constraints.

### Entropy math in userspace

All floating-point Shannon entropy calculations happen asynchronously in userspace. The kernel is never blocked on math.

**Shannon entropy** scores byte distribution from 0.0 to 8.0. High-entropy writes (compressed or encrypted data) approach 8.0. REKD uses a threshold of **7.5**.

Benign compression (gzip, zlib) also writes high-entropy data — so a single high-entropy write is not enough to trigger an alert. Two gates prevent false positives:

- **70% ratio gate** — at least 70% of a process's total VFS write volume must be high-entropy.
- **1MB cumulative gate** — a process must write at least 1MB of high-entropy ciphertext before an alert fires.

Both gates must be satisfied simultaneously.

---

## Known Blindspots

**Vectorized writes (`vfs_writev`)** — advanced ransomware groups like Akira use `pwritev` to pass multiple memory buffers in a single syscall, maximizing encryption throughput. Because iterating over scatter-gather lists inside eBPF runs into verifier loop complexity limits, `vfs_writev` is currently not instrumented.

**Entropy sharing** — a sufficiently motivated variant could split ciphertext across writes so each individual write lands near ~5.0 entropy, staying below the threshold. This is a known limitation of entropy-based detection in general.

---

## Performance

| Implementation | Idle CPU overhead |
|---|---|
| Go (production) | < 1.4% |
| Python POC | > 6% |

The Go implementation decouples buffer extraction from entropy calculation using a dedicated goroutine draining the BPF ring buffer into channels. A worker pool handles the CPU-bound Shannon math. The Python POC is archived in `poc/` for reference.

---

## Repository Structure

```
cmd/rekd/          Primary Go binary and TUI
internal/bpf/      eBPF C source and Go bindings
tests/             Automated suite with AES-CTR dummy encryptor
poc/python/        Original Python proof-of-concept
scripts/           install.sh / uninstall.sh
docs/              Additional documentation
```

---

## Installation

**Prerequisites:** Linux kernel with BTF support, BCC dev headers, Go compiler.

```bash
sudo ./scripts/install.sh
```

This compiles the eBPF programs, builds the Go binary, and registers a systemd service.

**Daemon mode** (background, logs via systemd):
```bash
sudo systemctl status rekd
```

**Monitor mode** (live TUI with active PIDs, write volumes, entropy ratios):
```bash
sudo systemctl stop rekd
sudo rekd
```

---

## Testing

An AES-CTR encryption simulator and automated test runner live in `tests/`. Running the suite generates a `thekey.key` file locally — this is the simulator's encryption key, gitignored, and safe to ignore.

See `tests/README.md` for execution details.

---

*Proudly a [Spider R&D](https://github.com/SpiderNitt) Cybersecurity project.*
