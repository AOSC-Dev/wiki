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

**Note**: AOSC migrated the repo server on Dec 29, 2018. If your mirror site encounters problem, please refer to [this article](@/infra/kb/00003-repository-migration.md) for more information and contacts.

# Repo Contents
What is included in the repo? Generally everything about AOSC, and most are of AOSC OS (packages, system images). Some documentations, like *Free Software Localization Guide for Chinese (China) *, are also saved here.

# Repo Size
Up to now (March, 2019), the repo is taking ~800GB of disk. You may expect that the repo will grow to around 1TB or more.


# Modules
Currently the rsync server of AOSC OS Repo has 4 modules:

- anthon: Full content of repo. Include packages and releases.
- anthonos: The same as anthon.
- packages: all content excluding tarball releases
- releases: AOSC OS releases only (same as https://releases.aosc.io/)

You are recommended to sync from `anthon` or `anthonos` since they are the full sync. If you are short in storage, you may consider to use `packages`.

# How to Mirror
If you have enough hard disk space, please do rsync from our main repo: rsync://repo.aosc.io/anthon/. 

You are not recommended to use IP anymore, while you might use (v4, v6).repo.aosc.io if you want to enforce IP version.

Please be noted that the repo is located in US, and the network connection could be VERY slow if you are in Mainland, China.

You may also initialize the mirror by doing rsync from any one of the mirrors providing rsync, like [USTCLUG](https://mirrors.ustc.edu.cn/) or [Tuna](https://mirrors.tuna.tsinghua.edu.cn/).

After you have finished the initialization, please tell us by sending an email to our mailing list: mirrors@lists.aosc.io, including your name (which will be listed on sponsors) and mirror URL.

When providing public HTTP service, we highly encourage you to use HTTPS.

# Sponsors
The main repository is kindly sponsored by [xTom](https://xtom.com); the secondary repository is sponsored by [OSSPlanet](http://ossplanet.net/).

For other sponsors, please refer to https://aosc.io/mirror-status (list of mirrors) and https://aosc.io/about (all general sponsors).

# Question?
Feel free to send your question to the mailing list mirrors@lists.aosc.io .
