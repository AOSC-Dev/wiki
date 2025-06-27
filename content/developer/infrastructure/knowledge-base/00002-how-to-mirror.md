+++
title = "INFRA-KB-00002: How To Mirror the Community Repository"
description = "A Quick Summary of How to Create a Mirror of AOSC's Repo"
date = 2020-05-04T03:36:21.001Z
[taxonomies]
tags = ["infra-kb"]
+++

Thank you for your interest in mirroring AOSC's Repo.

Believe it or not, AOSC has been around for quite some time now. We do want more people to know about us, and those who we are grateful to. AOSC will never take its shape today without the support from our lovely community and our generous sponsors.

Up to now, we have many mirrors (mainly in China), and we do need more mirrors in other areas (especially in U.S.). If you are interested and able to help us, please read the following information.

# Repo Contents
What is included in the repo? Generally everything about AOSC, and most are of AOSC OS (packages, system images). Some documentations, like *Free Software Localization Guide for Chinese (China) *, are also saved here.

# Repo Size
As of June 2025, the total size of `/anthon` served by Rsync is 1.8TiB: 1.2TiB in the AOSC OS APT repository, 476GiB in the OS release tarballs and installation media, the rest of them are documentations, repacked source code tarballs and other miscellaneous files.

We perform cleanups of outdated packages every month, and the APT repository is usually 1TiB in size after the cleanup. Please make sure that your filesystem has at least 2TiB of free space.

# Modules
Currently the rsync server of AOSC OS Repo has 4 modules:

- `/anthon`: Full content of repo. Include packages and releases.
- `/anthonos`: Same as `/anthon`.
- `/packages`: all content excluding tarball releases
- `/releases`: AOSC OS releases only (same as https://releases.aosc.io/)

You are recommended to sync from `/anthon` or `/anthonos` since they are the full sync. If you are short in storage, you may consider to use `/packages`.

# How to Mirror
If you have enough storage space, please do rsync from our main repo: `rsync://repo.aosc.io/anthon/`. You may not to rsync from IP addresses resolved from the hostname. If you do need to specify the IP family, please use `v4.repo.aosc.io` and `v6.repo.aosc.io` for IPv4 and IPv6 respectively.

{% card(type="warning") %}
The current repository server is located in Hong Kong SAR, China, thus you may expect slow connection speed during sync. You can sync your mirror with IPv6 for better connection speeds, if IPv6 Internet access is available.
{% end %}

You may also initialize the mirror by doing rsync from any one of the mirrors providing rsync, like [USTCLUG](https://mirrors.ustc.edu.cn/) or [Tuna](https://mirrors.tuna.tsinghua.edu.cn/).

After you have finished the initialization, please inform us by sending an email to our mailing list [`maintainers@aosc.io`](mailto:maintainers@aosc.io) with the name and logo of your identity or organization, plus the URL of your mirror.

When providing public HTTP service, we highly encourage you to use HTTPS.

# Sponsors
By now our main repository is kindly sponsored by [Apernet](https://apernet.io). [xTom](https://xtom.com/) and [OSSPlanet](https://ossplanet.net) previously sponsored our main and backup repository servers.

Please refer to [the sponsors page (Chinese)](https://aosc.io/sponsors) for a complete list of sponsors.

# Question?
Feel free to send your question to the mailing list [`maintainers@aosc.io`](mailto:maintainers@aosc.io).
