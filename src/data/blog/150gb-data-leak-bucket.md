---
author: Sreehari
pubDatetime: 2025-08-22T09:30:00Z
title: "How I Found a 150GB Data Leak on a Dating App (Without Even Having an Account)"
featured: true
draft: false
tags:
  - AppSec
  - Bug Bounty
  - S3
  - Misconfiguration
description: "A story of idle curiosity, a CloudFront XML page, and an unauthenticated S3 bucket exposing 150GB of user data from knot.dating."
---

## It Started With Boredom

I stumbled across **knot.dating** — a new Indian dating startup that had been making some noise. I didn't have an account. I wasn't planning on making one. But I had Burp Suite open, and that was enough of a reason to poke around.

The website itself is just a marketing page — it's not connected to the actual app where the matching happens. So I honestly expected to find nothing interesting. Just some HTML, some images, maybe a contact form.

I was wrong.

---

## Following the Static Resources

While intercepting traffic, I noticed that all the static resources on the website — images, fonts, icons — were being served from a **CloudFront** URL. I hadn't heard much about CloudFront at the time, so I did what any curious person would do: I opened the URL directly.

What came back was an XML page. And in the very first few lines of that XML, there it was — a **S3 bucket name**: `knot-bucket`.

I'd heard of unauthenticated S3 buckets before. I pointed the AWS CLI at it.

```bash
aws s3 ls s3://knot-bucket --no-sign-request
```

It listed everything.

---

## What Was Inside

The bucket wasn't just serving website assets. It was serving *everything*. The directory listing came back with thousands of entries.

At first it looked like harmless stuff — fonts, icons for the app UI:

```
2025-04-21 10:38:35    335.2 KiB Invoice/Inter_18pt-Medium.ttf
2025-04-21 10:38:36     20.7 KiB Invoice/Invoice_KD1001_2025-01-22.pdf
2025-04-21 10:32:32      1.2 KiB Options_Icons/Black_Icons/Birthdate.png
2025-04-21 10:32:33      1.1 KiB Options_Icons/Black_Icons/Car.png
```

But then I found the `production/` prefix. User UUIDs, each with a `profileImages/` folder:

```
2025-08-06 08:03:30    2.7 MiB production/ff5d943f-6f93-4180-ad06-9699c178ec2f/profileImages/IMG_5784.jpeg
2025-08-06 08:03:30    3.1 MiB production/ff5d943f-6f93-4180-ad06-9699c178ec2f/profileImages/IMG_6132.jpeg
2025-08-12 09:00:50    2.7 MiB production/ff712ff8-e032-4e82-a022-ffb80fd246eb/profileImages/809D590D-...jpeg
```

Every single profile photo uploaded by every user of the app. Downloadable. No authentication required.

And then there were the **database snapshots**:

```
dbsnapshot/knot_dating/knot_dating.users/1/part-00011-f1df60d4-....gz.parquet
dbsnapshot/knot_dating/knot_dating.users/1/part-00012-338d9086-....gz.parquet
```

The `dbsnapshot/` prefix contained parquet exports of what appeared to be entire database tables:

- `knot_dating.users`
- `knot_dating.ai_conversations`
- `knot_dating.user_otp`
- `knot_dating.user_whatsapp_messages`
- `knot_dating.invoice`
- `knot_dating.user_transaction`

I didn't download or open the actual data files. The index alone told the story.

---

## The Architecture (As Best I Could Tell)

The setup made sense once I understood it — S3 is fast, cheap, and scales well, so this is a common pattern:

```
App / Website
     ↓
  CloudFront (CDN)
     ↓
  S3 Bucket (knot-bucket)
     ├── Static website assets (fonts, icons)
     ├── production/{user-uuid}/profileImages/
     ├── Invoice/
     └── dbsnapshot/knot_dating/
```

The problem: the S3 bucket had **public unauthenticated read** enabled. And the CloudFront distribution was configured to list bucket contents. So just visiting the CloudFront URL returned a full XML index of everything in the bucket.

---

## The Scope of the Exposure

- **~150GB** of data in total
- **All user profile photos** from the production environment
- **Database snapshots** of core tables including users, OTPs, WhatsApp messages, invoices, and transactions
- **Invoice PDFs** with real customer PII (names, phone numbers, addresses, billing amounts)
- **Conversation logs** (`.txt` files under `develop/` paths)
- Internal development and staging assets

Honestly, I was surprised the photos themselves weren't more "sensitive" in the traditional sense — they're profile pictures people uploaded to a dating app, presumably intending them to be seen. But the ability to **bulk-download every profile photo from every user without any authentication** is a serious privacy violation regardless.

The database snapshots were a different story entirely.

---

## Disclosure & Fix

I reported the issue. The fix was straightforward:

1. **S3 bucket public access** was disabled — unauthenticated reads no longer work
2. **CloudFront** no longer exposes the bucket listing — visiting the CloudFront URL now returns:

```xml
<Error>
  <Code>AccessDenied</Code>
  <Message>Access Denied</Message>
</Error>
```

The fix is confirmed. The bucket is locked down.

They didn't reply to my disclosure. That's a bit disappointing — not for recognition, but because a simple acknowledgment matters when someone takes the time to report responsibly. I deleted all files I had downloaded ( which was some photos to make sure its not placeholder info) and I'm not sharing any bucket contents here.

---

## Takeaways

**For developers:**

- Never let an S3 bucket have public listing enabled, even if you *think* the URL isn't discoverable. CloudFront origins leak bucket names in XML responses by default.
- Separate your static CDN assets from user-generated content and database exports. These should never live in the same bucket with the same ACL.
- Database snapshots should **never** be in a bucket that fronts a public CDN. Ever.
- Run regular audits on your bucket policies. AWS has tooling for this — use it.

**For security folks:**

- When you see CloudFront, check if the origin bucket is listable. It takes 30 seconds and you'd be surprised how often this works.
- XML bucket listings are goldmines — the key names alone tell you the full data architecture of a company.
- `--no-sign-request` is your friend.

---

The irony is that I found all of this *without an account*, *without touching the app*, just by looking at where the website's images were coming from. It's a good reminder that the attack surface of a web product extends far beyond the product itself.
