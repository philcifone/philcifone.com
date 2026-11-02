---
title: Cifone Brothers Painting
url: https://cifonebrotherspainting.com
client_type: Small business
year: "2026"
stack: [Hugo, SCSS, LXC, Cloudflare Tunnel]
featured: false
summary: Website for my brother and me to point potential house painting clients to. Kept simple and hosted locally, with no JavaScript, no form service and no tracking.
screenshot: ./cifone-brothers-painting.png
screenshot_mobile: ./cifone-brothers-painting-mobile.png
order: 4
---

## Project Overview

My brother Pete and I run Cifone Brothers Painting, a small painting business around
Philadelphia and the Main Line. I wanted something to point potential clients to. A website that
loads fast on a phone, puts the phone number one tap away and shows up when someone nearby
searches for a painter.

## The Build

A Hugo site with SCSS and no JavaScript. The business details live in one config file, so every
page and the search-engine data stay consistent. On phones, a call button stays at the bottom of
the screen. Email is a plain `mailto:` link, with no form service. I'm a big fan of using native
tools and keeping simple things, simple. The site is SEOptimized, as any modern, competitive
business site should be.

## Ownership & Oversight

The site runs in an LXC container on my home server and reaches the internet through a
Cloudflare Tunnel, so it needs no open ports at home. Uptime Kuma monitors it, and pings me upon
any downtime. The build is a plain folder of static files that any web host could serve.
