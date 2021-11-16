+++
title = "Installation/ARM*/RaspberryPi"
description = "为第三代或更新的树莓派手动安装 AOSC OS"
date = 2021-04-14T04:37:11.499Z
[taxonomies]
tags = ["sys-installation"]

+++

[general-postinst]: /zh/aosc-os/installation/amd64/#yong-hu-zi-ding-yi-she-zhi
[troubleshooting]: /aosc-os/installation/arm-rpi-troubleshooting

AOSC OS 对树莓派的支持由社区进行维护，所以你可以轻松地为树莓派安装 AOSC OS。

在树莓派上启动 Linux 的方法有很多种，比如 UEFI、U-Boot。该教程将使用原生启动方法。

通过跟随本教程，你将在已有的 AOSC OS 环境下为树莓派安装 AOSC OS。自动生成开箱即用镜像的工作正在进行。

如果你有任何问题，请查看[我们的树莓派常见问题页][troubleshooting].

# 支持的硬件

理论上任何装备了支持 ARM64 架构 CPU 的树莓派都可以运行主线版本的 AOSC OS，包括：

- 第四代树莓派系列 (BCM2711)
  - 树莓派 4B（所有版本）
  - 树莓派 400
  - 树莓派计算模块 4
- 第三代树莓派系列 (BCM2837A0/B0)
  - 树莓派 3/3A/3B/3B+
  - 树莓派计算模块 3
- 装备了 BCM2837 的第二代树莓派 (2B 硬件版本 1.2，运行较慢)

# 教程内容

跟随本教程，你将进行如下步骤：

1. 对目标设备分区及格式化
2. 将 AOSC OS 安装到目标设备
3. 安装 AOSC OS 树莓派支持包
4. 基本设置步骤
5. 开跑！

# 安装

安装准备
--------

确保你已经准备好了如下内容：

- 一块可以运行 AOSC OS 的树莓派，最好是树莓派第四代系列，或者更新。
- 用于安装 AOSC OS 的存储设备。可以是 SD 卡，也可以是装在 USB 硬盘盒的 SSD 或 HDD。
  - 如果你使用的是第三代树莓派或更旧的版本，则建议使用 SD 卡，因为它们的 USB 启动支持非常有限。
- 如果你用 SD 卡作为存储设备，确保你的读卡器不会毁坏 SD 卡的数据。
- 一个稳定的因特网连接，用以太网连接。

### 软件依赖

要进行安装，你需要先安装如下软件包：

- `dosfsutils`
- `e2fsprogs`
- `arch-chroot`
- `fdisk`

如果你的机器不是 ARM64 架构的，则需要安装 `binfmt` 支持才能完成安装：

```sh
sudo apt install qemu-user-static
sudo systemctl restart systemd-binfmt.service
```

**然后将设备插入机器，假设该设备路径为 `/dev/sda`。**   
如果不清楚设备路径，运行 `lsblk` 可能会帮到你。

对目标设备分区
--------

对于第四代树莓派，这里将使用 GPT 分区表；対于第三代树莓派，则使用 MBR 分区表。

在目标设备上有两个分区是必需的：

1. 一个 FAT32 的启动分区，至少 200MiB，并且它必须是第一个分区。这个分区是树莓派的启动分区，存放着 GPU 固件、硬件配置文件、Linux 内核和 initrd。
2. 一个根文件系统分区。文件系统可以任意选择，只要 Linux 内核或 initrd 支持即可。在本教程中将使用 `ext4`。
   - 若要使用 LVM，请确保启动分区内有支持的 initrd 镜像。

### 对于第四代或更新的树莓派 (GPT)

以下命令将会在 `/dev/sda` 上建立 GPT 分区表，建立一个 200MiB 大小的启动分区并将剩余空间分配给根文件系统：

```sh
sudo -s
sfdisk /dev/sda << EOF
label:gpt

start=2048, size=200MiB, type=C12A7328-F81F-11D2-BA4B-00A0C93EC93B,
type=0FC63DAF-8483-4772-8E79-3D69D8477DE4,
EOF
```

### 对于第三代或更旧的树莓派 (MBR)

以下命令将会在 `/dev/sda` 上建立 MBR 分区表，建立一个 200MiB 大小的启动分区并将剩余空间分配给根文件系统：

```sh
sudo -s
sfdisk /dev/sda << EOF
label:mbr

start=2048, size=200MiB, type=0x0c, bootable,
type=0x83,
EOF
```

可以根据个人需求更改上面的命令，比如预留一个交换分区。

格式化目标设备
--------

假设你用如上的命令为设备分区，此时启动分区即为 `sda1`，根分区为 `sda2`。

以下这些命令将会格式化这两个分区：

```sh
mkfs.vfat -n boot /dev/sda1
mkfs.ext4 -L aosc /dev/sda2
```

或者如果你要在根分区设置 LVM，运行以下命令建立逻辑卷并格式化：

```sh
mkfs.vfat -n boot /dev/sda1
pvcreate /dev/sda2
vgcreate aosc /dev/sda2
lvcreate -n root -l 100%FREE aosc
mkfs.ext4 -L aosc /dev/aosc/root
```

安装 AOSC OS
--------

首先挂载根分区（启动分区先不挂载）：

```sh
sudo mount /dev/sda2 /mnt
```

或者如果你按照上面的命令设置了 LVM：

```sh
sudo mount /dev/aosc/root /mnt
```

然后解压下载的 AOSC OS 归档：

```sh
cd /mnt
tar --numeric-owner -pxvf /path/to/tarball.tar.xz
```

# 安装后的基本配置

Chroot 到安装的系统：

```sh
sudo arch-chroot /mnt
```

> **注意：**  
> 在此之后的命令都要在 chroot 环境下进行。

在 chroot 中挂载启动分区：

```sh
mkdir /boot/rpi
mount /dev/sda1 /boot/rpi
```

生成 `fstab`（同时去掉多余的内容）:

```sh
genfstab -p -U / | sed -e '/swap/d' >> /etc/fstab
```

然后跟随[通用安装后配置][general-postinst]步骤来设置系统。在此之后请勿退出 chroot 环境！

安装树莓派 BSP（单板支持包）
--------

为了让树莓派运行安装的 OS，要在安装过程中安装一系列单板支持包。

到目前为止，这些包不再需要手动配置，直接安装即可。

首先添加 BSP 源：

```sh
echo "deb https://repo.aosc.io/debs stable bsp-rpi" | tee /etc/apt/sources.list.d/10-bsp-rpi.list
apt update
```

然后安装内核包（该包将所有必需 BSP 作为依赖安装）：

```sh
apt install linux+kernel+rpi64
```

若更倾向使用 LTS 分支的内核：

```
apt install linux+kernel+rpi64+lts
```

不用担心，我们会自动完成所有的工作来让树莓派开箱即用，包括生成 `config.txt`、`cmdline.txt`。

# 开跑！

如果上述工作全都完成，那么你就可以退出 chroot 环境，卸载设备，然后插入你的树莓派开机了！

在 chroot 环境中执行：

```sh
umount /boot/rpi
exit
```

现在会退出到主机：

```sh
cd /
umount /mnt
sync
```

然后拔下设备插入树莓派。现在你就可以打开树莓派的电源了。

# 问题排除

请参见[常见问题以及疑难排除][tbst-zh]来获取有关一些基本问题的排除方法。

