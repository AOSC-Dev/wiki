+++
title = "Installation/PowerMac/SysReq"
description = "AOSC OS System Requirements for PowerPC/PPC64-based Macintosh Computers"
date = 2020-05-04T03:37:13.928Z
[taxonomies]
tags = ["sys-installation"]
+++

This page provides some general information and suggestions, in hope that it may aid in your choice from various AOSC OS variants provided for PowerPC 32/64-bit systems. Only processor, memory, display, GPU, and storage requirements are provided below.

Moreover, development, and container variants not intended for installation are not discussed here.

# Variants

AOSC OS is provided with the following installable and bootable variants, each with their own features and implications on their system requirements. System requirements may vary greatly between different variants, but processor requirements are known for each architecture (although suggestions will be provided for each variant for ideal experience):

- PowerPC 32-bit: Any processor of this architecture.
- PowerPC 64-bit: Big Endian processors with AltiVec SIMD support.

And provided with the following variants:

- [Base](#base)
- [MATE](#mate)
- [XFCE](#xfce)
- [LXDE](#lxde)
- [i3 Window Manager](#i3-window-manager)

## Base

This variant of AOSC OS is intended for non-graphical and minimal installation, users are provided with basic tools for system management, text editing, network connection, and Internet connectivity support. This variant is suitable for server configuration with additional software packages installed.

- Processor: Any processor supported.
- Memory: 128MB, 512MB recommended for heavier workload (PHP).
- Storage: 2GB, 4GB recommended.
- Display: Not necessary (SSH, Serial).
- GPU: Not necessary.

## MATE

A fork of GNOME 2, therefore less taxing on graphic card (GPU), this is *not* a lightweight desktop environment, however. Any G4-based or newer PowerPC systems should be able to run MATE just fine. MATE Desktop is built against GTK+ 3, a working GPU with 2D acceleration may boost desktop performance dramatically.

G3-class PowerPC systems will not be able to run MATE smoothly - anything older will obviously be less practical.

- Processor: Any processor supported, G4-class recommended.
- Memory: 512MB, 1GB or more recommended for multitasking.
- Storage: 8GB, 16GB recommended.
- Display: SVGA, XGA or higher recommended.
- GPU: Recommended, but framebuffer device support will do.

## XFCE

XFCE is a relatively lightweight, and fully modular desktop environment. XFCE has a smaller memory footprint, and takes less storage space. XFCE is based on GTK 3, thus its system requirements are similar to those of [MATE Desktop](#mate). XFCE will run fine on G3 processors with higher frequency.

- Processor: Any processor supported, G4-class recommended.
- Memory: 256MB, 512MB or more recommended for multitasking.
- Storage: 6GB, 12GB recommended.
- Display: SVGA, XGA or higher recommended.
- GPU: Recommended, but framebuffer device support will do.

## LXDE

LXDE is lighter (yet) than XFCE, also fully modular, and based on GTK+ 3, performance shouldn't be an issue on most PowerPC systems, recommended for energy saving and higher-workload configurations.

- Processor: Any processor supported.
- Memory: 256MB, 512MB or more recommended for multitasking.
- Storage: 6GB, 12GB recommended.
- Display: SVGA, XGA or higher recommended.
- GPU: Recommended, but framebuffer device support will do.

## i3 Window Manager

i3 Window Manager variant of AOSC OS comes with Conky and i3block for system information monitor, and Compton for desktop composition support (disabled on framebuffer devices). This is the lightest variant that comes with a graphical interface, but also comes with a steeper learning curve.

- Processor: Any processor supported.
- Memory: 128MB, 512MB or more recommended for multitasking.
- Storage: 6GB, 12GB recommended.
- Display: SVGA, XGA or higher recommended.
- GPU: Recommended, but framebuffer device support will do.

# Extra Notes

- Web Browsers, especially mainstream choices like Pale Moon and Firefox (for PowerPC/PPC64 at least) may require significantly more memeory capacity and processing power. It will be very difficult to browse any webpage smoothly with a single core G4 with less than 2GB (arguably 4GB) of RAM. As of this note, this Wiki page is edited on a PowerMac G5 Quad (2005) with 8GB of RAM, running Pale Moon 27.
- If you would like to use DKMS-based Linux Kernel addons, it is required for your system to compile these addon modules, which could require a significant amount of processing power - but not necessarily RAM.
- Installing system updates on a 5400 RPM or slower HDD (mechanical hard disk drives, typically found in all G3/G4/G5-based systems) will require significantly greater amount of time.