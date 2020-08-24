+++
title = "Known Patch Release Rules"
description = "Useful list of release rules that defines packages that could be updated in the Stable channel"
date = 2020-05-04T03:35:51.153Z
[taxonomies]
tags = ["dev-sys"]
+++

# Description

The AOSC OS "Stable" channel under the new *TODO: SEASONAL UPDATE MODEL* requires that only packages with *known* patch-level release rules could be updated in this channel, for example, when GNOME Terminal (`gnome-terminal`) is to be update from `3.30.0` to `3.30.1`, this is permitted, as we know that this is a patch release as [dictated](https://developer.gnome.org/programming-guidelines/stable/versioning.html.en#stable-unstable-versions) by GNOME - on the contrary, an update from `3.30.0` to `3.31.0` (stable to unstable) or even from `3.30.0` to `3.32.0` (stable to next-stable) are not acceptable.

Presented below is a table that defines all known patch release rules for upstream projects, if it isn't found here, do not push any updates to the "stable" channel - or these updates will be reverted. However, do note that all packages listed in the list of [Exceptions](@/dev/system/cycle-exceptions.md) could be updated in the "Stable" channel without consulting the table below.

# Table of Known Update Rules

| Project or Package Name | Rule Description |
| -------------------------------------------- | ----------------------------- |
| GNOME Desktop and Components | If projects have versions, say, `x.y.z`  or even at times `x.y.z.n`, then any updates to `z` or `n` could be regarded as patch-level releases. `y` must be even numbers. [Source](https://developer.gnome.org/programming-guidelines/stable/versioning.html.en#stable-unstable-versions). |
| KDE Frameworks | If projects have versions, say, `x.y.z`  or even at times `x.y.z.n`, then any updates to `z` or `n` could be regarded as patch-level releases. `y` may be even or odd numbers. [Source](https://community.kde.org/Guidelines_and_HOWTOs/Application_Versioning). |
| Plasma Desktop and Components | If projects have versions, say, `x.y.z`  or even at times `x.y.z.n`, then any updates to `z` or `n` could be regarded as patch-level releases. `y` may be even or odd numbers. [Source](https://community.kde.org/Guidelines_and_HOWTOs/Application_Versioning). |
| KDE Applications | If projects have versions, say, `x.y.z`  or even at times `x.y.z.n`, then any updates to `z` or `n` could be regarded as patch-level releases. `y` may be even or odd numbers. [Source](https://community.kde.org/Guidelines_and_HOWTOs/Application_Versioning). |
| MATE Desktop and Components | If projects have versions, say, `x.y.z`  or even at times `x.y.z.n`, then any updates to `z` or `n` could be regarded as patch-level releases. `y` must be even numbers. [Source](http://wiki.mate-desktop.org/roadmap). |
| XFCE Desktop and Components | If projects have versions, say, `x.y.z`  or even at times `x.y.z.n`, then any updates to `z` or `n` could be regarded as patch-level releases. `y` must be even numbers. [Source](https://xfce.org/about/releasemodel). |
| PostgreSQL | Versions usually formatted as `x.y`, where `y` is considered the patch-level version. Updates, say, from `10.4` to `10.5` is acceptable as a patch-level update. [Source](https://www.postgresql.org/support/versioning/). |
| OpenSSL | Versions usually formatted as `x.y.z(n)`, where `(n)` is usually a Latin letter that indicates the patch-level version. Updates, say, from `1.0.2o` to `1.0.2p` is acceptable as a patch-level update. [Source](https://wiki.openssl.org/index.php/Versioning) |
| Bind | Versions usually formatted as `x.y.z-P(n)`, where `(n)` is an integer, which represents the patch-level. Additionally, only when `y` is an even number should the version be considered as stable. [Source](https://www.isc.org/downloads/software-support-policy/). |
| Nginx | If projects have versions, say, `x.y.z`  or even at times `x.y.z.n`, then any updates to `z` or `n` could be regarded as patch-level releases. `y` must be even numbers. [Source](https://www.nginx.com/blog/nginx-1-12-1-13-released/). |
| Telegram Desktop | Version usually formatted `x.y.z`, updates to `z` could be regarded as patch-level releases, but only if this particular release is not marked as "Pre-release". [Source](https://github.com/telegramdesktop/tdesktop/releases). |
| Darktable | If projects have versions, say, `x.y.z`  or even at times `x.y.z.n`, then any updates to `z` or `n` could be regarded as patch-level releases. `y` must be even numbers. |
| Vile | Versions usually formatted as `x.y(n)`, where `(n)` is usually a Latin letter that indicates the patch-level version. Updates, say, from `9.8s` to `9.8t` is acceptable as a patch-level update. |
| Nauty | Versions usually formatted as `x.y*r*(n)`, where `(n)` is an integer that indicates the patch-level version. Updates, say, from `2.6r10` to `2.6r11` is acceptable as a patch-level update. |
| PCRE (8.x) | This series of PCRE is now under bugfix-only maintenance, and therefore any updates in the 8.x channel should be considered patch-level. [Source](https://www.pcre.org/original/changelog.txt) |
| Tmux | Versions usually formatted as `x.y(n)`, where `(n)` is usually a Latin letter that indicates the patch-level version. Updates, say, from `2.3` to `2.3a` is acceptable as a patch-level update. |
| Ceph | Versions usually formatted as  `x.y.z` , then any updates to `z` could be regarded as patch-level releases. `x` must be even numbers. |
| Intel Threading Building Blocks | Versions usually formatted as `YYYY_U(n)`, where `(n)` is an integer, which represents the patch-level. |
| Semantic Versioning, in general | If projects have versions, say, `x.y.z`  or even at times `x.y.z.n`, then any updates to `z` or `n` could be regarded as patch-level releases. may be even or odd numbers, unless otherwise specified, like in the example of GNOME. [Source](https://semver.org/). |

# Table of Known Unreliable Update Rules

The packages and projects found below should never be updated via the Stable channel.

| Project or Package Name | Note |
| -------------------------------------------- | ----------------------------- |
| Deepin Desktop Environment and Applications | No predictable release and versioning model - as suggested one Deepin developer. |
| LibQalculate | From `2.6.1` to `2.6.2`, for instance, .so version changed from 18 to 19, breaking ABI compatibility. This does not comply with [Semantic Versioning](https://semver.org/). |
| Trinity Desktop Environment and Applications | An apparently patch-level release, say, from `R14.0.4` to `R14.0.5` may introduce changes to build system and mix in a large amount of feature updates. |
| HDF5 (Hierarchical Data Format) | Patch release update changes `sover`, for example, `1.10.1` contains `libhdf5.so.101`, and `1.10.3`, which should have been a patch release update, contains `libhdf5.so.103`, breaking binary compatibility. | 