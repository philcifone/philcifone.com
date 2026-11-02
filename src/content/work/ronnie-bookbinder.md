---
title: Ronnie Bookbinder
url: https://ronniebookbinder.com
client_type: Painter portfolio & archive
year: 2023–present
stack: [Astro, Tailwind CSS, Nginx, GoAccess]
featured: true
summary: Painting portfolio for an artist on the Main Line, outside of Philadelphia, Pennsylvania. Custom features we worked on together include having every painting show in proportion to its real size. It is quickly growing into a living archive of her work.
screenshot: ./ronnie-bookbinder.png
screenshot_mobile: ./ronnie-bookbinder-mobile.png
order: 1
---

## Project Overview

Ronnie Bookbinder is a painter on the Main Line outside Philadelphia. She taught for 43 years
and shows at the Main Line Art Center and in juried shows around the region. She wanted one
place to send people that showed her work properly and kept her exhibitions and press together.
I took over her website in 2023, and soon grew tired of website builder constraints and
expensive domain renewals. I moved her to a self-hosted, custom built website and saved her
hundreds of dollars in unnecessary domain renewal fees after moving her domain from her previous
registrar.

## The Build

A static site in Astro. It started from an open-source photography portfolio template, which I
reworked for paintings. The whole gallery is driven by one YAML file that lists each painting's
title, collection and size.

The sizes matter. Most portfolio sites show a 12-inch canvas and a 40-inch canvas at the same
size, which hides one of the first things a potential buyer asks about, but more importantly
impacts the artist's intent as perceived by the viewer. Here every painting is drawn in
proportion to its real dimensions. A "view on a wall" button in the lightbox hangs the open
painting above a sofa, both drawn to scale.

## Ownership & Oversight

The site is plain HTML, CSS and images served by nginx from a small VPS I run. There is no
database, no plugins to update and no platform fee. Any web host could serve the built folder
as it is. I also look after her domain, so it renews on time at a fair price.

A self-hosted Uptime Kuma monitor checks the site every minute, and I of course get pinged as
the web admin. Instead of Google Analytics, a script on my development machine reads the last
month's server logs using GoAccess and emails Ronnie and me a styled, large-print summary. No
third party sees her visitors: no cookies, no trackers.
