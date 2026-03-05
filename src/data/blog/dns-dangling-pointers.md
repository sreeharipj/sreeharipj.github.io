---
author: Sreehari
pubDatetime: 2025-05-10T14:45:00Z
title: "DNS Dangling Pointers: Defending University Infrastructure"
featured: true
draft: false
tags:
  - Infrastructure
  - Networking
  - DNS
description: "Analyzing subdomain takeover risks dynamically, auditing legacy DNS records, and successfully fortifying institutional infrastructure."
---

## The Zombie Subdomains

Large academic institutions accumulate DNS records over decades. Often, a CNAME record will point to a third-party service (like an S3 bucket or a Heroku app) that has long since been decommissioned.

## Subdomain Takeover

If an attacker identifies these "dangling" CNAMEs, they can register the underlying resource on the third-party service. This allows them to serve malicious content under the trusted `.edu` domain, bypassing security controls, and capturing academic credentials.

## Fortification

I developed a distributed scanning architecture to map the entire university DNS space internally, resolving all CNAMEs against active provisioned resources, and automatically alerting the IT team to any vulnerable dangling records before attackers could find them.
