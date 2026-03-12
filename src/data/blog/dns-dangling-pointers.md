---
author: Sreehari
pubDatetime: 2025-05-10T14:45:00Z
title: How I Found an Indonesian Gambling Site on .nitt.edu
featured: true
draft: false
tags:
  - Infrastructure
  - Networking
  - DNS
description: Subdomain enumeration, a forgotten sports fest, and a dangling DNS that somehow survived years
---


So I was learning subdomain enumeration. You know how it goes — you start reading about it, then you want to actually _do_ it on something real, and before you know it you're running every tool you have on random targets just to see what comes up.

I picked `nitt.edu`. No particular reason, it was just there.

---

## Running the Tools

I went through the usual lineup — `subfinder`, `amass`, `crt.sh`, the whole thing. Honestly I don't even remember which one first surfaced the interesting result, but at some point I was poking around SecurityTrails and noticed something off.

Most of the institute's subdomains point to two kinds of IPs — either servers on NKN (National Knowledge Network), or a web server in Bangalore. That's the expected pattern. But one subdomain had an IP that didn't fit either of those. It was on DigitalOcean.

That's weird. A student subdomain pointing to a DigitalOcean droplet? Okay, let's go look.

---

## Oh.

I opened it in the browser and got an Indonesian gambling website. Full on _Situs Togel Online Terpercaya_ energy. Lottery betting, casino, the works.

![[Pasted image 20260312144315.png]]

At this point my first instinct wasn't "oh no" — it was more like "...okay how did this happen." So I went to the Wayback Machine and looked up the subdomain.

![[Pasted image 20260312144447.png]]

Turns out it was `sports.nitt.edu` — the website for **Sportsfete**, NITT's annual intra-college sports meet. The Wayback Machine had snapshots going back to when it was a completely legitimate site: event info, about pages, 19+ sporting events, departments competing, the whole thing. Exactly what you'd expect from a college sports fest website.

At some point — probably around COVID or just after — the hosting lapsed. The external server wasn't renewed. But nobody touched the DNS record. So `sports.nitt.edu` just... kept pointing at that IP. And whoever eventually picked up that DigitalOcean IP decided to run a gambling site on it.

Classic **dangling DNS**.

---

## What Actually Happened (My Best Guess)

My working theory: the Spider Web Team (Spider R&D is NITT's research and development club — I'm in the cybersecurity subdivision) used to build and host the Sportsfete website on an external server back in the day. When the hosting stopped being paid for, the DNS record was never cleaned up. The IP got reassigned, someone else picked it up, and now a subdomain of an Indian national institute was quietly serving an Indonesian gambling site to whoever happened to visit it.

![[Pasted image 20260312144002.png]]

I ran it through `urlscan.io` to document it properly. The submitted URL was `sports.nitt.edu`, effective URL resolved to `iqsensato.org`, verdict: **Potentially Malicious**, targeting: Generic Gambling. The main IP flagged as **Malicious Activity** from a Singapore-based DigitalOcean server.

---

## What Happened After

I'm part of Spider's cybersecurity subdomain, so we flagged this to the CSG (Computer Science Group at NITT). The DNS record got fixed.

And then — and this is the part that actually surprised me — a new rule was put in place: **no student body is permitted to point any subdomain to an IP or server outside the NITT network.**

I wasn't involved in drafting that policy. I want to be clear about that. But the timing lined up with my report, and it sounded like this discovery at least contributed to that rule getting formalized. Maybe it would've happened anyway, maybe not. Either way, it's a annoying and good rule.

---

## The Takeaway

Dangling DNS is genuinely underrated as an attack surface. This wasn't a sophisticated hack — no CVEs, no zero-days, nothing exotic. Just a forgotten DNS record and an IP that got reassigned. The institute's subdomain was literally serving malicious content and it probably would've stayed that way indefinitely if nobody looked.

Subdomain enumeration is boring until it isn't.

---

_Tools used: subfinder, amass, crt.sh, SecurityTrails, Wayback Machine, urlscan.io_