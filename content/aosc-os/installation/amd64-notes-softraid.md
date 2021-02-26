+++
title = "Installation/AMD64/SoftRAID"
description = "Notes for AOSC OS Installation on Devices with Software RAID Set Up(s)."
date = 2020-05-04T03:36:58.392Z
[taxonomies]
tags = ["sys-installation"]
+++

Installing AOSC OS on software-RAID configuration may require extra steps after installing using the [regular installation guide](@/aosc-os/installation/amd64.md).

# Forenotes

- Any commands listed below starting with a `# ` means that the commands are run as the `root` user.

# Extra Initialization RAM Disk Configuration

A initrd/initramfs is required for a system on an array to boot successfully. Moreover, changes to the `dracut` configuration file is also required for the generated initrd/initramfs to detect your software RAID setup.

Using your preferred text editor, edit `/etc/dracut.conf`, and add the following lines to the file:

```bash
# For MD-RAID support modules
add_dracutmodules+=" mdraid "
# Use generated mdadm.conf
mdadmconf="yes"
```


And now invoke generation of new initrd(s).

```
# update-initramfs
```

# Extra Kernel Parameters

Open `/etc/default/grub` with your preferred text editor. On the line starting with `GRUB_CMDLINE_LINUX_DEFAULT`, add `rd.auto rd.auto=1` inside the quotation marks, save the file on exit - and regenerate GRUB configuration.

```
# grub-mkconfig -o /boot/grub/grub.cfg
```

# MDADM Configuration

Generate mdadm.conf with the following command:

```
# mdadm --detail --scan >> /etc/mdadm.conf
```
