+++
title = "Installation/AMD64/KVM (简体中文)"
description = "在 KVM 安装 AOSC OS"
date = 2020-08-18T14:42:41.684Z
[taxonomies]
tags = ["sys-installation"]
+++

事实上，在 Qemu/KVM 上安装 AOSC OS 和在一台常规的 AMD64/x86_64 设备上安装 AOSC OS 是差不多的。本文旨在帮助您配置虚拟机，并从虚拟机外部解压 Tarball。

下面部分将覆盖 [常规安装指南](@/system/installation/amd64.zh.md) 的 “准备安装环境”、“准备分区”、“解压 Tarball” 三部分。

# 注意

- 所有以 `# ` 开头的命令都需要你使用 `root` 来运行。

# 准备 VM 硬盘映像

下面我们建立一个 `20GiB` 大小的硬盘映像文件 `aosc.img`。要想正常使用 AOSC OS，文件大小最好在 8G 以上。

```
# qemu-img create -f raw aosc.img 20G
```

为 `aosc.img` 建立分区：

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

打印目前的分区表：

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

创建一个回环设备，例如 /dev/loop0。请注意下面参数中 offset 是 `start * sectorsize`，而 sizelimit 是 `sectors * sectorsize`：

```
# losetup --offset $((2048*512)) --sizelimit $((512*41940992)) --show --find aosc.img /dev/loop0
```

将其格式化：

```
# mkfs.ext4 /dev/loop0
```

挂载你的回环设备，不妨将其挂载到 `/mnt`：

```
# mount /dev/loop0 /mnt
```

# 解压 Tarball

是时候解压你已经下载好的 AOSC OS 系统 Tarball 了！

```
$ cd /mnt
# tar pxvf /path/to/tarball.tar.xz
```

现在你可以卸载你的映像文件了：

```
# umount ${MOUNT}
# losetup -d /dev/loop0
```

# 配置引导器

为了让解压好的系统能被正常引导，你需要对引导器做一些初始化工作和配置工作。

这一步应该会很有趣：你需要有一台可用的虚拟机，因为在你的物理系统下 Chroot 不一定奏效。按照 [常规安装指南](@/system/installation/amd64.md) 中的说明安装 GRUB 之前，请使用在前面准备好的硬盘文件创建一个虚拟机，并使用 LiveCD 引导该虚拟机。

现在，你可以使用 LiveCD 继续在虚拟机中安装 AOSC OS。