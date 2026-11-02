---
# Not a website: this links to Backblaze's case study about the archive move.
title: SM Studios
url: https://www.backblaze.com/cloud-storage/case-studies/steve-mccurry-studios
url_label: Backblaze case study
screenshot_alt: Screenshot of the Backblaze case study about the SM Studios archive move
client_type: Digital asset manager (staff)
year: "2020–21"
stack: [Apple Xsan, Nexsan, Archiware P5, Backblaze B2, Backblaze Fireball]
featured: true
summary: Moved 265 TB of a photographer's archive to cloud storage before consolidating two studios, so the move never risked the only copy.
screenshot: ./sm-studios.png
screenshot_mobile: ./sm-studios-mobile.png
order: 6
---

## Project Overview

My previous employer's original photography studio was closing, and after nearly everything else
was moved out, what remained was a 265 TB Nexsan storage server. For a while there were two
locations with two groups of staff, and differing workflows meant we couldn't guarantee a 1:1
copy of the data in both locations. The large amount of storage meant a network transfer was not
feasible. With the help of Backblaze, the backup provider, we used their Fireball service to bulk
upload the data. That ensured it was not the only copy: if the existing storage server hardware
didn't survive transit, we could rebuild and restore.

## Project Details & Outcome

The Fireball upload was both stressful and fascinating. We needed four or five Fireballs (which
were just Synology NASs) that each had 6 disks, if I recall correctly. The 265 TB of data on the
server needed to be organized into identically sized buckets for each Fireball, encrypted, with a
very very important key. It was a lot to orchestrate on site, even with our MSP guiding me. After
the transfer came the nerve-wracking packing and shipping, and of course the upload to the cloud.
Once the data was confirmed, using Archiware to view, download, and upload the data, came the
server tear-down.

Again, alone on site but with our MSP as my tech guardian angel, I painstakingly marked each
drive and its corresponding bay, packaged them into anti-static bags and into a custom-made hard
drive box, and lovingly placed them neatly into a bright orange U-Haul box truck. After
meticulous cable documenting, I tore the rest of the tower down, disconnecting and packing the
old Mac tower computer host, the now empty disk arrays, network switches, and UPS battery
backups.

The resulting move went smoothly. I almost wish there was something to add, a problem or
something that we had to work through, but (after a good deal of vacuuming out a decade's worth
of dust) we reassembled it the next day, connected a desktop to the network, and it all came
back up.

## Case Study & Reflection

Due to my previous employer's relative fame in the photography world, and our unique situation,
Backblaze thought it worthwhile to do a case study on it. In it, during the discovery interview,
I was quoted saying that "I'm not an IT guy…" and I kind of resent it now, in hindsight. Because
at the time I was still very much responsible for general IT around the studio, network access,
computer updates, printer connections, password resets, but knew that my knowledge and skills
were just the tip of the IT iceberg.

My knowledge has grown exponentially since then. While I've since left this role, and am in a
non-technical occupation right now, it sparked a new personal interest in understanding storage
infrastructure on a deeper level. I've developed an appreciation for open source software, ZFS,
Linux, and overall just digital sovereignty over the media and content we create and share.
