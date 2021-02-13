+++
title = "Installation/Retro_i486"
description = "Installing AOSC OS/Retro on i486 Devices"
date = 2021-02-13T16:28:52.708Z
[taxonomies]
tags = ["sys-installation"]
+++

Installation of AOSC OS/Retro on i486 devices.

# Forenotes

- Any commands listed below starting with a `# ` means that the commands are run as the `root` user.

# Choosing a Tarball

All i486 tarballs are generic (universal for all supported devices), the only thing you would have to do here is choosing your favourite one - appropriate for your taste and your use case.

> Note: Another consideration is whether your device is capable for a specific variant, please consult `System Performance (x86)` section on the [Retro/intro](@/aosc-os/retro/intro.md) page for more information.

# Preparing an Installation Environment

It is impossible to install AOSC OS/Retro without a working Live environment or an installed copy of Linux distribution on your local storage. Live disc images are not yet available for AOSC OS/Retro

For installing AOSC OS/Retro, we recommend that you use [TinyCoreLinux](http://tinycorelinux.net/downloads.html), dumped to your USB flash drive - and our guide will assume that you are using CorePlus as the Live environment.

> **Warning: Be sure that you downloaded the CorePlue, only it is bootable.**

> Note: You may need to remove the hard disk from your device and install AOCS OS/Retro on it if your device have a small RAM or don't support booting from CD/USB flash disk.

```
# dd if=nameofimage.iso of=/dev/sdX bs=4M
```

Where:

- `nameofimage.iso` is the filename of your downloaded CorePlus ISO file.
- `/dev/sdX` is the device file for your USB flash disk.

After you are done, boot to CorePlus Live.

## Extra Notes

- If you plan to remove the hard disk and install AOCS OS/Retro, please take care to replace the mount path of the target disk in the later section.
- There are a number of items in CorePlus's boot menu, and any of them will serve our needs.

# Preparing partitions

For the installation of AOSC OS/Retro on i486 devices, we only describe the case of MBR partition tables.

It is relatively easy to use fdisk, provided with CorePlus to configure your partitions. For more details on how to configure your partition with fdisk, please refer to the [fdisk Manual](https://man.archlinux.org/man/fdisk.8).

## Extra Notes

- If you plan on installing AOSC OS/Retro across multiple partitions, please make sure you created a `/etc/fstab` file before you reboot to AOSC OS/Retro - details discussed later.

# Un-tar!

With partitions configured, you are now ready to unpack the AOSC OS/Retro system tarball you have downloaded. Before you start un-tar-ing your tarball, mount your system partition(s) first. Say, if you wanted to install AOSC OS/Retro on partition `/dev/sda1`:

```
# mkdir /root/mnt
# mount -v /dev/sda1 /root/mnt
```

Additionally, say, if you have `/dev/sda2` for `/home`:

```
# mkdir -v /root/mnt/home
# mount -v /dev/sda2 /root/mnt/home
```

And now, un-tar the tarball:

```
# cd /root/mnt
# tar --numeric-owner -pxvf /path/to/tarball/tarball.tar.xz
```

# Initial Configuration

Here below are some extra steps before you configure your bootloader - strongly recommended to avoid potential issues later.

## Bind mount system/pseudo directories

```
# mkdir /root/mnt/run/udev
# for i in dev proc sys run/udev; do mount --rbind /$i /mnt/$i; done
```

## Chroot

Enter AOSC OS/Retro chroot environment:

```
# chroot /root/mnt /bin/bash
```

> Note: Commands in all sections below are executed from chroot.

## /etc/fstab Generation

If you have chosen to use multi-partition layout for your AOSC OS/Retro installation, you will need to configure your `/etc/fstab` file, one fast way to achieve this is `genfstab` :

```
# genfstab -U -p /mnt >> /etc/fstab
```

Check the resulting `/etc/fstab file`, and edit it in case of errors.

## Update, Your, System!

New tarball releases comes out roughly each season (or longer depending on developers' availability), and it is generally a wise choice to update your system first - just to get rid of some old bugs since the tarball's release:

```
# apt update
# apt full-upgrade
```

# Bootloader Configuration

Now you should be able to configure your bootloader, we will use GRUB for the purpose of this installation guide. 

> Note: All commands below are run from within chroot.

Installation and configuration of GRUB is straight forward on BIOS systems, only thing to look out for is where the MBR for your hard drive(s) are. In our example, we assume that your MBR is located on `/dev/sda`, but it may vary, but in most cases, MBR is located on the *hard drive*, but not on *a partition*.

```
# grub-install --target=i386-pc /dev/sda
# grub-mkconfig -o /boot/grub/grub.cfg
```

# User, and Post-installation Configuration

All tarballs do not come with a default user and `root` user is disabled, you would have to create your own account before you reboot into AOSC OS/Retro - while leaving the password empty for the `root` user - you can always use `sudo` for your superuser needs.

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

Edit `/etc/locale.gen` and uncomment needed locales. Generate the locales by running:

```
# locale-gen
```

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

## Configure preset services

> This will use our preset files to enable some services such as `xdm` and `NetworkManager` .

```
# systemctl preset-all
```
