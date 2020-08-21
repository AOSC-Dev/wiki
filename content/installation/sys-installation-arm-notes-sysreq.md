+++
title = "Installation/ARM*/SysReq"
description = "AOSC OS System Requirements for ARMv7/AArch64 Devices"
date = 2020-08-19T15:38:01.208Z
tags = "sys-installation"
+++

This page provides some general information and suggestions, in hope that it may aid in your choice from various AOSC OS variants provided for ARMv7 and AArch64 systems. Device-specific support will *not* be discussed here, only processor, memory, display, GPU, and storage requirements are provided below.

Moreover, development, and container variants not intended for installation are not discussed here.

# Variants

AOSC OS is provided with the following installable and bootable variants, each with their own features and implications on their system requirements. System requirements may vary greatly between different variants, but processor requirements are known for each architecture (although suggestions will be provided for each variant for ideal experience):

- ARMv7: Any processor with ARMv7-A+, and NEON FPU support.
- AArch64: Any AArch64, 64-bit ARMv8 processor.

And provided with the following variants:

- [Base](#base)
- [GNOME](#gnome)
- [MATE](#mate)
- [XFCE](#xfce)
- [LXDE](#lxde)
- [i3 Window Manager](#i3-window-manager)

## Base

This variant of AOSC OS is intended for non-graphical and minimal installation, users are provided with basic tools for system management, text editing, network connection, and Internet connectivity support. This variant is suitable for server configuration with additional software packages installed.

- Processor: Any processor supported.
- Memory: 128MB, 512MB recommended for heavier workload (Node.js).
- Storage: 2GB, 4GB recommended.
- Display: Not necessary (SSH, Serial).
- GPU: Not necessary.

## GNOME

GNOME, with its GNOME Shell interface, is a fully featured desktop environment with relatively high demand on processor, memory, and GPU. Not many ARM devices are capable of running GNOME smoothly.

- Processor: Any processor supported, quad core recommended.
- Memory: 512MB, 2GB or more recommended for multitasking.
- Storage: 8GB, 16GB recommended.
- Display: XGA, 1080p or higher recommended.
- GPU: Recommended, with OpenGL 2.1+ or GLES2 support.

## MATE

A fork of GNOME 2, therefore less taxing on graphic card (GPU), this is *not* a lightweight desktop environment, however. ARMv7 boards like the Raspberry Pi 2 can run MATE Desktop just fine. MATE Desktop is built against GTK+ 3, a working GPU with 2D acceleration may boost desktop performance dramatically.

- Processor: Any processor supported, dual core recommended.
- Memory: 512MB, 1GB or more recommended for multitasking.
- Storage: 8GB, 16GB recommended.
- Display: SVGA, XGA or higher recommended.
- GPU: Recommended, but framebuffer device support will do.

## XFCE

XFCE is a relatively lightweight, and fully modular desktop environment. XFCE has a smaller memory footprint, and takes less storage space. XFCE is based on GTK 3, thus its system requirements are similar to those of [MATE Desktop](#mate).

- Processor: Any processor supported, dual core recommended.
- Memory: 256MB, 512MB or more recommended for multitasking.
- Storage: 6GB, 12GB recommended.
- Display: SVGA, XGA or higher recommended.
- GPU: Recommended, but framebuffer device support will do.

## LXDE

LXDE is lighter (yet) than XFCE, also fully modular, and based on GTK+ 3, performance shouldn't be an issue on most ARM devices/systems, recommended for energy saving and higher-workload configurations.

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
