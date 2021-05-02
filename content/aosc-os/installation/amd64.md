+++
title = "Installation/AMD64"
description = "Installing AOSC OS on AMD64/x86-64 Devices"
date = 2020-05-04T03:37:06.202Z
[taxonomies]
tags = ["sys-installation"]
+++

Installation of AOSC OS on x86-64 systems/environments are generally universal for all systems of this architectures. But for some specific device configurations and virtualized environments, here below are some extra notes:

- [Notes for KVM](@/aosc-os/installation/amd64-notes-kvm.md)
- [Notes for Bay Trail/Cherry Trail](@/aosc-os/installation/amd64-notes-trails.md)
- [Notes for software RAID](@/aosc-os/installation/amd64-notes-softraid.md)

# Forenotes

- Any commands listed below starting with a `# ` means that the commands are run as the `root` user.

# Choosing a Tarball

All AMD64/x86-64 tarballs are generic (universal for all supported devices), the only thing you would have to do here is choosing your favourite one - appropriate for your taste and your use case.

> Note: Another consideration is whether your device is capable for a specific variant, please consult the [AMD64/x86-64 system requirements](@/aosc-os/installation/amd64-notes-sysreq.md) page for more information.

## Bootable

- Base
- Cinnamon
- GNOME
- KDE Plasma
- MATE
- LXDE
- XFCE

## Non-bootable

- Container
- BuildKit

# Preparing an Installation Environment

It is impossible to install AOSC OS without a working Live environment or an installed copy of Linux distribution on your local storage. Live disc images are not yet available for AOSC OS

