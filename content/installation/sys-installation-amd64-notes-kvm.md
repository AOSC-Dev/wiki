+++
title = "Installation/AMD64/KVM"
description = "Notes for AOSC OS Installation on KVM"
date = 2020-08-16T10:30:21.018Z
tags = "sys-installation"
+++

AOSC OS installation on Qemu/KVM is the same as installing on a regular AMD64/x86_64 system, this section is intended to aid you with configuring the virtual machine, and un-tar-ing the tarballs from outside of the virtual machine.

These two steps below replaces the "Preparing an Installation Environment", "Preparing partitions", and "Un-tar!" sections in the [regular installation guide](/en/sys-installation-amd64).

# Forenotes

- Any commands listed below starting with a `# ` means that the commands are run as the `root` user.

# Prepare the VM hard disk image

Create an empty hard disk image called `aosc.img` with the size of `20GiB`, you will need at least 8GB to use AOSC OS for any practical functions.

```
# qemu-img create -f raw aosc.img 20G
```

Partition the `aosc.img` file.

```
# fdisk aosc.img

Welcome to fdisk (util-linux 2.28.2).
Changes will remain in memory only, until you decide to write them.
Be careful before using the write command.

Device does not contain a recognized partition table.
Created a new DOS disklabel with disk identifier 0xd683cfec.

Command (m for help): n
Partition type
   p   primary (0 primary, 0 extended, 4 free)
   e   extended (container for logical partitions)
Select (default p): p
Partition number (1-4, default 1): 1
First sector (2048-41943039, default 2048):
Last sector, +sectors or +size{K,M,G,T,P} (2048-41943039, default 41943039):

Created a new partition 1 of type 'Linux' and of size 20 GiB.

Command (m for help): w
The partition table has been altered.
Syncing disks.
```

Show the partition table.

```
$ fdisk -l aosc.img
Disk aosc.img: 20 GiB, 21474836480 bytes, 41943040 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: dos
Disk identifier: 0xd683cfec

Device     Boot Start      End  Sectors Size Id Type
aosc.img1        2048 41943039 41940992  20G 83 Linux
```

Create a loop device. In this example, /dev/loop0. Offset is `start * sectorsize`. And sizelimit is `sectors * sectorsize`:

```
# losetup --offset $((2048*512)) --sizelimit $((512*41940992)) --show --find aosc.img /dev/loop0
```

Format it:

```
# mkfs.ext4 /dev/loop0
```

Mount the loop device. For example, under `/mnt`:

```
# mount /dev/loop0 /mnt
```

# Un-tar!

The shell code below shows how it is been done:

```
$ cd /mnt
# tar pxvf /path/to/tarball.tar.xz
```

Now you can umount your image:

```
# umount ${MOUNT}
# losetup -d /dev/loop0
```

# Bootloader!

Here comes the most interesting part. Boot configuration is needed for the un-tar-ed system to boot and initialize.

This part require you to have a working VM. To chroot on your physical system simply won't work as expected. Before continue with installing GRUB as described in the [regular installation guide](/en/sys-installation-amd64), create a VM with the prepared hard disk file, and boot the VM from a LiveCD.

Now you may continue the installation in the VM with the Live system.
