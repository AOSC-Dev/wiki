+++
title = "INFRA-KB-00002: How To Mirror the Community Repository"
description = "A Quick Summary of How to Create a Mirror of AOSC's Repo"
date = 2020-05-04T03:36:21.001Z
[taxonomies]
tags = ["infra-kb"]
+++

Thank you for your interest in mirroring AOSC's Repo.

Believe it or not, AOSC has been around for quite some time now. We do want more people to know about us, and those who we are grateful to. AOSC will never take its shape today without the support from our lovely community and our generous sponsors.

Up to now, we have dozens of downstream mirrors (mainly in China & East Asia), and we continue to seek more down-stream mirrors in other areas (especially in U.S. and EMEA). If you are interested and are able to help, please read the following information.

# Repo Contents
What is included in the repo? Generally everything about AOSC, and most of which are used by AOSC OS (packages, system images, oma repository for the other distros). 

# Repo Size
As of March 2026, the total size of `/anthon` served by Rsync is 2.1TiB: 1.9TiB in the AOSC OS APT repository, 167GiB in the OS release tarballs and installation media, the rest of them are documentations, repacked source code tarballs and other miscellaneous files.

We perform cleanups of outdated packages every month, and the APT repository is usually 2TiB in size after the cleanup. Please make sure that your filesystem has at least 2TiB of free space.

# Modules
Currently the rsync server of AOSC OS Repo has 4 modules:

- `/anthon`: Full content of the repository, including packages and system releases
- `/packages`: All packages in the repository, except system releases
- `/releases`: System releases only (a.k.a., https://releases.aosc.io/)
- `/anthonos`: Same as `/anthon`
- `/anthon-nodbg`: Same as /anthon, excluding debug symbols
- `/packages-nodbg`: Same as /packages, excluding debug symbols

We recommend that you synchronize from `/anthon` or `/anthonos` since they are the full copy. If you are short on space, please consider using `/packages`, `/anthon-nodbg` or `/packages-nodbg` instead.

# How to Mirror
Our main server is `repo.aosc.io`. Due to limited bandwidth, we recommend to synchronizing from our sync-proxy server: `rsync://repo-us.aosc.io/anthon/`.

{% card(type="warning") %}
The current main repository server is located in Hong Kong S.A.R., China. And the sync-proxy server is located in Los Angeles, United States. Thus you may expect slow connection speed during sync. You can try to synchronize your mirror with IPv6 for better connection speeds, if IPv6 Internet access is available.
{% end %}

You may also initialize the mirror by doing rsync from any one of the mirrors providing rsync, like [USTCLUG](https://mirrors.ustc.edu.cn/), [TUNA](https://mirrors.tuna.tsinghua.edu.cn/), etc.

After you have finished the initialization, please inform us by sending an email to our mailing list [`maintainers@aosc.io`](mailto:maintainers@aosc.io) with the name and logo of your identity or organization, plus the URL of your mirror.

When providing public HTTP service, we highly encourage you to use HTTPS.

# Sponsors
Our main repository server is currently sponsored by [Nearoute Limited](https://nearoute.io), and our sync-proxy server is sponsored by [ifanr](https://www.ifanr.com).

[Apernet](https://apernet.io), [xTom](https://xtom.com/) and [OSSPlanet](https://ossplanet.net) previously sponsored our main and backup repository servers.

Please refer to [the sponsors page (Chinese)](https://aosc.io/sponsors) for a complete list of sponsors.

# Question?
Feel free to send your question to the mailing list [`maintainers@aosc.io`](mailto:maintainers@aosc.io).
