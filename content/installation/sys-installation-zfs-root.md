+++
title = "ZFS Root"
description = "How to install AOSC OS on a ZFS root"
date = 2020-05-04T04:56:24.036Z
+++

Using the DKMS modules, it is possible to install AOSC OS on a ZFS root, if special precautions are taken. This guide will cover how to deploy AOSC OS onto a ZFS root, and workarounds to certain known issues related to ZFS. *WARNING: This guide assumes you know the details about the Linux booting process. DO NOT COPY AND PASTE COMMANDS WITHOUT KNOWING WHAT YOU ARE DOING!*

# Background
Originally designed by Sun Microsystems (now Oracle) for their Solaris operating system, ZFS is a combined logical volume manager and filesystem aimed at high availability and scalability. Once proprietary, ZFS was open-sourced along with OpenSolaris project, and the open-source development continued until Sun was bought by Oracle, who dropped the development of OpenSolaris. However, a community-drive umbrella project, [OpenZFS](http://open-zfs.org/wiki/Main_Page) continued to improve the open-source version of ZFS and helps to unify development efforts independent of Oracle. 

ZFS on Linux is one of the projects under the OpenZFS umbrella, which takes form of reloadable kernel modules. The effort of this project was never merged into mainline Kernel as their license (CDDL) is not compatible with that of the Kernel (GPL), and combining them will lead to [violation of GPL](https://sfconservancy.org/blog/2016/feb/25/zfs-and-linux/). Because of this, while it is possible to load all the required sources into the kernel source tree and compile them into the kernel, distributing the product binary would be illegal. Instead, AOSC decided to follow a route similar to that of Debian and Ubuntu, to maintain the required modules from this project separately, and a user is required to install them separately from our main repository.

# Known Issues
- Issues related to`zfs`
  - `TRIM` is not yet supported by the current release of `zfs`. While there are works in progress, no ETA is provided yet. Thus performance degradation overtime on SSDs will be inevitable.
  - `zfs` does not handle hibernation correctly which will cause the system to hang when resuming from a swap ZFS volume.
- Issues related to `grub`
  - While `grub` does have support for reading ZFS, not all feature flags are supported, therefore if one intends to put `/boot` on a ZFS volume, special precaution is needed when creating the volume, see [this section on ArchWiki](https://wiki.archlinux.org/index.php/ZFS#GRUB-compatible_pool_creation). Note: AOSC ships the release branch of ZFS, so this should not be a problem.
  -  ~~`grub-mkconfig` does not yet properly detect Linux installed on ZFS volumes and generate boot parameters, therefore manual configuration (and update, after a kernel upgrade) of boot loader is required, see [this example on ArchWiki](https://wiki.archlinux.org/index.php/Installing_Arch_Linux_on_ZFS#For_BIOS_motherboards)~~ While generating `grub.cfg` using `grub-mkconfig`, you have to add `ZPOOL_VDEV_NAME_PATH=1` to the beginning, [or GRUB will throw an error: `/usr/sbin/grub-probe: error: failed to get canonical path of /dev/<DISK_NAME>`](https://askubuntu.com/questions/827126/zfs-grub-probe-error-failed-to-get-canonical-path-of-dev-disk-name/943425#943425). In this guide, [rEFInd](http://www.rodsbooks.com/refind/) with `EFISTUB` will be used to boot the system.
  - `grub-install` may fail due to being unable to detect disks, [a workaround](https://wiki.archlinux.org/index.php/Installing_Arch_Linux_on_ZFS#For_BIOS_motherboards) is documented.
- `dracut` does not properly detect Linux installed on ZFS volume and one needs to manually tell it to include the required modules in the initramfs generated. This can be done either by extra command-line arguments passed to `dracut` or by a one-line file in `/etc/dracut.conf.d/` containing `add_dracutmodules+="zfs"`.

# Preparation

Before starting, one needs an archive of a AOSC OS system, one of these archives could be obtained either by downloading from the official AOSC website, or by tarballing an existing installation. This guide used the latter, but the steps for configuring the system for ZFS are the same.

One also needs a bootable Linux media that supports ZFS. Many options exist, but the simplest route is to grab a live image of any Ubuntu-family distributions based on 16.04 (Xenial Xerus) or above. This guide uses Lubuntu 16.04.2 live image.

# Partitioning and Deploying

This installation guide is adapted from [this ArchWiki article](https://wiki.archlinux.org/index.php/Installing_Arch_Linux_on_ZFS).

While the images of Ubuntu-family distributions do contain the required kernel modules, the userspace utilities are not always included. Thus these utilities need to be installed first. Open a terminal, and execute these commands:

```
sudo -i
apt update
apt install zfsutils-linux
```

After successfully installing the required utilities, one needs to partition the disk correctly in order for ZFS to work. ZFS requires partitions to have the "Solaris Root" type, and this can be done by a variety of tools. I already have an empty partition, `/dev/sda4`, reserved for the ZFS root, and these commands did the trick of changing partition type:

```
fdisk /dev/sda
Command (m for help): t
Partition number (1-5): 4
Hex code (type L to list codes): 46
Command (m for help): w
```

Then you need to create a ZFS storage pool, and in order for ZFS to work, one must use the disk ID, which takes form similar to `ata-Samsung_SSD_850_EVO_mSATA_500GB_*************-part?`. 

First verify your partition's disk ID by watching the output of this:

```
ls -l /dev/disk/by-id/
```

Remember the disk ID as you will need to substitute them in the commands provided.

Then create a storage pool:

```
modprobe zfs
zpool create -f <yourpoolname> /dev/disk/by-id/<yourdiskid>
```

Then create volumes (or datasets) within the volume. I have chosen one volume for my root, and one for my home. There is also a "default" subvolume within the volume for my root, and a subvolume for my user within the home volume.

```
zfs create -o mountpoint=none <yourpoolname>/root
zfs create -o mountpoint=none <yourpoolname>/root/default
zfs create -o mountpoint=none <yourpoolname>/home
zfs create -o mountpoint=legacy <yourpoolname>/home/<username>
zfs umount -a
zfs set mountpoint=none <yourpoolname>
zpool set bootfs=<yourpoolname>/root/default <yourpoolname>
zpool export <yourpoolname>
```

Now get ready to deploy AOSC OS on your shiny ZFS pool:

```
mkdir /tmp/aosc
zpool import -d /dev/disk/by-id -R /tmp/aosc <yourpoolname>
cd /tmp/aosc
```

While many of the information in the [official installation instructions](https://github.com/AOSC-Dev/aosc-os/wiki/x86_64_Installation#preparing-an-installation-environment) are still valid, and you should follow those, there are several things to take care of. Personally I have chosen to mount my EFI system partition to `/boot`, which requires extra caution, and because how ZFS works, I have chosen to manually write my `/etc/fstab`.

Here is what the `/etc/fstab` should look like if you have decided to use my partition scheme:

```
<yourpoolname>/root/default       /               zfs             noatime         0       0 # noatime is to decrease writes to SSDs
<yourpoolname>/home/<username>           /home/<username>       zfs             noatime         0       0
/dev/sda1       /boot           vfat            noexec          0       0
```

Also, before chrooting, you would also want to copy the pool cache file to the newly installed AOSC OS. This is done by:

```
cp -L /etc/zfs/zpool.cache /tmp/aosc/etc/zfs/zpool.cache
```

AOSC OS tarballs come with a default user `aosc`, which can be used to help with setup. Doing these in the user setup stage (assuming you have mounted your zfs volumes before untaring and chrooting as the guide suggested) will make sure your home subvolume has the correct UNIX permissions:

```
cd /home/<username>
usermod -g <username> -d /home/<username> -l <username> aosc
chown <username>.<username> .
cp -a /home/aosc/{*,.*} .
chown -R <username>.<username> {*,.*}

```

Installing `linux+kernel+lts` is optional but recommended as LTS kernels will have longer support cycles, and upgrades less often, which are crucial when using a filesystem module which is not in the kernel source tree:

```
apt install linux+kernel+lts
apt purge linux+kernel # The two lines remove the mainline kernel
apt-get --purge autoremove
```

Before the step of regenerating the initramfs, make sure you have the ZFS packages installed, and have told `dracut` to include the `zfs` module, as described in the "Known Issues" section:

```
apt install spl zfs
```

This will invoke DKMS to build the kernel modules. These operations can take quite some time, so be patient.

The rEFInd homepage has a variety of resources and the configuration file of rEFInd is mostly self-explanatory. Just make sure that your `EFISTUB` entries look similar to this:

```
menuentry AOSC {
    icon \EFI\Boot\icons\os_linux.png
    loader \vmlinuz-aosc-lts-4.9.22
    initrd \initramfs-4.9.22-aosc-lts.img
    options "zfs=<yourpoolname>"
}
```

Now exit the chroot environment, and clean it up before rebooting:

```
umount -lf /tmp/aosc/proc
umount -lf /tmp/aosc/sys
umount -lf /tmp/aosc/dev
umount -lf /tmp/aosc/home/<username>
umount -lf /tmp/aosc/boot
zfs umount -a
zpool export <yourpoolname>
```

The above steps are crucial, and failing to do these could result in the system refusing to mount your ZFS volumes.

# Post-installation Steps
If everything went correctly, you should be able to boot up AOSC for one time. In order for the system to be bootable, some further configurations are needed.

First, get your Solaris Host ID (needed for `spl` and `zfs`):

```
sudo hostid
```

Your Host ID will be in the form of a hex string, write it down, and modify your boot loader configuration to something like this:

```
menuentry AOSC {
    icon \EFI\Boot\icons\os_linux.png
    loader \vmlinuz-aosc-lts-4.9.22
    initrd \initramfs-4.9.22-aosc-lts.img
    options "zfs=<yourpoolname> spl.spl_hostid=0x<yourhostidinhex>"
}
```

You will also need to activate the systemd target for ZFS, which can be done by:

```
sudo systemctl enable zfs.target
```

And now, enjoy.