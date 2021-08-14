+++
title = "Installation/ARM*/RaspberryPi"
description = "Installing AOSC OS on Raspberry Pi with ARM64 support"
date = 2020-11-14T12:37:11.499Z
[taxonomies]
tags = ["sys-installation"]

+++

With platform support you can easily enjoy your full-featured AOSC OS in your Raspberry Pi.

This tutorial is designed for running under Linux environment. More specifically, AOSC OS.

This tutorial will help you go through the installation process for the Raspberry Pi. We just use plain boot method here, U-Boot and UEFI method are out of scope.

# Supported Hardware

Currently all models armed with chip supports ARM64 may be able to run AOSC OS, including:

- Raspberry Pi 4 series (BCM2711)
  - Raspberry Pi 4B
  - Compute Module 4
  - Raspberry Pi 400

- Raspberry Pi 3 (BCM2837/B0)
  - Raspberry Pi 3/3B/3B+
  - Compute Module 3

- Raspberry Pi 2 (Partial, BCM2837 model)

> Currently only Raspberry Pi 4B is tested, and it works very well.
>

# Working parts

Almost everything is working. Except:

- Hardware accelerated video decoding [is not supported under 64-bit OSes yet](https://github.com/raspberrypi/userland/blob/9f3f9054a692e53b60fca54221a402414e030335/CMakeLists.txt#L11) - [See also](https://www.raspberrypi.org/forums/viewtopic.php?t=232684&start=25).

- You may need to upgrade the EEPROM if you have a Raspberry Pi 4. The latest EEPROM addresses some issues, reduces power consumption.

- If you run a mainline kernel, VideoCore GPU communication interface will not work because its driver is not upstreamed, along with some other parts.

  Display is not working too, after the rainbow screen, the screen will go completely dark, but system runs.

> For best stability you can run a Raspberry Pi distributed kernel, which will be downloaded in this tutorial, or a self-compiled kernel against the [raspberrypi/linux](https://github.com/raspberrypi/linux) tree, or install our distributed kernel.


# For advanced users

The difference between normal setup and RPi is, it needs a FAT partition to store the VC GPU firmware which is necessary to boot, along with basic configuration, kernel and command line options. No bootloader is needed, but U-Boot and TianoCore are available. Kernel should be uncompressed (`vmlinux`), and initramfs is supported.

Raspberry Pi 4 supports USB boot and network boot out of box, this means you can install an OS into hard drive or SSD directly, just after upgrading your EEPROM. Also, you can use a GPT partition table in your media. This greatly reduces some limitation related to boot and partitioning.

# Installation

## Overall process

1. Upgrade EEPROM firmware (Only for Raspberry Pi 4 series)
2. Partitioning and formatting
4. Install AOSC OS
5. chroot and post installation steps

### Preparation

Check if you have everything listed here:

- A Raspberry Pi 2/3/4
- Installation media (SD card or USB drive)
- Network connectivity via Ethernet cable (for your Pi)
- A good enough SD Card reader which does not corrupt your SD card
- HDMI/MiniHDMI cable for attaching your Pi to a monitor
  - Or a serial console connection. See [Raspberry Pi GPIO](https://www.raspberrypi.org/documentation/usage/gpio/) for pinouts.
  - Or you can ignore this if you want it to run completely headless.

You need to download a few files:

- [Latest Raspberry EEPROM firmware](https://github.com/raspberrypi/rpi-eeprom/releases) (if you have a Pi4)
- [Latest AOSC OS ARM64 tarball](https://releases.aosc.io/os-arm64/)

We provide precompiled kernel and necessary firmware, you can simply install them after installing AOSC OS tarball.

## Upgrade EEPROM (For Raspberry Pi 4 series)

> If you don't have a Raspberry Pi 4, please skip this process, as older models don't have onboard EEPROM.

1.1 Obtain a copy of [latest Raspberry EEPROM firmware](https://github.com/raspberrypi/rpi-eeprom/releases).

1.2 Format a SD card as FAT32 filesystem.

1.3 Extract its contents to the root of SD card.

1.4 Make sure all files exists in the filesystem root, then plug it into your Pi and turn it on.

- You may see the upgrade process if you attach a display.
- Wait it for restarting, if you see a completely green screen then your upgrade is successful.
- If no screen is attached, after a successful upgrade the green Activity LED will flash rapidly.


## Partitioning the media

Now you can prepare your SD card for installation.

### Tips

- For Raspberry Pi 4:
  - GPT partition table, Network Boot and USB Boot are supported out of box after upgrading your EEPROM.
  - Despite GPT is supported, the onboard EEPROM is not UEFI compatible.
  - You can see Pi's booting diagnostic screen (and its attempt to boot infinitely) if there's no media plugged in.
- For Raspberry Pi 3:
  - You can program a permanent bit in your SOC to gain USB and network boot support, but the support is very limited and it does not support GPT partition table.

### Partitioning

Plug your installation media into your PC and begin your installation. You need at least two partitions in your media:

- **The first is a FAT32 partition, at least 100 MB.** This partition will store RPi's pre-boot configuration (`config.txt`), kernel command line (`cmdline.txt`), its kernel (`kernel8.img` for arm64), device tree files and overlays), and optionally the initial ramdisk (yes, it does support initramfs).

- **The second is root filesystem.** You can format it as whatever you like, e.g. `LVM`, `btrfs`, just if your kernel or initramfs supports it. For this tutorial we choose `ext4`.

  > initramfs is required if you install your OS in a Logical Volume or an encrypted filesystem, and it must be copied to the boot partition.

- Optionally you can create a swap partition. The size is uncertain as suspend is not supported under plain Raspberry Pi firmware.

Assuming your media presents as `/dev/sda`, we use `fdisk` to partition your media.

THIS WILL OVERWRITE YOUR DISK PARTITION TABLE. If you are uncertain about which device is, execute `lsblk` may help you identify your media.

### For Raspberry Pi 4 and up

We just use GPT partition table for your fresh new Raspberry Pi 4. Here we will set two partitions, `boot`, `root`. For swap, you can optionally create a dedicate swap partition or use a swap file in your root filesystem.

1. Run `fdisk` with root user:
    ```
    # fdisk /dev/sda
    ```

2. `fdisk` will present you a prompt:

    ```
    Command (m for help):
    ```

3. Execute command `g` to create an empty GPT partition table:

    ```
    Command (m for help): g
    Created a new GPT disklabel (GUID: 94AA845B-C24E-2A47-9B5A-22E52786B13E).
    ```

4. Execute `n` command to create the first partition:

    It will ask you for start sector, leave it default by hitting Enter as we does not need free space before the first partition.

    You can use `+<size><K,M,G,T,P>` to specify a partition size at ease, e.g. `+500M` to create a 500MB (500,000 KiB) partition, `+500MiB` for 500MiB , `+5G` for 5GiB.

    ```
    Command (m for help): n
    Partition number (1-128, default 1):
    First sector (2048-4194270, default 2048):
    Last sector, +/-sectors or +/-size{K,M,G,T,P} (2048-4194270, default 4194270): +200MiB

    Created a new partition 1 of type 'Linux filesystem' and of size 200 MiB.
    ```

5. Create the second partition:

    You can press Enter all along as this is the last partition will be created.

    ```
    Command (m for help): n
    Partition number (2-128, default 2):
    First sector (1026048-4194270, default 1026048):
    Last sector, +/-sectors or +/-size{K,M,G,T,P} (1026048-4194270, default 4194270):

    Created a new partition 2 of type 'Linux filesystem' and of size 1.5 GiB.
    ```

6. Change partition type:

    For the boot partition, the partition type can be `EFI System`, GUID `C12A7328-F81F-11D2-BA4B-00A0C93EC93B`.

    ```
    Command (m for help): t
    Partition number (1,2, default 2): 1
    Partition type or alias (type L to list all): 1

    Changed type of partition 'Linux filesystem' to 'EFI System'.
    ```

    For the rootfs partition the type can be vary, `Linux filesystem`, `LVM` and so on. Type L in the `Partition Type` prompt will list all available types.

7. Preview the current partition table:
    Execute `p` command to display partition table.

    ```
    Disk /dev/sda: 238.5 GiB, 256060514304 bytes, 500118192 sectors
    Disk model: M.2 NVME
    Units: sectors of 1 * 512 = 512 bytes
    Sector size (logical/physical): 512 bytes / 512 bytes
    I/O size (minimum/optimal): 512 bytes / 33553920 bytes
    Disklabel type: gpt
    Disk identifier: E34C4CAA-F707-C348-A879-6E3FB8737179

    Device         Start       End   Sectors  Size Type
    /dev/sda1      65535    458744    393210  192M EFI System
    /dev/sda2     458745 491184824 490726080  234G Linux filesystem
    ```

8. Commit changes:

    Execute `wq` will WRITE ALL CHANGES to your media and exit.

    ```
    Command (m for help): wq
    The partition table has been altered.
    Syncing disks.
    ```

9. Format partitions:

    Create a `vfat` filesystem using `mkfs.vfat` for boot partition:

    ```
    # mkfs.vfat -n "BOOT" /dev/sda1
    ```

    Create a `ext4` filesystem using `mkfs.ext4`for root filesystem:

    ```
    # mkfs.ext4 -L "aosc" /dev/sda2
    ```

    If you have swap partition created, use `mkswap` to create a swap partiton:

    ```
    # mkswap /dev/sdaX
    ```

### For Raspberry Pi 3 and older models

Raspberry Pi 3 does not support GPT out of box, so we need a MBR partition table for it.

1. Run `fdisk` with root user:
    ```
    # fdisk /dev/sda
    ```

2. `fdisk` will present you a prompt:

   ```
   Command (m for help):
   ```

3. Execute command `o` to create an empty MBR partition table:

    ```
    Command (m for help): o
    Created a new DOS disklabel with disk identifier 0xcf4a1231.
    ```

4. Create the boot partition:

    The boot partition must be a primary partition, with the type of `0x0c`(Win95 FAT32 LBA).

    It will ask you for start sector, leave it default by hitting Enter as we does not need free space before the first partition.

    You can use `+<size><K,M,G,T,P>` to specify a partition size at ease, e.g. `+500M` to create a 500MB (5,000,000 KiB) partition, `+500MiB` for 500MiB , `+5G` for 5GiB.

    ```
    Command (m for help): n
    Partition type
       p   primary (0 primary, 0 extended, 4 free)
       e   extended (container for logical partitions)
    Select (default p): p
    Partition number (1-4, default 1): 1
    First sector (2048-4194303, default 2048):
    Last sector, +/-sectors or +/-size{K,M,G,T,P} (2048-4194303, default 4194303): +200MiB

    Created a new partition 1 of type 'Linux' and of size 200 MiB.
    ```

5. Create an extended partition to workaround 4 partition limit in MBR:

    This extended partition will take up the whole rest space.

    Or, if you don't need more than 4 partitions or just don't want to create an extended partition, you can ignore this step.

    ```
    Command (m for help): n
    Partition type
       p   primary (1 primary, 0 extended, 3 free)
       e   extended (container for logical partitions)
    Select (default p): e
    Partition number (2-4, default 2):
    First sector (411648-4194303, default 411648):
    Last sector, +/-sectors or +/-size{K,M,G,T,P} (411648-4194303, default 4194303):

    Created a new partition 2 of type 'Extended' and of size 1.8 GiB.
    ```

6. Then create a partition for root filesystem:

    At this stage fdisk will tell you the logical partition is taken up the whole disk size (if you have created one).

    ```
    Command (m for help): n
    All space for primary partitions is in use.
    Adding logical partition 5
    First sector (413696-4194303, default 413696):
    Last sector, +/-sectors or +/-size{K,M,G,T,P} (413696-4194303, default 4194303): +1G

    Created a new partition 5 of type 'Linux' and of size 1 GiB.
    ```

7. Change partition type (ESSENTIAL):

    Execute `t` command to change the partition type. We just need to modify the first partition.

    The type of boot partition should be `0x0c`. Type `c` is enough.

    ```
    Command (m for help): t
    Partition number (1,2,5, default 5): 1
    Hex code or alias (type L to list all): c

    Changed type of partition 'Linux' to 'W95 FAT32 (LBA)'.
    ```

8. Press `p` to preview current partition table:

    ```
    Command (m for help): p
    Disk /dev/sda: 2 GiB, 2147483648 bytes, 4194304 sectors
    Units: sectors of 1 * 512 = 512 bytes
    Sector size (logical/physical): 512 bytes / 512 bytes
    I/O size (minimum/optimal): 512 bytes / 512 bytes
    Disklabel type: dos
    Disk identifier: 0xcf4a1231

    Device    Boot  Start     End Sectors  Size Id Type
    /dev/sda1        2048  411647  409600  200M  c W95 FAT32 (LBA)
    /dev/sda2      411648 4194303 3782656  1.8G  5 Extended
    /dev/sda5      413696 2510847 2097152    1G 83 Linux
    ```

9. Execute `wq` to write the partition table to your media and exit `fdisk`.

10. Format partitions:

    Create a `vfat` filesystem using `mkfs.vfat` for boot partition:

    ```
    # mkfs.vfat -n "BOOT" /dev/sda1
    ```

    Create a `ext4` filesystem using `mkfs.ext4`for root filesystem:

    ```
    # mkfs.ext4 -L "aosc" /dev/sda5
    ```

    If you have swap partition created, use `mkswap` to create a swap partiton:

    ```
    # mkswap /dev/sdaX
    ```

### Mounting

After formatting, you can now mount partitions to your system.

Create mount points under `/mnt`:

```shell
mkdir /mnt/{sd-boot,sd-aosc}
```

Mount the partitions:

```shell
mount /dev/sda1 /mnt/sd-boot
mount /dev/sda2 /mnt/sd-aosc
```



## Install!

Assuming your boot partition is mounted at `/mnt/sd-boot`, root filesystem is mount at `/mnt/sd-aosc` in this section.

This process is simple. `cd` to your root filesystem mount point and untar the AOSC OS tarball you downloaded:

```sh
cd /mnt/sd-aosc
tar --numeric-owner -pxvf /path/to/tarball/tarball.tar.xz
```

Blah! Installation is done! But we should do some post-installation configuration before we can plug it in to your Pi. Keep your media mounted, and there we go.



## Post installation process

The OS is installed, but we need to do some configuration before we can actually boot it up, for example, setting language, adding user, installing additional packages, etc.

However, this is not just like `chroot`ing to your media:



### Chrooting from different architecture

You may not able to chroot directly if your host architecture is different from Raspberry Pi's ARM64 architecture. If you do so, it will crash and throw a `binary format error` message.

To chroot to an environment which differs from your host architecture, first please make sure that `qemu-user-static` is installed.

> QEMU will act as an "interpreter" thing, "translates" the instructions between two architectures.

```sh
sudo apt install qemu-user-static
```

Then, restart the `systemd-binfmt.service` to configure the `binfmt` configuration:

```sh
sudo systemctl restart systemd-binfmt.service
```

Once done so, you can check the kernel's `binfmt` status by `ls`ing a directory:

```sh
ls /proc/sys/fs/binfmt_misc/
```

You can see a lot of binary formats listed here. View the `qemu-aarch64` file by `cat`ing it to see the configuration:

```sh
cat /proc/sys/fs/binfmt_misc/qemu-aarch64
```

If it returns like this:

```
enabled
interpreter /usr/bin/qemu-aarch64-static
flags:
offset 0
magic 7f454c460201010000000000000000000200b7
mask ffffffffffffff00fffffffffffffffffeffff
```

Then you are ready to chroot into your media! Assuming your media's root partition is mounted as `/mnt/sd-aosc`.

We need to copy host's `qemu-aarch64-static` to chroot environment first:

```sh
cd /mnt/sd-aosc
# Backup the file first
mv ./usr/bin/qemu-aarch64-static ./
# Copy host's qemu to chroot environment
cp /usr/bin/qemu-aarch64-static ./usr/bin/

# Then, chroot to your installation using arch-chroot
arch-chroot /mnt/sd-aosc
```

And here we comes!



### Mount partitions

Now you are in your chroot environment. The first thing is to generate the `fstab` file, before doing this you must make sure all necessary partition are mounted.

For Raspberry Pi's boot partition, we choose a subdirectory under `/boot` , not `/boot` itself. e.g. `/boot/rpi`

> If the `/boot` is a `vfat` filesystem, things will break as `dpkg` is unable to process the update in such filesystem.
>
> We strongly recommend you to mount your boot partition to `/boot/rpi` . This will be a de facto standard in future when we release images for Raspberry Pi.

```sh
mkdir /boot/rpi
```

Then mount necessary partitions:

```sh
mount -o remount,rw /dev/sda2 /
mount /dev/sda1 /boot/rpi
```



### Generate fstab file

All necessary partition is mounted. Invoke the script to generate it:

```sh
genfstab -U / > /etc/fstab
```

Before we proceed we need to remove the swap partition entry as it do not exist in your media (even if it exists its UUID is different from the one in `fstab` file):

> To obtain UUID information of one partition, one can use `lsblk -f` to locate that partition and then invoke `blkid` to get UUIDs.

```shell
sed -i '/swap/d' /etc/fstab
```



### Adding `bsp-rpi` repository

We have a repository specially designed for Raspberry Pi. You can add an entry to your `apt` sources list by executing:

```sh
echo "deb https://repo.aosc.io/debs stable bsp-rpi" > /etc/apt/sources.list.d/10-bsp-rpi.conf
```

Then run `apt-update`.

> This repository contains Raspberry Pi kernel, firmware and precompiled userland libraries.



### Miscellaneous post installation process

Please refer to [Installation/AMD64](/aosc-os/installation/amd64/#user-and-post-installation-configuration) for detailed steps. This process is identical to normal installation.



### Upgrade your system

Let's upgrade your system now. Before anything going on, you should do this first.

```
apt update
apt full-upgrade
```




### Kernel and firmware

Thanks to our contributors, we are now providing kernel and firmware package, users can simply installing them without manual configuration.

#### Installing kernel

Make sure you have `bsp-rpi` added to your sources list, then you can simply install the `linux-kernel-rpi64` package. This kernel is compiled from [raspberrypi/linux](https://github.com/raspberrypi/linux) tree, so it is fully functional.

```
apt update
apt install linux-kernel-rpi64
```



#### Installing firmware

You need to install the Raspberry Pi boot firmware in order to make your Pi working. The `rpi-firmware-boot` package provides a `config.txt` file, and other firmware necessary to boot (`bootcode.bin`, `start.elf` etc).

```
apt install rpi-firmware-boot
```

> It provides a default configuration file (`config.txt`). It will not overwrite existing `config.txt` file.

For WiFi or other parts, you need to install `firmware-nonfree` package in order to make your hardware working. In your chroot environment:

```
apt install firmware-nonfree
```

If you want to enable onboard Bluetooth, you need to install `rpi-firmware-bluez` first:

```
apt install rpi-firmware-bluez 
```

And uncomment `dtparam=krnbt=on` in `config.txt` .

### Configuring Pi

`config.txt` stores hardware configuration,  this file is read before the kernel load. Some parameters can change the behavior of your Pi. This file should be present in the root directory of your Pi.

> This file is already installed if you have the package `rpi-firmware-boot` installed. You can ignore this step if you want to use the default configuration. But you still need to create a `cmdline.txt` manually (see following instructions).

One line per parameter, using sharp symbol to comment on the file.

For all Pis, `arm_64bit=1` should be set in order to load 64bit kernel.

For all configuration parameters, please refer to [Raspberry Pi Documentation](https://www.raspberrypi.org/documentation/configuration/config-txt/README.md).

##### Device Tree related

- `dtparam=sound=on` enables sound (loads `snd_bcm2835` kernel module).
- `dtparam=krnbt=on` enables Bluetooth (You need `firmware-nonfree` installed first).
  - If this option is not enabled, you may need to manually attach the UART Bluetooth.
- `dtoverlay=vc4-fkms-v3d` enables the 3D acceleration support.
- For other parameters, head to [dtoverlays README](https://github.com/raspberrypi/firmware/blob/master/boot/overlays/README) for more information.

##### Hardware related

- `gpu_mem=X` sets the reserved GPU memory. The unit is MiB, default is 64.
- `enable_uart=1` enables the onboard serial UART. The UART in Linux is under `/dev/ttyS0`. For Pin header, Pin 8 (GPIO14) for TX, Pin 10 (GPIO15) for RX. 
- `disable_overscan=1` set this if you encounter a black border around the screen. This disables overscan, which is used to address an issue that image goes out of screen.

##### Booting related

- `kernel=file` specifies the kernel file to execute. You can simply ignore this option, if `arm_64bit=1` is set then the bootloader loads `kernel8.img` automatically.

  > If you specify a kernel to boot, please make sure `arm_64bit=1` is set.

- `initramfs` specifies the initramfs file. The format is:

  ```
  initramfs filename address|followkernel
  ```

  > You should NOT use the equal sign `=` here, e.g. `initramfs initrd.gz 0x00800000`, `initramfs initrd.gz followkernel`. This syntax is different from others.

- `arm_64bit=1` enables 64bit support. This should be enabled.

> We recommend you use a separate file to store boot related settings, then use `include` in the main `config.txt` to merge the configurations. e.g:

`config.txt`:

```
# other configurations...

include distcfg.txt
```

`distcfg.txt`:

```
arm_64bit=1
kernel=vmlinux
initramfs initrd followkernel
```



##### Kernel parameters

Kernel command line should be stored in `cmdline.txt` , presents in the root directory of your boot partition, and should only contain one single line. Contents of the file is kernel parameters, which will be passed to kernel during boot. Parameters should divided by space.

 For a normal Pi installation, these options should present no matter how you install or boot your Pi:

- `rootwait` : Wait for root filesystem showing up. The kernel can't find the root filesystem just after boot. SD/USB devices won't work before such controller is showed up.

- `fsck.repair=yes` : Always check for root filesystem. You have to enable this if you do not use a initramfs.

- `root=/dev/blkdev` : Specify the root partition. For SD Card installation, `blkdev` is normally started with `mmcblk0` (e.g. `/dev/mmcblk0p2` for this tutorial). For USB installation, it is normally started with `sda` (e.g. `/dev/sda2` for this tutorial).

  > `UUID=` / `PARTUUID=` is unavailable if you don't use a initramfs.

Optionally, you should set a serial console on `/dev/ttyS0`, e.g. `console=ttyS0,115200` . This helps you monitoring or debugging the boot process, and provide a easy way to fix up the problem without mounting them to your PC.

A least complete `cmdline.txt` should contain these options above, for example:

```
console=ttyS0,115200 root=/dev/sda2 rootfstype=ext4 rw fsck.repair=yes rootwait
```

-----

If all above are set, you can exit your chroot environment, unmount them, plug it in to your Pi and boot!

```
umount /boot/rpi
exit
umount /mnt/sd-{boot,aosc}
sync
```



# Additional notes

## Kernel

We are now providing a distribution kernel for Raspberry Pi (ARM64), and it is downstreamed. Some important parts are not upstreamed to mainline kernel, e.g. VideoCore GPU interface. So display will not work under mainline kernel.

> If you want to use the Raspberry Pi distributed kernel, the configured default CPU governor is `powersave`. You have been warned.

If you run a mainline kernel, you can't run `raspi-config` because VC interface does not work, and so do other tools, e.g. `raspi-config`.

You can build your own kernel against [raspberrypi/linux](https://github.com/raspberrypi/linux) tree. 

## Raspberry Pi Userland programs

We have a prebuilt package for userland libraries. If you are required to run `vcgencmd` or something (`rpi-update` and `raspi-config` requires this), then you need to install this package first.

```
apt install rpi-userland
```

> Make sure you are running a downstreamed kernel e.g. the kernel from Raspberry Pi and our `linux-kernel-rpi64`.

## 3D Acceleration

With the help of Mesa you can get OpenGL working on your Pi.

```
sudo apt install mesa
sudo usermod -aG render <user>
```

Reboot and run `glxinfo` , you can clearly see the V3D driver is enabled.

## Hardware accelerated video decoding

MMAL is not supported under 64-bit OS yet. So you will not get a accelerated video decoding under AOSC OS.


# Troubleshooting

If you encounter a problem, here are some possible causes and workarounds/solutions:

## Booting

### No output at all

For Pi 4 and up:

- Remove everything except HDMI cable and power cable.
- Power it on, if you can see the [Boot Diagnostics Screen](https://www.raspberrypi.org/documentation/hardware/raspberrypi/boot_diagnostics.md) and its attempt to boot infinitely, then your boot partition may have been corrupted.
- If you can't see anything, please make sure your HDMI cable is plugged into HDMI0 port, the one next to USB-C port.
- If you still can't see anything, then you need to [reflash your EEPROM](https://www.raspberrypi.org/documentation/hardware/raspberrypi/booteeprom.md).

For all models, the status of the Green Activity LED is an indication to the problem.

If Activity LED does not flash at all:

- It means no boot code is being executed.

  Make sure your media is plugged in, your partition scheme is correct, and the necessary codes presents in your boot partition. And there's a chance that your card has been corrupted.

If it flashes with a specific pattern:

- Your SD Card is working correctly, but Pi can't find some files necessary to boot.

  Check whether `start.elf`,`fixup.dat` and other files are present in the ROOT of boot partition and not corrupted.

If above attempt still can not fix the problem, make sure you have a good power supply.


### Stuck at rainbow screen

The rainbow screen is a good sign because your Pi does read your media, and `start.elf` is being executed.

How long this rainbow screen lasts depends on your kernel size and the reading speed of your media. Normally this should just last about a few seconds.

If it stuck, then your Pi can't boot the kernel, or the kernel file is not found.

Check your boot partition to see if `kernel8.img` does exist and looks good. If you have custom kernel defined in `config.txt`, make sure it is in the root of boot partition, and double check the filename.

> If it is a Pi 4, make sure your HDMI cable is plugged into HDMI0 port, the one next to the USB-C port. This is because the second display is only activated after a successful boot.
>
> So there's a case that your kernel panicked during boot, but the second display is completely frozen so you can't see the panic output.


### Only four Raspberry Pi logos showed at the top-left corner

This means your kernel is being executed. It's a good sign because your Pi is booting into Linux.

> If `quiet` option is present, you should remove it because kernel output is useful to debug booting process.

If it stuck, watch the screen carefully before you proceed.

**With a blinking cursor**

It means your kernel is booting, maybe a slow media makes it hard to boot. Wait a few minutes it should bring you to a successful boot.

If it still stuck at this stage, it means your kernel is waiting for such root partition showing up. Check your `cmdline.txt` ,  make sure your `root=` parameter is correct and try again.

**With a frozen cursor**

If the cursor is not blinking, then it means your kernel is panicked and you have `quiet` option enabled in your `cmdline.txt`. Remove `quiet` option to see how it panicked.


### Kernel panic

The reason why it panics are vary, but mostly we can figure it out by checking the console output.

When a kernel panics, the cause of the panic is printed out to the default console. If a screen is attached, then the panic information is on your screen, otherwise you have to attach a Serial console to your Pi, reboot to reproduce the problem.

Panic messages are started with `kernel panic: not syncing` . Take a close look at this line, and find a match in follows.

- `VFS: Unable to mount root fs on unknown-block(0,0)`

  It seems that kernel can't find a root filesystem to boot.

  **Check `root=` parameter in `cmdline.txt`**

  If you installed AOSC OS in a SD card, the root filesystem path is like `/dev/mmcblk0pX` where X is a partition number. e.g. for this setup, it's `/dev/mmcblk0p2`.

  Or if you installed AOSC OS in an USB drive, no matter what it is, the root filesystem path should be like `/dev/sdaX`.

  > `UUID=` / `PARTUUID=` option are unavailable if you don't use an initramfs.

  **Check if `rootwait` option exists in `cmdline.txt`**

  Kernel can't find the root filesystem in USB/SD drives until such hardware begins to work. Add `rootwait` option will let kernel to wait until such drive comes up.

- `Attempted to kill init!`

  Your `init` program died during boot. Reinstall the OS may fix the problem.

  Try mounting your media in your PC - if it fails, then your filesystem is corrupted.
  
  > Also check your `config.txt` and make sure it loads the correct 64-bit kernel. This means you should enable `arm_64bit=1` option and make sure it is uncommented,.


## Running

### Poor performance / Low Frequency

If you are using the kernel obtained from Raspberry Pi's firmware repository, then you need to set CPU governor.

> The default CPU governor configured in the kernel is `powersave`,  but other governors are available.

To set a CPU governor, run:

```
sudo cpupower frequency-set -g <governor>
```

The `ondemand` and `conservative` is good enough for ARM processors. Or you can use `performance` if you have a good cooling system.

### Long boot time due to network delay

If your Pi boots fast but you should wait a few minutes to bring up the network, try to disable `NetworkManager-wait-online.service` and `systemd-networkd-wait-online.service` .

```
sudo systemctl disable NetworkManager-wait-online.service
sudo systemctl disable systemd-networkd-wait-online.service
```

If you use Ethernet only, you can disable WiFi by `rfkill` as this would reduce the boot time:

```
sudo rfkill block wifi
```


# See also

- [Raspberry Pi Documentation](https://www.raspberrypi.org/documentation/)
- [Raspberry Pi GitHub](https://github.com/raspberrypi/)
- [eLinux.org Raspberry Pi documentation](https://elinux.org/RPi_Hub)
- [LibreELEC Source](https://github.com/LibreELEC/LibreELEC.tv)
- [Arch Linux ARM Wiki](https://archlinuxarm.org/wiki/Raspberry_Pi)
