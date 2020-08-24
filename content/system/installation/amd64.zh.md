+++
title = "Installation/AMD64 (简体中文)"
description = "在 AMD64/x86_64 设备安装 AOSC OS"
date = 2020-05-04T04:24:52.709Z
[taxonomies]
tags = ["sys-installation"]
+++

本针对于 x86_64 架构或系统的安装指南可以应用于大部分通用环境。但针对部分特殊平台，这里有一些附加提示：

- [针对 KVM 的额外说明](@/system/installation/amd64-notes-kvm.md)
- [针对 Bay Trail/Cherry Trail 的额外说明](@/system/installation/amd64-notes-trails.md)
- [针对 software RAID 的额外说明](@/system/installation/amd64-notes-softraid.md)

# 注意

- 所有以 `# ` 开头的命令都需要你使用 `root` 来运行。

# 选择一个 Tarball

所有的 AMD64/x86_64 的 .tar 压缩包都是通用的。你要做的就是按你的喜好和需求选择他们。

> 注意：你在选择 .tar 压缩包的时候还要考虑你的设备是否支持，关于这部分的信息请参考 [AMD64/x86_64 system requirements](@/system/installation/amd64-notes-sysreq.md)。

## 可引导

- Base
- KDE/Plasma
- GNOME
- MATE
- XFCE
- LXDE
- i3 Window Manager

## 不可引导

- Container
- BuildKit

我们不会在本文里探讨如何部署 Container 或 BuildKit 版本。如有需要，请参阅 [(Broken link) AOSC Cadet Training](/developers/aosc-os/index).

# 准备安装环境

在没有一个可用的 Linux 环境的情况下安装 AOSC OS 是不可能的。而 AOSC OS 暂时还没有提供 Live 镜像。

