+++
title = "SYS-KB-00001: Configuration of APT Repositories"
description = "Information on Enabling or Disabling APT Repositories on AOSC OS"
date = 2020-05-04T03:37:24.248Z
[taxonomies]
tags = ["sys-kb"]
+++

# APT Configuration

This page describes the `apt-gen-list` utility pre-installed with AOSC OS. This utility is used to configure (enable or disable) mirrors used for APT software repositories, and to generate `/etc/apt/sources.list` for APT to use. This could be handy, with knowledge of fastest repository mirrors at your location.

Shown below is the original usage message for this utility:

```
Usage: apt-gen-list [stdout] [m [-|+]MIRROR1 ...] [c [-|+]COMP1 ...] [b BRANCH]
       apt-gen-list now
       apt-gen-list avail
       apt-gen-list help

Keywords:
    "mirror" is equivalent to "m";
    "branch" is equivalent to "b";
    "component" is equivalent to "c".

Examples:
    1. To set mirrors to "origin" and "baz":
        # apt-gen-list mirror origin baz

    2. To disable mirror "origin":
        # apt-gen-list mirror -origin

    3. To enable component "opt-avx2" and disable "bsp-sunxi":
        # apt-gen-list c +opt-avx2 -bsp-sunxi

    4. To set the branch to "testing":
        # apt-gen-list b testing

    5. To set the branch to "testing" and enable component "bsp-sunxi":
        # apt-gen-list branch testing component +bsp-sunxi

    6. To disable component "main":
        # apt-gen-list c -main
        => This is a no-op because "main" is mandatory

    7. To reset everything to default values:
        # apt-gen-list m b c
        => It is equivalent to
        # apt-gen-list mirror origin branch stable component main

    8. To re-generate sources.list:
        # apt-gen-list
```
