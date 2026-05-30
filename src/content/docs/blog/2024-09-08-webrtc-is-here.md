---
title: WebRTC, you see?
description: Legacy blog post originally published on 2024-09-09.
---

> Originally published: 2024-09-09
> Tags: alchemy, beta
> Authors: darl

Welcome to the latest Alchemy Viewer update! We've packed this release with a mix of new features, important fixes, and a few tweaks to make everything run just that much smoother. Whether you’re here for the exciting debut of WebRTC voice or to enjoy more reliable performance, we’ve got something for you. As always, we've been listening to your feedback, fine-tuning the experience to make sure your time in-world is better than ever. Let’s jump right in and explore what’s new!

WebRTC voice, the headline feature for this release, has been integrated into Alchemy. This significantly enhances voice chat fidelity in regions where it is supported. As Linden Lab begins to roll out WebRTC voice functionality across the grid in the coming weeks, users can expect broader support for these improvements. Additionally, texture refresh functionality now extends to PBR materials and faces, working similarly to the previous texture refresh system but expanding its capability to handle PBR materials.

Several Linux-specific fixes have been implemented, including improved POSIX compliance for viewer scripts and a bug fix for the dbus service, which now correctly handles SLURLs. Reflection probe and mirror reflection issues have also been addressed, contributing to a more stable and visually accurate experience. Along with general performance and stability improvements, these updates should ensure a smoother experience for all users.

An important note is that WebRTC voice replaces the Vivox voice service that Second Life has historically used. This version of Alchemy supports both the outgoing Vivox voice service and the soon-to-deploy WebRTC voice service. When Linden Lab is ready to implement the server-side changes for this transition, this version of Alchemy will seamlessly connect to the new system as the old system is discontinued. Previous versions of Alchemy will lose voice chat capabilities once Linden Lab makes this change. To continue using voice chat on Second Life with Alchemy after this update, you will need to upgrade to this release or a newer one.

Downloads for Alchemy Beta 7.1.9.2501 are live on the [downloads](/downloads) page.
