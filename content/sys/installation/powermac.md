+++
title = "Installation/PowerMac"
description = "Installing AOSC OS on PowerPC/PPC64-based Macintosh Computers"
date = 2020-05-04T03:37:16.458Z
[taxonomies]
tags = ["sys-installation"]
+++

**Note: Due to limited device availability, PowerPC 32-bit (`powerpc`) port of AOSC OS is only tested on G3/G4-based, [NewWorld](https://en.wikipedia.org/wiki/New_World_ROM) Apple Macintosh computers; PowerPC 64-bit (`ppc64`, Big Endian) port of AOSC OS is only tested on G5-based Apple Macintosh computers. So yes, these ports are Macintosh-specific as it stands now.**

As stated above, this guide is specific to installing AOSC OS on PowerPC-based (old!) Apple Macintosh computers, using the Yaboot bootloader. Installation is aided with a copy of Debian or Ubuntu Live CD/DVD. Manual installation of AOSC OS on these computers may be quite complex, and each step is crucial for a successful installation - please do not skip any steps!

# Forenotes

- Any commands listed below starting with a `# ` means that the commands are run as the `root` user.

# Choosing a Tarball

All PowerPC 32/64-bit tarballs are generic (universal for all supported devices), the only thing you would have to do here is choosing your favourite one - appropriate for your taste and your use case.

Another consideration is whether your device is capable for a specific variant, please consult the [PowerPC system requirements](@/sys/installation/powermac-notes-sysreq.md) page for more information.

## Bootable

- Base
- MATE
- XFCE
- LXDE
- i3 Window Manager

## Non-bootable
- Container
- BuildKit

We are not going to discuss the deployment of Container and BuildKit in this guide, please check for the guide in [AOSC Cadet Training](https://github.com/AOSC-Dev/aosc-os-abbs/wiki).

# Getting Lubuntu Live

For the purpose of this guide, we recommend that you use a copy of Lubuntu 16.04 LTS, from one of the variants below:

- Desktop image, [download](http://cdimage.ubuntu.com/lubuntu/releases/16.04/release/lubuntu-16.04-desktop-powerpc.iso).
- Alternate image, [download](http://cdimage.ubuntu.com/lubuntu/releases/16.04/release/lubuntu-16.04-alternate-powerpc.iso).

Now, dump the image(s) to your USB flash drive - most NewWorld PowerPC Macintosh supports booting from USB devices.


```
# dd if=nameofimage.iso of=/dev/sdX bs=4M
```

Where:

- `nameofimage.iso` is the filename of your downloaded Lubuntu ISO file.
- `/dev/sdX` is the device file for your USB flash disk.

# Booting Lubuntu Live

You may either boot Lubuntu from a USB flash disk, or from a CD/DVD disc - use the latter only if you can't boot from USB, or if you are using a USB 1.1-based G3 system (burning ISOs should be very easy, not really worth covering here).

## Booting from USB Flash Disk

Try holding Option key right after pressing the power button. If a blue screen with your flash drive show up, you are lucky as you just need to wait until the watch cursor changes back to the normal pointer, click on the Lubuntu image, then on the right arrow to boot. If it did not work that way, please keep reading to make an attempt on manual booting with Open Firmware.

To boot from a USB flash disk, you will need to enter Open Firmware command line when booting up your Macintosh. Enter the Open Firmware command line with the following key combination:

```
Command + Option/Alt + O + F
```

After you are greeted with `OK` and a Open Firmware command line (should be white background with black text), enter the following command (assuming no USB hub or other flash disks are attached):

```
boot ud:2,\\yaboot
```

Note, boot command might differ, on an Early-2005 12-inch PowerBook G4 (1.5GHz G4), the command should be as follows (if using the command above, you will see a gray background with a "forbidden" symbol):

```
boot usb1/disk@1:,\\yaboot
```

You should be greeted with a boot menu:

- If you are using G3/G4, please enter `linux32` and press Enter.
- If you are using G5, please enter `linux64` and press Enter.

## Booting from CD/DVD

Hold `c` while powering on your PowerPC Macintosh to boot from CD/DVD, you should be greeted with a boot menu:

- If you are using G3/G4, please enter `linux32` and press Enter.
- If you are using G5, please enter `linux64` and press Enter.

## Configuring Partitions

PowerPC Macintoshs uses the so-called [Apple Partition Map](https://en.wikipedia.org/wiki/Apple_Partition_Map), which could sound very abstract to many modern (PC) system users. Special tools are also needed to properly partition a hard drive for installation. In a nutshell:

- The first partition is an abstract mapping of the partition map.
- The second partition is the "Bootstrap" partition, containing bootloaders.
- Everything after the first two are free-for-alls.

The first partition won't be able to be mounted as it *is* the partition map itself, while the second partition is HFS (*not* HFS+).

The guide below assumes that you do not have *any* operating system installed on your hard drive, and that no data will be kept (because if you do have an OS installed already, you won't need to get through all this hassle anyway - just resize one of the partitions and create another one for AOSC OS). We will partition the hard drive using the `mac-fdisk` utility, assuming you are installing AOSC OS onto `/dev/sda`:

```
# mac-fdisk /dev/sda
```

Then, in this exact order:

- Press `i` to initialize the partition map, thus creating the weird first partition.
- Press `b` to create the "Bootstrap" partition.

And the rest is up to you. G3/G4 systems generally comes with a (very) small amount of RAM, we recommend that you create a swap partition sized at least 4GB - to ensure daily usage.

Format the "Bootstrap" partition:

```
# mkfs.hfs /dev/sda2
```

# Un-tar!

First of all, mount your system partition (not the "Bootstrap" partition), for this guide, mount it at `/mnt` - assuming that the partition is `/dev/sda3`, as the first two will be taken by the "Map" and "Bootstrap" partitions:

```
# mount /dev/sda3 /mnt
```

Additionally, say, if you have `/dev/sda4` for `/home`:

```
# mkdir -v /mnt/home
# mount -v /dev/sda4 /mnt/home
```

And now, un-tar the tarball:

```
# cd /mnt
# tar --numeric-owner -pxf /path/to/tarball/tarball.tar.xz
```

For a more exciting experience, add verbosity:

```
# cd /mnt
# tar --numeric-owner -pxvf /path/to/tarball/tarball.tar.xz
```

# Initial Configuration

Here below are some extra steps before you configure your bootloader - strongly recommended to avoid potential issues later.

## /etc/fstab Generation

If you have chosen to use multi-partition layout for your AOSC OS installation, you will need to configure your `/etc/fstab` file, one fast way to achieve this is `genfstab`:

```
# /mnt/usr/bin/genfstab -U -p /mnt >> /mnt/etc/fstab
```

## Bind mount system/pseudo directories

```
# for i in dev proc sys; do mount --rbind /$i /mnt/$i; done
```

**Commands in all sections below are executed from chroot.**

But first of all, enter AOSC OS chroot environment:

```
# chroot /mnt /bin/bash
```

For G5-based systems, you may not be able to enter chroot, as the Lubuntu Live provided is 32-bit, while the system to be installed is 64-bit. Please install the following package:

```
# dpkg --add-architecture ppc64
# apt update
# apt install libc6:ppc64
```

## Update, Your, System!

New tarball releases comes out roughly each season, and it is generally a wise choice to update your system first - just to get rid of some old bugs since the tarball's release:

```
# apt update
# apt full-upgrade
```

## Initialization RAM Disk

Use the following command to create initialization RAM disk for AOSC OS.

```
# sh /var/ab/triggered/dracut
```

# Bootloader Configuration

**All commands below are run from within chroot.**

PowerPC-based Macintosh systems use Yaboot as the default bootloader, to install Yaboot:

```
# ybin -v -b /dev/sda2
```

If you have installed AOSC OS on `/dev/sda3`, there is no need to make extra changes to the Yaboot configurations. If not, mount the "Bootstrap" partition:

```
# mount /dev/sda2 /mnt
```

And edit `/etc/yaboot.conf` according to the comments provided.

# User, and Post-installation Configuration

AOSC OS tarball releases comes with a default `aosc` user, and the `root` user disabled. We recommend that you change the name and password of the default user before you reboot into AOSC OS - while leaving the password empty for the `root` user - you can always use `sudo` for your superuser needs.

The default password for `aosc` is `anthon`.

**All commands below are run from within chroot.**

## Renaming Mr. aosc

To rename the `aosc` account:

```
# usermod -d /home/username -l username -m aosc
```

Where `username` is the new name you would want to have for `aosc`.

## Resetting Password

To reset the password for your renamed `aosc` user:

```
# passwd username
```

Where `username` is your new user name.

## Enabling Root

Although strongly discouraged, you can enable the `root` user by setting a password for `root`:

```
# passwd root
```

*Decent Linux users need not the root user.*

## Setting System Timezone

Timezone info are stored in `/usr/share/zoneinfo/<region>/<city>`.

```
# ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
```

## Setting System Language

AOSC OS enables all languages with UTF-8 encoding by default. In rare cases where you (really) want to disable some languages or enable non UTF-8 encodings, edit `/etc/locale.gen` as needed and execute `locale-gen` as root (which might take a long time).

To set default language for all users, edit `/etc/locale.conf`. For example, to set system lanaguage to Chinese Simplified (China):

```
LANG=zh_CN.UTF-8
```

> Notes: After you rebooted the computer into the new system, you may use the `localectl` command to do this:

```
# localectl set-locale "LANG=zh_CN.UTF-8"
```

## Setting System Hostname

To set a hostname for the system, edit `/etc/hostname`. For example, to set the hostname to be *MyNewComputer*:

```
MyNewComputer
```

> Notes: After you rebooted the computer into the new system, you may use the `hostnamectl` command to do this:

```
# hostnamectl set-hostname yourhostname
```


# Extra Notes

This section contains extra information regarding specific devices, and changes needed to fix some known issues found within the ports.

## Uniprocessor or SMP?

By design, we needed to provide two versions of Linux Kernel for PowerPC 32-bit systems, one for uniprocessor (or single processor) systems (any iMac G3/G4/G5, iBook G3/G4, and PowerBook G3/G4), and another for SMP-enabled multi-processor systems (some PowerMac G3/G4/G5).

At Yaboot prompt, pressing Enter will boot the `aoscuni`, or the Kernel for uniprocessor systems (it will work on SMP systems, but showing only one processor core); type in `aoscsmp` and press Enter will boot the Kernel for SMP systems (do not use this on uni-processor systems, as the Kernel will lock up at the first instance).

## ATI Systems

Some PowerPC Macintosh models comes with ATI graphics, and this can be problematic, as the system may lock up randomly when running X11. We will have to disable 3D acceleration to get these systems usable (albeit slower OpenGL performance throughput).

Mount the "Bootstrap" partition:

```
# mount /dev/sda2 /mnt
```

And edit `/etc/yaboot.conf`, to add `radeon.agpmode=-1` to each `append=` lines.

## Wild Colors with OpenGL

Arrrrrghhh! Stop shouting about this, we can't do anything about this until the Kernel DRM and Mesa developers have big endian systems on their hands.

Gosh! Minecraft in blue and red is infuriating.