所以在安装 AOSC OS 的过程中，我们推荐使用 [GParted Live](https://sourceforge.net/projects/gparted/files/gparted-live-stable/)，在本教程中我们也以该 Live 环境为范例。

> **警告：请确认你下载的是 AMD64 的版本，否则你将无法进入 AOSC OS 的 Chroot 环境！**

> 注意： 在使用 VMware 的过程里你可能会无法连接网络。

先准备 Live 环境，在这里使用 `dd` 来写入镜像。如果你使用的是 Windows，可以使用 [Rufus](https://rufus.akeo.ie/) 或 [Win32DiskImager](https://sourceforge.net/projects/win32diskimager/)。

```
# dd if=nameofimage.iso of=/dev/sdX bs=4M
```

其中:

- `nameofimage.iso` 是你下载的 GParted Live 的文件位置。
- `/dev/sdX` 是你的 USB 储存设备的路径。

在完成后，请启动到 Live 环境。

# 准备分区

在 AMD64/x86_64 架构下，AOSC OS 支持 GUID（用于 EFI 引导）和 MBR（用于传统 BIOS 引导）两种分区表。如果你将要与微软的 Windows，苹果的 macOS 或其他 Linux 发行版组成多系统，他们大多是使用 GUID 分区表的，而如果需要在老设备上进行安装，请选择 MBR 引导。

GParted Live 环境里的 GParted 使用起来非常简单。如果对如何使用有疑问，请参考：[GParted Manual](http://gparted.org/display-doc.php?name=help-manual)。

## 附加提示

- 如果你计划在多个分区上安装 AOSC OS，请在重启进入 AOSC OS 之前确认你创建了正确的 `/etc/fstab`，具体的方法将会在稍后说明。
- 如果你计划把 ESP（EFI 系统分区）作为 `/boot` 挂载，在升级系统时可能需要特别的注意，具体细节将会在稍后说明。

# 解压 Tarball

在分区设置完成后，已经可以开始解压你已经下载好的 AOSC OS 系统 Tarball。
在开始解压之前请把你的系统分区挂载到合适的路径。提示
在这里假设你要把 AOSC OS 安装到 `/dev/sda2`：

```
# mount -v /dev/sda2 /mnt
```

如果你需要把 `/dev/sda3` 作为 `/home`：

```
# mkdir -v /mnt/home
# mount -v /dev/sda3 /mnt/home
```

现在是时候解压 Tarball 了：

```
# cd /mnt
# tar --numeric-owner -pxvf /path/to/tarball/tarball.tar.xz
```

# 安装后配置

下面是在配置引导器之前，为了避免潜在的问题所需要的步骤。

## 生成 /etc/fstab

如果你在多个分区下安装 AOSC OS， 你需要配置正确的 `/etc/fstab`。可以使用 `genfstab` 这个工具：

```
# /mnt/usr/bin/genfstab -U -p /mnt >> /mnt/etc/fstab
```

## 绑定设备和系统路径

```
# mkdir /mnt/run/udev
# for i in dev proc sys run/udev; do mount --rbind /$i /mnt/$i; done
```

## 进入新系统

进入 Chroot 环境：

```
# chroot /mnt /bin/bash
```

如果你无法进入 Chroot 环境，很可能是因为你下载了错误架构的 Tarball（这个在之前已经 **加粗** 强调过了……）。

> 注意：在这一节过后，所有的命令全部需要在 Chroot 环境里执行。

## 更新，你的，系统！

Tarball 的更新周期比较长，所以我们建议在启动之前更新你的系统来修复 Tarball 发布后被发现的 BUG：

```
# apt update
# apt full-upgrade
```

## 创建 Init RAM Disk

使用下面的命令来创建 Init RAM Disk：

```
# sh /var/ab/triggered/dracut
```
若无法创建，请 `apt upgrade` 更新您的系统。

# 配置引导器

现在已经可以开始配置引导器了，在本文里将会使用 GRUB 作为示例。在使用 EFI 或 BIOS 引导的情况下安装 GRUB 所需要的命令也不一样，在本文里将会分别说明：

> 注意：你需要 GRUB 2.02（`grub` 版本 `2:2.0.2`）来将 NVMe-based 设备设定为启动驱动器。

> 注意：下面的所有命令都应该在 chroot 环境中执行。

## EFI 引导

在安装 GRUB 之前，请先挂载 ESP 分区，在本文里把 `/dev/sda1` 挂载到 `/efi` 作为示例（请根据你的实际情况修改命令里的路径）：

```
# mount /dev/sda1 /efi
```

然后安装 GRUB 到该分区并生成配置文件：

```
# grub-install --target=x86_64-efi --bootloader-id=“AOSC OS" --efi-directory=/efi
# grub-mkconfig -o /boot/grub/grub.cfg
```

对于 Bay Trail 设备，可能需要使用 `i386-efi` 作为 `target`。在不确定的情况下请不要使用下面的命令：

```
# grub-install --target=i386-efi --bootloader-id="AOSC OS" --efi-directory=/efi
# grub-mkconfig -o /boot/grub/grub.cfg
```

## BIOS 引导

在 BIOS 引导的情况下安装 GRUB 很简单，只需要确定把引导记录写到哪个（哪些）硬盘里。在大多数情况下安装引导记录的设备是 *硬盘* 比如 `/dev/sda`，而不是某个特定分区。在本文里也以 `/dev/sda` 作为例子：

```
# grub-install --target=i386-pc /dev/sda
# grub-mkconfig -o /boot/grub/grub.cfg
```

# 用户自定义设置

所有的 Tarballs 都不带有默认账户且 `root` 账户默认被禁用（你仍然可以用 `sudo` 来获取超级用户权限），你需要在重启进入 AOSC OS 之前创建一个账户。

## 创建用户

使用 `useradd` 命令添加用户（以 `aosc` 为例）： 

请确保此处设置的用户名只包含小写字母和数字。

```
# useradd -m -s /bin/bash aosc
```

接下来为 `aosc` 设置一些额外用户组以提供必要特性支持，如 `wheel` 组可提供 `sudo` 权限：

```
# usermod -a -G audio,cdrom,video,wheel aosc
```

## 设置用户全名

接下来（继续以 `aosc` 用户为例）设置用户全名：

```
# chfn -f "AOSC User" aosc
```

## 设置密码

通过下列命令为用户 `aosc` 设置密码，虽然不是必须的，还是强烈建议设置密码：

```
# passwd aosc
```

## 启用 Root 账户

尽管不建议这么做，你仍可以通过给 `root` 账户设置密码来启用它：

```
# passwd root
```

> 注意：正经的 Linux 用户不需要使用 Root 账户。

## 设置系统时区

时区信息储存在 `/usr/share/zoneinfo/<region>/<city>`，在这里以 `Asia/Shanghai` 作为例子：

```
# ln -svf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
```

## 设置系统语言

AOSC 在默认情况下启用了所有 UTF-8 编码的 Locale 。在一些情况下，如果你想要启用或禁用某些 Locale ，请编辑 `/etc/locale.gen`，并以 `root` 权限执行 `locale-gen`（这可能需要花费大量的时间）。

可以通过编辑 `/etc/locale.conf` 来设置默认的语言。比如把 `zh_CN.UTF-8` 设置为默认语言：

```
LANG=zh_CN.UTF-8
```

> 注意：在重启计算机后，你还可以使用 `localectl` 命令来做这件事：

```
localectl set-locale "LANG=zh_CN.UTF-8"
```

## 设置主机名

可以通过编辑 `/etc/hostname` 来设置主机名。比如把 `MyNewComputer` 设置为默认主机名：

```
MyNewComputer
```

> 注意：在重启计算机后，你还可以使用 `hostnamectl` 命令来做这件事：

```
hostnamectl set-hostname yourhostname
```
