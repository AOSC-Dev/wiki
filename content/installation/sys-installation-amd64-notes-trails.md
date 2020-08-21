+++
title = "Installation/AMD64/*Trails"
description = "Notes for AOSC OS Installation on Bay Trail/Cherry Trail Devices."
date = 2020-08-16T10:25:25.955Z
tags = "sys-installation"
+++

**Give up while you can!** The current state of Linux support on some of the Bay Trail or Cherry Trail devices is to an extent, broken (nor has it never been in a satisfactory state).

Installation steps of AOSC OS on these devices are generally [identical](/en/sys-installation-amd64) as with any other AMD64/x86_64 systems, except that:

- Some eMMC-based devices uses `/dev/mmcblkNpN` for storage devices.
- Extra steps needs to be taken for specific devices.
- Sometimes you simply can't get AOSC OS to work.

# Forenotes

- Any commands listed below starting with a `# ` means that the commands are run as the `root` user.

# Workarounds and Quirks

This section contains device specific tweaks and workarounds. Use these to your own advantage, *if it ain't broken, don't do it*.

# System locks up after starting to boot with GRUB

On certain Bay Trail devices it is possible that the device will freeze after starting to boot the Kernel, showing `loading initrd...`. A workaround is to go to the "boot manager" or "boot device menu" first when you power on your device, then select "AOSC-GRUB" from there.

# KMS doesn't work on Dell Venue 8 Pro

On a Dell Venue 8 Pro, it is possible that enabling KMS (kernel mode settings) will result in a blank screen during the start up process. While you can specify `nomodeset` in the Kernel parameter to work around this issue, with no KMS available, desktops like Plasma and GNOME will have really bad performance, and the touch screen will not work correctly.

A "proper" way to work around this issue is to edit the `/etc/default/grub` file, in the lines saying:

```
# Uncomment to disable graphical terminal
#GRUB_TERMINAL_OUTPUT=console
```

Uncomment the second line shown above, and regenerate your GRUB configuration with:

```
# grub-mkconfig -o /boot/grub/grub.cfg
```

# Slow Mo-o-o-o-tion

Sounds funny, but not funny when you use your device with slow motion I assume? This issue is very easy to fix, as this is a quirk in Kernel clocksource detection. To work around this issue, edit the `/etc/default/grub` file, in the line saying:

```
GRUB_CMDLINE_LINUX_DEFAULT="quiet rw"
```

Change it into:

```
GRUB_CMDLINE_LINUX_DEFAULT="quiet rw clocksource=tsc hpet=off"
```

And regenerate your GRUB configuration with:

```
# grub-mkconfig -o /boot/grub/grub.cfg
```
