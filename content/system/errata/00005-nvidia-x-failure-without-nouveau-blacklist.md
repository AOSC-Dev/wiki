+++
title = "SYS-ERR-00005: X11 Graphical Interface Fails to Start on Systems with Dedicated NVIDIA Graphics"
description = "Incompatibilities between Nouveau DRM/GL/X stack with NVIDIA's GL/X Stack"
date = 2020-05-04T03:37:34.043Z
[taxonomies]
tags = ["sys-errata"]
+++

# Summary

When using AOSC OS on AMD64 systems with *dedicated* NVIDIA graphics (not notebook or desktop computers utilising switchable graphics - say, an Intel integrated graphics and an NVIDIA graphics card) - and should one choose to use the proprietary NVIDIA Unix Drivers over the open-source Nouveau drivers, these two packages need to be installed (and respective packages with `+32` suffix for 32-bit applications; and `+340` packages for older NVIDIA cards, as suggested [here](http://www.nvidia.com/object/unix.html)):

- `nvidia`, NVIDIA Kernel DRM (Direct Rendering Manager) Modules, OpenGL, and X11 runtimes.
- `nvidia-libgl`, symbolic links to replace default, open-source OpenGL and X11 runtimes.

When these two packages are installed and that AOSC OS is restaretd, the X11 graphics interface may fail to start - all display managers (login interface) graphical applications, or desktop environments. You may also see several errors output by the `nouveau` kernel driver.

# Possible Cause

AOSC OS does not disable the default `nouveau` Kernel modules even when the proprietary drivers are installed. However, the Linux Kernel will prefer in-tree modules over the out-of-tree NVIDIA drivers (that "taints" the Kernel) - as `nouveau` is loaded over `nvidia`, the former is incompatible with the runtime libraries replaced by the `nvidia-libgl`, `nvidia-libgl+32`; or `nvidia-libgl+340`, `nvidia-libgl+340+32` packages.

This incompatibility results in the above-mentioned failures.

# Fixed Version

No fixed version has been released or planned at the time of writing.

## Workaround

This section details the procedures to workaround this issue on AMD64-based systems, which involves altering GRUB configurations. Using your preferred text editor, edit the main GRUB configuration file...

```
$ sudo nano /etc/defaults/grub
```

And append the following to the line beginning with `GRUB_CMDLINE_LINUX_DEFAULT=`...

```
modprobe.blacklist=nouveau
```

Resulting in a line similar to the following...


```
GRUB_CMDLINE_LINUX_DEFAULT="quiet rw ... modprobe.blacklist=nouveau"
```

Finally, re-generate GRUB configurations and restart your computer...

```
$ sudo grub-mkconfig -o /boot/grub/grub.cfg
$ sudo reboot
```