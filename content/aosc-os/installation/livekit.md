+++
title = "Using LiveKit"
description = "Installing and Maintaining AOSC OS with LiveKit"
date = 2020-05-04T03:37:11.499Z
[taxonomies]
tags = ["sys-installation"]
+++

{% card(type="warning") %}
The installion procedures shown below assumes a *simple system deployment*,
which installs the system into a single ext4 partition. If you would like to
install AOSC OS on multi-partition, RAID, or encrypted configurations, you
may want to refer to our [manual installation guides](/aosc-os/installation/manual/).
{% end %}

Apart from guides on how to create LiveKit media, this guide also outlines two
main use cases for LiveKit, the installation and maintenance of AOSC OS.
LiveKit is a portable AOSC OS installation (i.e. a Live environment) which
provides a self-contained and complete environment deployed on media such as
USB flash drives and optical discs.

Creating the LiveKit Media
==========================

Creating LiveKit media is easy. This section shows how to create USB LiveKit
media under Linux (or other *nix operating systems with the `dd` command
available), Windows, and macOS. To create an optical media, simply use
any optical disc burner to write the .iso you have obtained from the
[Downloads page](https://aosc.io/downloads/).

Linux, *nix, and macOS
----------------------

In operating systems using the `/dev/sdXY` (where X is the device number, denoted
with a letter; Y is the partition number, denoted with a number), please first
identify your USB device (via `lsblk` or simply `ls /dev/sd*`), then execute
the following commands *as root*:

```bash
# aosc-os_livekit_$DATE_$ARCH.iso, where $DATE is the release date, and $ARCH
# is the architecture number which the LiveKit targets. Please refer to your
# download for exact file name.
dd if=aosc-os_livekit_$DATE_$ARCH.iso of=/dev/sdXY status=progress
sync
```

In operating systems what does not use the device name scheme shown above, such
as macOS, the procedure is much of the same: First identify the device node
which represents your USB device (for macOS, use `diskutil list` in the Terminal
application), then run the two commands as shown above using
*superuser privilege*.

Windows
-------

Since there is no easy way to use `dd` or identify device node in a standard
Windows installation (especially in versions prior to Windows 10), we recommend
using the [Rufus](https://rufus.ie/) tool to achieve the same effect.

Please refer to the Rufus site for usage details.

Booting the LiveKit Media
=========================

Before you boot the LiveKit media, several precautions and procedures should be
followed. Here are a few common considerations for your reference:

What devices are supported?
---------------------------

LiveKit supports booting on the following device types:

- BIOS- or (U)EFI-based x86_64 and i486 devices.
- (U)EFI-based, or SBSA and SystemReady ES certified AArch64 devices.
- OpenFirmware- or Petitboot-based PowerPC Macintosh, POWER, and OpenPOWER devices.
- PMON- or Kunlun-based Loongson 2/3 Devices.

Do I have enough RAM?
---------------------

For booting a Live media, assume that your RAM is *at least half the size* of
the iso downloaded. Insufficient RAM will result in failure during start up or
during system installation.

While this is a less common issue with newer devices with RAM sizes in the
gigabytes, devices targetted by AOSC OS/Retro, such as a Pentium MMX computer
with 32MiB of RAM could easily run into this issue.

Other necessary tweaks for Secure Boot-enabled devices
------------------------------------------------------

LiveKit does not, and will probably not support Secure Boot. Therefore, for
UEFI-based systems with Secure Boot support, you *must* disable Secure Boot
in order to boot LiveKit.

Installing AOSC OS
==================

After starting up LiveKit, you should be greeted with a command prompt with
minimal direction shown on screen. To install AOSC OS, first connect to the
Internet with NetworkManager. Simply run the `nmtui` command and you will be
greeted with a simple configuration interface, follow the on-screen directions
to configure your network connection.

After you are connected, you may now use the included [DeployKit](https://github.com/AOSC-Dev/aoscdk-rs)
installer to install AOSC OS. Simply run the following command to start the
DeployKit installer:

```bash
deploykit
```

You should be greeted with a wizard-like installer, simply follow the on-screen
directions to install AOSC OS. This can take between minutes and nearly an hour
depending on your device performance.

Maintaining or Repairing AOSC OS
================================

In case of an unbootable system, or catastrophic system failures, LiveKit could
prove useful as an environment for system maintenance and repair. Here are
several classic use cases, for your reference.

Repairing a Broken ext4 System Partition
----------------------------------------

In case of a broken ext4 system partition, you may experience file access
errors and system boot failure as the Kernel or initialisation mechanism fail
to mount the system partition. Depending on your system configuration, you may
not be able to repair your system partition without the help of an external
environment.

In this case, you may start LiveKit and, as you get to the command prompt, you
may use the `fsck.ext4` command to repair your ext4 partition.

### For Partition on IDE/ATA/SCSI/SAS Devices

```bash
fsck.ext4 -F /dev/sdXY
# Where X is the device number, denoted with a letter; Y is the partition
# number, denoted with a number.
```

### For Partitions on NVMe-based Devices

```bash
fsck.ext4 -F /dev/nvmeXnYpZ
# Where X represents the device node, Y represents the device number, and Z
# represents the partition number, all denoted with numbers.
```

### For Partitions on eMMC or SD Cards

```bash
fsck.ext4 -F /dev/mmcblkXpY
# Where X represents the device number, and Z represents the partition
# number, both denoted with numbers.
```

Continuing an Interrupted System Update
---------------------------------------

In case of power loss, system crash, or other fatal errors during system
updates, or user errors, such as powering down or interrupting system updates,
you may run into boot or startup failures as a result.

To attempt a repair, first identify your system partition by using the
`fdisk -l` command, and mount the system partition, the command differs based
on your storage configuration.

### For Partition on IDE/ATA/SCSI/SAS Devices

```bash
mount /dev/sdXY /mnt
# Where X is the device number, denoted with a letter; Y is the partition
# number, denoted with a number
```

### For Partitions on NVMe-based Devices

```bash
mount /dev/nvmeXnYpZ /mnt
# Where X represents the device node, Y represents the device number, and Z
# represents the partition number, all denoted with numbers.
```

### For Partitions on eMMC or SD Cards

```bash
mount /dev/mmcblkXpY /mnt
# Where X represents the device number, and Z represents the partition
# number, both denoted with numbers.
```

Next, you should connect to the Internet in case of need to download extra
packages as a part of the repair procedures. Simply run the `nmtui` command
and you will be greeted with a simple configuration interface, follow the
on-screen directions to configure your network connection.

After you have successfully connected to your specified network, you may now
switch into your AOSC OS installation by running the following command:

```bash
arch-chroot /mnt
```

If you are able to see the AOSC OS command prompt, please run the following
commands in succession, *only if the current command completes successfully*.
You should see a command prompt ending with `#` with a successfully completed
command (otherwise, in case of an error, you will see `!`; in case of missing
commands or files, you will see `?`):

```bash
dpkg --configure -a
apt -f install
apt full-upgrade
```

After the three commands completed successfully, use the following command to
exit out of your AOSC OS installation:

```bash
exit
```

Further, run the following command to ensure all data are written to the disk:

```bash
sync
```

Finally, to reboot to your AOSC OS installation, execute the `reboot` command.

Repairing Broken GRUB Installations
-----------------------------------

In case of an unbootable system as a result of a broken GRUB installation (this
can happen as a result of an overwritten boot sector, accidentally deleted GRUB
configuration, etc.), you will first need to mount your system partition:

### For Partition on IDE/ATA/SCSI/SAS Devices

```bash
mount /dev/sdXY /mnt
# Where X is the device number, denoted with a letter; Y is the partition
# number, denoted with a number
```

### For Partitions on NVMe-based Devices

```bash
mount /dev/nvmeXnYpZ /mnt
# Where X represents the device node, Y represents the device number, and Z
# represents the partition number, all denoted with numbers.
```

### For Partitions on eMMC or SD Cards

```bash
mount /dev/mmcblkXpY /mnt
# Where X represents the device number, and Z represents the partition
# number, both denoted with numbers.
```

You may now switch into your AOSC OS installation by running the following
command:

```bash
arch-chroot /mnt
```

If you are able to see the AOSC OS command prompt, we may now commence on
repairing your GRUB installation.

### For (U)EFI- or Kunlun-based Systems

Further mount your EFI system partition. You may identify this partition,
labelled as "EFI System," with the `fdisk -l` command. After idenfying your EFI
system partition, run the following command to mount it:

```bash
# $DEVICE is the device node listed in the first column on the line corresponding
# the EFI system parititon (a parition of the "EFI System" type).
mount $DEVICE /efi
```

Execute the following commands in succession to repair your GRUB installation.
*Proceed only if the current command completes successfully*. You should see a
command prompt ending with `#` with a successfully completed command (otherwise,
in case of an error, you will see `!`; in case of missing commands or files, you
will see `?`):

```bash
grub-install --efi-directory=/efi --bootloader-id="AOSC OS"
grub-mkconfig -o /boot/grub/grub.cfg
```

### For BIOS-based Systems

First, identify the disk on which you installed AOSC OS with `fdisk -l`. This
will be listed in a line starting with `Disk`.

Execute the following commands in succession to repair your GRUB installation.
*Proceed only if the current command completes successfully*. You should see a
command prompt ending with `#` with a successfully completed command (otherwise,
in case of an error, you will see `!`; in case of missing commands or files, you
will see `?`):

```bash
# $DEVICE is the disk drive on which you installed AOSC OS.
grub-install $DEVICE
grub-mkconfig -o /boot/grub/grub.cfg
```

### For OpenFirmware-based Systems (Macintosh)

Execute the following commands in succession to repair your GRUB installation.
*Proceed only if the current command completes successfully*. You should see a
command prompt ending with `#` with a successfully completed command (otherwise,
in case of an error, you will see `!`; in case of missing commands or files, you
will see `?`):

```bash
grub-install
grub-mkconfig -o /boot/grub/grub.cfg
```

Further Help Needed?
====================

If you would need further assistance with installing AOSC OS or repairing your
AOSC OS installation, please contact us via [Discord](https://discord.gg/VYPHgt9),
[Telegram](https://t.me/joinchat/QVkNCQXYd_kAOMTX), or #aosc on the
[Libera Chat IRC](https://libera.chat/). Our developers will be ready to assist
and advise to help you navigate this sticky situation.

Reporting Bugs
==============

If you have identified a bug while using LiveKit, or any tools pre-installed
with LiveKit, please [file a bug report](https://github.com/AOSC-Dev/aosc-os-abbs/issues/new?assignees=&labels=&template=bug-report.yml).
