+++
title = "AOSC OS Filesystem Hierarchy"
description = "AOSC OS Filesystem Hierarchy Specifications"
date = 2020-05-04T03:36:47.545Z
[taxonomies]
tags = ["sys-info"]
+++

The filesystem hierarchy used by AOSC OS is based on FHS (Filesystem Hierarchy Standard), version 2.3 - with extra changes made or suggested by Systemd and AOSC OS developers. Only those differentiated from the standard FHS 2.3 specifications will be discussed below.

For the original FHS 2.3 specifications in HTML, please refer to [here](http://www.pathname.com/fhs/pub/fhs-2.3.html).

# Symbolic Links

In AOSC-style filesystem hierarchy, the `/usr/lib` and `/usr/bin` directories serves *all* libraries and executable binaries available:

- For all ports: `/lib → /usr/lib`.
  - For 64-bit ports: `/lib64 → /usr/lib`, `/usr/lib64 → /usr/lib`.
- For all ports: `/bin → /usr/bin`, `/sbin → /usr/bin`, `/usr/sbin → /usr/bin`.

Two directories in `/var` are also served as symbolic links:

- `/var/run → /run`, and `/var/lock → /run/lock`.

Additionally, for 64-bit systems, extra symlinks were made in the:

- `/usr/lib/64 → /usr/lib64` and `/lib/64 → /usr/lib64`.