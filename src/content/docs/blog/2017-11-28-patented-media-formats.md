---
title: Patented Media Formats
description: Blog post originally published on 2017-11-28.
---

> Originally published: 2017-11-28
> Tags: patent, format, video, audio, alchemy
> Authors: luminous

TL;DR Use a format that allows use of the format at no charge to the user or developer of said software and protects you against being sued. I.E. Opus, VP8

Disclaimer: This is not a properly cited article. This is what I know to be true as of today. If there is something wrong. Please contact us and I will update this page and make corrections.

Digital media includes a very large range of formats. Many began life in the 90s when computers when the Internet was starting to take off and digital media was becoming popular. MPEG (Moving Picture Experts Group) is the working group for ISO and IEC standards regarding compression and transmission for audio and video. However, there is a company by a similar name. MPEG LA which is a firm solely for the purposes of licensing patent pools for essentials patents required for legal use of MPEG-2, MPEG-4 Visual (Part 2), IEEE 1394, VC-1, ATSC, MVC, MPEG-2 Systems, AVC/H.264 and HEVC standards. I will be focusing on video compression format H.264 only because it would take quite a bit of time for me to research more into every other format not including all of the audio formats.

H.264 has become the de facto standard for video streaming and compression today. This has many unfortunate side effects. For starters, the H.264 format’s patents are in the MPEG LA patent pool. This means you need to license out use of the patents by paying money to the patent pool. This means if you use H.264 for certain purposes (mainly distributing hardware or software) then you will be required to pay royalties. The amount paid depends on the agreement and the agreement can change. If you are in certain countries, then you can bypass these restrictions easily, but since we are located in the US and our web server (at the time of this writing) is in Canada, we have to obey US and Canada law.

Google and others have created royalty-free video formats that work just as well in most cases as H.264 (VP8) and HEVC (VP9). They do not have the hardware decoding support as widely available as H.264 does, but they do have support on many platforms including ARM and x86 (Intel processors).

As for Alchemy Viewer, we do not enable the H.264 and other patented codecs because of this. If we have something enabled let us know so we can remove it, CEF’s defaults should not have them.

Here are a few references to look at:
1. http://www.zdnet.com/article/a-closer-look-at-the-costs-and-fine-print-of-h-264-licenses/ 
2. http://www.streamingmedia.com/Articles/Editorial/Featured-Articles/What-the-Nokia-Apple-Lawsuit-Means-for-the-Streaming-Industry-115511.aspx
3. https://www.jdsupra.com/legalnews/sling-tv-sued-on-use-of-h-264-standard-77878/
4. https://en.wikipedia.org/wiki/MPEG_LA
