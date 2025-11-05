+++
title = "Raspberry Pi Installation guide"
description = "Install AOSC OS on ARM64 Raspberry Pi boards"
date = 2021-11-16
[taxonomies]
tags = ["sys-installation"]

+++

[general-postinst]: /aosc-os/installation/manual/amd64#user-and-post-installation-configuration
[troubleshooting]: /aosc-os/devices/raspberrypi/troubleshooting

With community support you can enjoy AOSC OS in your Raspberry Pi with ease.  
There are many way to boot Linux on a Raspberry Pi, e.g. UEFI, U-Boot, etc. This tutorial is meant for plain boot method.

Following this tutorial, you will bootstrap the entire OS from existing AOSC OS installation. The effort to publish ready to flash images is ongoing.

If you have any questions, please checkout [our Raspberry Pi FAQ and troubleshooting page][troubleshooting].

# Supported boards

Technically all Raspberry Pis equipped with an ARM64 CPU are compatible with mainline AOSC OS, including:

- Raspberry Pi 5th gen boards (BCM2712)
  - Raspberry Pi 5
  - Raspberry Pi 500
  - Raspberry Pi 500+
  - Compute Module 5
- Raspberry Pi 4th gen boards (BCM2711)
  - Raspberry Pi 4B (all variants)
  - Raspberry Pi 400
  - Compute Module 4
- Raspberry Pi 3th gen boards (BCM2837A0/B0)
  - Raspberry Pi 3/3B/3B+
  - Compute Module 3

  # Known Problems

- Hardware decoding is not working on 64-bit systems, see [here](https://github.com/raspberrypi/userland/blob/9f3f9054a692e53b60fca54221a402414e030335/CMakeLists.txt#L11) and [here](https://www.raspberrypi.org/forums/viewtopic.php?t=232684&start=25)
- The `raspi-config` tool previously available in the AOSC package repository came from [cyanberry-config](https://github.com/AOSC-Archive/cyanberry-config). This project is now archived and no longer recommended to use.

# In this tutorial

You will go through these steps by following the tutorial:

1. Partition and format the target drive
2. Install AOSC OS on target drive
3. Install Raspberry Pi BSPs (board support package)
4. Generic post installation process
5. Plugin and run

# Installation

Getting started
--------

Please check if you have all of these things listed here:

- A supported Raspberry Pi board.
- A storage device to install OS. It can be a SD card, or a SSD/HDD in an USB enclosure.
  - A good enough SD Card reader which does not corrupt your SD card, if a SD card is used.
- A working Internet connection via Ethernet.

#### Dependencies

Following packages are required to be installed:

- `dosfsutils`
- `e2fsprogs`
- `arch-chroot`
- `fdisk`

If your host machine is not arm64 based, you should set up binfmt to complete the post-installation process:

```sh
sudo apt install qemu-user-static
sudo systemctl restart systemd-binfmt.service
```

**Plug your drive into the PC, we assume your drive is appeared as `/dev/sda`.**   
If you are uncertain about which device is, run `lsblk` may help you identifying it.

Partitioning the drive
--------

We use GPT partition table for Raspberry Pi 4, MBR for Raspberry Pi 3.

You need at least two partitions on the target drive first:

1. A FAT32 boot partition, at least 200MiB, and it must be the first partition. This partition is the boot partition of your Pi. It contains firmware, board configuration, kernel and initramfs image.
2. A root filesystem partition. You can choose a filesystem whatever you want, just if kernel and initramfs supports it. For this tutorial we will use `ext4`.
   - LVM is bootable only if you have supported initrd image placed in boot partition and correctly set up.

To complete the partitioning, make sure your target disk is not mounted or you will have to replug it again to get new partition table probed.

#### For Raspberry Pi 4 and up (GPT)

The following script will create two partitions with GPT partition table on `/dev/sda`, 200MiB for boot and rest for root partition:

```sh
sudo -s
sfdisk /dev/sda << EOF
label:gpt

start=2048, size=200MiB, type=C12A7328-F81F-11D2-BA4B-00A0C93EC93B,
type=0FC63DAF-8483-4772-8E79-3D69D8477DE4,
EOF
```

#### For Raspberry Pi 3 (MBR)

The following script will create two partitions with MBR partition table on `/dev/sda`, 200MiB for boot and rest for root partition:

```sh
sudo -s
sfdisk /dev/sda << EOF
label:mbr

start=2048, size=200MiB, type=0x0c, bootable,
type=0x83,
EOF
```

You can change these scripts to satisfy your needs, e.g. add a swap partition.

Formatting the target drive
--------

Assuming you have partitioned the drive using the script above.  
In this case the boot partition is `sda1`, and the root filesystem partition is `sda2`.

These commands will format these two partitons:

```sh
mkfs.vfat -n boot /dev/sda1
mkfs.ext4 -L aosc /dev/sda2
```

Or if you prefer setting up LVM, just create a PV on the large root partition:

```sh
mkfs.vfat -n boot /dev/sda1
pvcreate /dev/sda2
vgcreate aosc /dev/sda2
lvcreate -n root -l 100%FREE aosc
mkfs.ext4 -L aosc /dev/aosc/root
```

Install AOSC OS
--------

First, mount the root filesystem:

```sh
sudo mount /dev/sda2 /mnt
```

Or if you have set up LVM:

```sh
sudo mount /dev/aosc/root /mnt
```

Then grab the latest AOSC OS ARM64 tarball, and then extract it to the root filesystem:

```sh
cd /mnt
tar --numeric-owner -pxvf /path/to/tarball.tar.xz
```

# Post Installation

Chroot into the target OS:

```sh
sudo cp /usr/bin/qemu-aarch64-static /mnt/usr/bin/
sudo arch-chroot /mnt
```

> **Notice:**  
> From now on all commands should be run in chroot environment.
> 
> Remember to remove `/usr/bin/qemu-aarch64-static` from target OS after finishing setup!


Mount the boot partition inside the target OS:

```sh
mkdir /boot/rpi
mount /dev/sda1 /boot/rpi
```

Generate `fstab`:

```sh
genfstab -p -U / | sed -e '/swap/d' -e '/none/d' >> /etc/fstab
```

Then proceed with the [general post installation process][general-postinst] to set up your OS. Do not exit the chroot environment after finishing this process.

BSP Installation
--------

The BSP packages are now present in the main suite, so you don't have to add `bsp-rpi` suite to your `sources.list`. Simply run the following command to install the BSP packages:

```sh
apt update
apt install linux+kernel+rpi64+lts
```

# Plugin and run!

If all above are set, you can exit your chroot environment, unmount them, plug it in to your Pi and boot!

In the chroot, run:

```
umount /boot/rpi
exit
```

Now you are in host OS, run:

```sh
cd /
umount /mnt
sync
```

Then unplug it and plug in your Pi, power it on and here we go