For installing AOSC OS, we recommend that you use [GParted Live](https://sourceforge.net/projects/gparted/files/gparted-live-stable/), dumped to your USB flash drive - and our guide will assume that you are using GParted Live.

> **Warning: Be sure that you downloaded the amd64 version, or else you won't be able to enter AOSC OS chroot environment!**

> Note: You may not be able to connect to network when using VMware.

```
# dd if=nameofimage.iso of=/dev/sdX bs=4M
```

Where:

- `nameofimage.iso` is the filename of your downloaded GParted Live ISO file.
- `/dev/sdX` is the device file for your USB flash disk.

After you are done, boot to GParted Live.

# Preparing partitions

On AMD64/x86-64, AOSC OS supports GUID (EFI) or MBR (traditional BIOS) partition tables - if you plan on multi-booting AOSC OS with other Linux distributions, Microsoft Windows, or Apple macOS, they generally uses GUID on newer machines, and MBR on older ones.

It is relatively easy to use GParted, provided with GParted Live to configure your partitions. For more details on how to configure your partition with GParted, please refer to the [GParted Manual](http://gparted.org/display-doc.php?name=help-manual).

## Extra Notes

- If you plan on installing AOSC OS across multiple partitions, please make sure you created a `/etc/fstab` file before you reboot to AOSC OS - details discussed later.
- If you plan on using the ESP (EFI System Partition) as your `/boot` partition, extra actions may be needed when updating the Linux Kernel - details discussed later.

# Un-tar!

> **WARNING：please check the file permisson after untarring the tarball，if not, the following installation may fail.** Right permission should be something like this：(the owner in the list should be root:root）
>
> ```
> # ls -l
> total 60K
> lrwxrwxrwx  1 root root    7 Apr  5 05:31 bin -> usr/bin/
> drwxr-xr-x  4 root root 4.0K Apr  5 05:38 boot/
> drwxr-xr-x  3 root root 4.0K Apr  5 05:31 dev/
> drwxr-xr-x 74 root root 4.0K Apr  5 05:35 etc/
> drwxr-xr-x  2 root root 4.0K Apr  5 05:31 home/
> lrwxrwxrwx  1 root root    7 Apr  5 05:31 lib -> usr/lib/
> lrwxrwxrwx  1 root root    7 Apr  5 05:31 lib64 -> usr/lib/
> drwxr-xr-x  4 root root 4.0K Apr  5 05:31 media/
> drwxr-xr-x  2 root root 4.0K Apr  5 05:31 mnt/
> drwxr-xr-x  2 root root 4.0K Apr  5 05:31 opt/
> drwxr-xr-x  2 root root 4.0K Apr  5 05:31 proc/
> drwxr-x---  2 root root 4.0K Apr  5 05:38 root/
> drwxr-xr-x  7 root root 4.0K Apr  5 05:32 run/
> lrwxrwxrwx  1 root root    7 Apr  5 05:31 sbin -> usr/bin/
> drwxr-xr-x  2 root root 4.0K Apr  5 05:31 srv/
> drwxr-xr-x  2 root root 4.0K Apr  5 05:31 sys/
> drwxrwxrwt  2 root root 4.0K Apr  5 05:31 tmp/
> drwxr-xr-x  9 root root 4.0K Apr  5 05:31 usr/
> drwxr-xr-x 13 root root 4.0K Apr  5 05:35 var/
 

With partitions configured, you are now ready to unpack the AOSC OS system tarball you have downloaded. Before you start un-tar-ing your tarball, mount your system partition(s) first. Say, if you wanted to install AOSC OS on partition `/dev/sda2`:

```
# mount -v /dev/sda2 /mnt
```

Additionally, say, if you have `/dev/sda3` for `/home`:

```
# mkdir -v /mnt/home
# mount -b /dev/sda3 /mnt/home
```

And now, un-tar the tarball:

```
# cd /mnt
# tar --numeric-owner -pxvf /path/to/tarball/tarball.tar.xz
```

**Notes:** 
- When executing un-tar, be sure to use the root user to execute.
- If you want to have full-disk encryption with `dm-crypt` under `LUKS` before installation, configure it here. Refer to [this article](https://wiki.archlinux.org/index.php/Dm-crypt/Encrypting_an_entire_system) for details. Mount the mapped `luks-*` virtual partition instead of bare `sda2`.

# Initial Configuration

Here below are some extra steps before you configure your bootloader - strongly recommended to avoid potential issues later.

## /etc/fstab Generation

If you have chosen to use multi-partition layout for your AOSC OS installation, you will need to configure your `/etc/fstab` file, one fast way to achieve this is `genfstab` :

```
# /mnt/usr/bin/genfstab -U -p /mnt >> /mnt/etc/fstab
```

## Bind mount system/pseudo directories and Chroot

Enter AOSC OS chroot environment:

```
# /usr/bin/mnt/arch-chroot /mnt /bin/bash
```

If you failed to enter chroot, you have probably not downloaded the amd64 version (gosh, we got it in bold as well...).

> Note: Commands in all sections below are executed from chroot.

## Update, Your, System!

New tarball releases comes out roughly each season (or longer depending on developers' availability), and it is generally a wise choice to update your system first - just to get rid of some old bugs since the tarball's release:

```
# apt update
# apt full-upgrade
```

## Initialization RAM Disk

Use the following command to create initialization RAM disk for AOSC OS.

```
# update-initramfs
```

# Bootloader Configuration

Now you should be able to configure your bootloader, we will use GRUB for the purpose of this installation guide. Installation of GRUB differs for EFI and BIOS systems, and thus they will be separated to two sections.

> Note: You would need GRUB 2.02 (`grub` version `2:2.0.2`) to support NVMe-based storage devices as boot drives.

> Note: All commands below are run from within chroot.

## EFI Systems

To install GRUB for EFI systems, mount your ESP partition, generally `/dev/sda1` to `/efi` (change device name if appropriate):

```
# mount /dev/sda1 /efi
```

Then, install GRUB to the partition, and generate a GRUB configuration:

```
# grub-install --target=x86_64-efi --bootloader-id="AOSC OS" --efi-directory=/efi
# grub-mkconfig -o /boot/grub/grub.cfg
```

For some Bay Trail devices, you might need to install for `i386-efi` target instead - do not use the following command unless you are sure about what you are doing:

```
# grub-install --target=i386-efi --bootloader-id="AOSC OS" --efi-directory=/efi
# grub-mkconfig -o /boot/grub/grub.cfg
```

## BIOS Systems

Installation and configuration of GRUB is straight forward on BIOS systems, only thing to look out for is where the MBR for your hard drive(s) are. In our example, we assume that your MBR is located on `/dev/sda`, but it may vary, but in most cases, MBR is located on the *hard drive*, but not on *a partition*.

```
# grub-install --target=i386-pc /dev/sda
# grub-mkconfig -o /boot/grub/grub.cfg
```

# User, and Post-installation Configuration

All tarballs do not come with a default user and `root` user is disabled, you would have to create your own account before you reboot into AOSC OS - while leaving the password empty for the `root` user - you can always use `sudo` for your superuser needs.

## Add a user

To add a new user, (`aosc` as an example), use the `useradd` command: 

```
# useradd -m -s /bin/bash aosc
```

Make sure that your username contains only lower-cased letters and numbers.

And add additional groups to the user (audio, cdrom, video, wheel should get you started just fine):

```
# usermod -a -G audio,cdrom,video,wheel aosc
```

## Setting full name for your user

To set a full name for your user (also using `aosc` as an example, replace "AOSC User" with your desired name:

```
# chfn -f "AOSC User" aosc
```

## Setting password

Although it is not required to protect the newly created user `aosc` with a password, it is highly recommend to do so: 

```
# passwd aosc
```

## Enabling Root

Although strongly discouraged, you can enable the `root` user by setting a password for `root`:

```
# passwd root
```

> Note: Decent Linux users need not the root user.

## Setting System Timezone

Timezone info are stored in `/usr/share/zoneinfo/<region>/<city>`.

```
# ln -svf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
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
