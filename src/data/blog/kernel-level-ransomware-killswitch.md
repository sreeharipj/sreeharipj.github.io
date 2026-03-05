---
author: Sreehari
pubDatetime: 2025-10-15T10:00:00Z
title: "Kernel-Level Ransomware Killswitch: Intercepting vfs_write with eBPF & Go"
featured: true
draft: false
tags:
  - eBPF
  - Go
  - Linux Kernel
description: "Building a high-performance ransomware detector by tracing kernel file operations with eBPF and dropping processes before encryption happens."
---

## The Problem with User-Space Detection

When dealing with ransomware, user-space detection relies heavily on heuristics that can be easily bypassed or suspended by rootkits. By dropping our logic directly into the kernel using **eBPF (Extended Berkeley Packet Filter)**, we can observe block I/O and file system operations in real-time, completely invisible to the attacker.

## Hooking vfs_write

The core concept relies on intercepting `vfs_write` calls using an eBPF `fentry` probe. By calculating the entropy of the buffer being written in a highly optimized C program within the kernel space, we can send alerts to a user-space Go daemon.

```c
SEC("fentry/vfs_write")
int BPF_PROG(vfs_write_enter, struct file *file, const char __user *buf, size_t count, loff_t *pos) {
    // Entropy calculation and filtering logic
    return 0;
}
```

If the entropy exceeds a certain threshold (e.g., indicating encrypted data), the Go application can instantly issue a `SIGKILL` to the offending process.
