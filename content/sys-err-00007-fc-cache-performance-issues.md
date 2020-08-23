+++
title = "SYS-ERR-00007: Performance Issues with Fontconfig <= 2.12.92"
description = "Fc-Cache Algorithm Issues, Long Font Installation Times, and Unresponsive Desktop"
date = 2020-05-04T03:37:39.136Z
[taxonomies]
tags = ["sys-errata"]
+++

# Summary

With Fontconfig version < 2.12.92, an inefficient algorithm has been utilised with its Fontconfig cache generator (`fc-cache`), useful for caching font information, and speeding up font display in graphical applications. However, with larger collections of fonts installed - especially with larger CJK (Chinese, Japanese, and Korean) fonts like `noto-cjk-fonts` - the utility may require several minutes, or more to complete on slower devices (ARM boards, and older PowerPC-based Macintoshes), during which...

- Graphical applications may not launch, or takes minutes to show its interface.
- GNOME Shell in particular may lock up and require a system reboot, which may interrupt system updates or package installation, rendering the system unusable until these operations are manually resumed.

# Possible Cause

It is difficult to digest the causation and the upstream solution to this issue. This is best described from the original upstream bug report, where a faster `fc-cache` implementation was worked on and merged at the end, [ref](https://bugs.freedesktop.org/show_bug.cgi?id=64766).

# Fixed Version

Updating to Fontconfig version > 2.12.6 resolves this issue.