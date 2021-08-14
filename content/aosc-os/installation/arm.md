+++
title = "Installation/ARM*"
description = "Installing AOSC OS on ARMv7/AArch64 Devices"
date = 2020-05-04T03:37:11.499Z
[taxonomies]
tags = ["sys-installation"]
+++

There really isn't any set way to install AOSC OS on various kinds of ARM devices, this page serves as a index to guide you to various other guides for specific devices.

Please refer to our ARM Board Support Package [Wiki](https://github.com/AOSC-Dev/aosc-os-arm-bsps/wiki) for more information on devices that AOSC OS currently supports, and their installation guides.

# Tarballs?

All tarballs provided in the [Download](https://aosc.io/downloads/) page comes with a unconfigured mainline Linux Kernel, it will not work on most devices without extra configuration, we use the [aosc-mkrawimg](https://github.com/AOSC-Dev/aosc-mkrawimg) to create device-specific images from them - using shell-based recipes.

Device-specific RAW images for MicroSD cards and eMMC storage could be found in the same location.

# Variants and System Requirements

Currently, the following variants of AOSC OS are available for ARMv7/AArch64 devices/systems. Additional consideration is needed for whether your device is capable for a specific variant, please consult the [ARM system requirements](@/aosc-os/installation/sysreq/arm-notes-sysreq.md) page for more information:

## Bootable

- Base
- Cinnamon
- GNOME
- KDE Plasma
- LXDE
- MATE
- XFCE

## Non-bootable

- Container
- BuildKit
