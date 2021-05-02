+++
title = "Installation/AMD64 (简体中文)"
description = "在 AMD64/x86_64 设备安装 AOSC OS"
date = 2020-05-04T04:24:52.709Z
[taxonomies]
tags = ["sys-installation"]
+++

本文适用于 AMD64 架构通用环境。对于部分特殊环境，请参考：

- [针对 KVM 的跗注](@/aosc-os/installation/amd64-notes-kvm.zh.md)
- [针对 Bay Trail/Cherry Trail 的跗注](@/aosc-os/installation/amd64-notes-trails.zh.md)
- [针对 software RAID 的跗注](@/aosc-os/installation/amd64-notes-softraid.zh.md)

# 注意

- 所有以 `# ` 开头的命令请使用 `root` 用户来运行。

# 选择一个 Tarball

所有 AMD64 的 .tar 归档包都通用。任君选择即可。下面列出可引导与不可引导的 tarball。

> 注意：在选择 .tar 归档包时，请查看设备是否受支持，于此请参考 [AMD64/x86_64 system requirements](@/aosc-os/installation/amd64-notes-sysreq.md)。

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

在此略过 Container 或 BuildKit 版本的安装与配置。若有需要，请参阅 [(Broken link) AOSC Cadet Training](/developers/aosc-os/index).

# 准备安装环境

安装 AOSC OS 需要 Linux 环境，但我们暂时没有提供 Live 镜像。

所以要安装此系统，我们推荐使用 [GParted Live](https://sourceforge.net/projects/gparted/files/gparted-live-stable/)，在此以该 Live 环境示例。

> **警告：请确认你下载的是 AMD64 版本，否则将无法进入 AOSC OS 的 Chroot 环境！**

> 注意：若你使用 VMWare，则在此过程中可能无法使用网络。

先准备 Live 环境，在此推荐使用 `dd` 来写入镜像。若你在使用 Windows，可以尝试 [Rufus](https://rufus.akeo.ie/) 或 [Win32DiskImager](https://sourceforge.net/projects/win32diskimager/)。

```
# dd if=nameofimage.iso of=/dev/sdX bs=4M
```

其中:

- `nameofimage.iso` 是你下载的 GParted Live 文件位置。
- `/dev/sdX` 是你的可启动设备路径。

在完成后，请启动到此环境。

# 准备分区

在 AMD64 架构下，我们支持 GUID（用于 EFI 引导）和 MBR（用于传统 BIOS 引导）两种分区表。若你组成多系统，请选择 GUID 分区表，而若要安装到老设备，请选择 MBR 引导。

在此推荐使用 GParted 进行分区。有关此软件之问题，请参考 [GParted Manual](http://gparted.org/display-doc.php?name=help-manual)。

## 附加提示

- 若你在多分区上安装 AOSC OS，请在重启之前创建了正确的 `/etc/fstab`，具体方法在稍后说明。
- 如果你将 ESP（EFI 系统分区）挂载到 `/boot`，在升级系统时需要注意，具体细节在稍后说明。

# 解压 Tarball

在分区设置完成后，请解压 tarball 以准备安装。在开始解压前请挂载到欲安装分区。如下（在此假设安装到 `/dev/sda2` ）：

```
# mount -v /dev/sda2 /mnt
```

如果将把 `/dev/sda3` 作为 `/home`：

```
# mkdir -v /mnt/home
# mount -v /dev/sda3 /mnt/home
```

之后解压 Tarball：

```
# cd /mnt
# tar --numeric-owner -pxvf /path/to/tarball/tarball.tar.xz
```

# 安装后配置

在配置引导器之前为了避免问题，应做：

## 生成 /etc/fstab

如果你在多分区上安装 AOSC OS， 则需要正确的 `/etc/fstab`。可用 `genfstab` ：

```
# /mnt/usr/bin/genfstab -U -p /mnt >> /mnt/etc/fstab
```

## 进入新系统


进入 Chroot 环境：

```
# /mnt/usr/bin/arch-chroot /mnt /bin/bash
```

若你无法进入 Chroot 环境，则可能使用了不合要求的 Tarball（这个在之前已经**加粗**强调过了……）。

> 注意：此后命令全部需要在 Chroot 环境执行。

## 更新，你的，系统！

Tarball 更新周期较长，建议在启动前更新系统修复 Tarball 发布后发现的 BUG：

```
# apt update
# apt full-upgrade
```

## 初始化 RAM Disk

使用下面的命令来初始化 RAM Disk：

```
# update-initramfs
```
若无法创建，应 `apt full-upgrade` 更新系统。

# 配置引导器

现在应开始配置引导器，在此将会使用 GRUB 作示例。使用不同引导方式（EFI/MBR）下安装 GRUB 的方式皆不同，在本文里将会分别说明。

## EFI 引导

在安装 GRUB 之前，先挂载 ESP 分区，在此将 `/dev/sda1` 挂载到 `/efi` （请根据实际情况修改路径）：

```
# mount /dev/sda1 /efi
```

然后安装 GRUB 到此分区并生成配置：

```
# grub-install --target=x86_64-efi --bootloader-id="AOSC OS" --efi-directory=/efi
# grub-mkconfig -o /boot/grub/grub.cfg
```

对于 Bay Trail 设备，可能需要使用 `i386-efi` 作为 `target` ：

```
# grub-install --target=i386-efi --bootloader-id="AOSC OS" --efi-directory=/efi
# grub-mkconfig -o /boot/grub/grub.cfg
```

## BIOS 引导

在 BIOS 引导下安装 GRUB 很简单，只需将引导记录写到某个启动设备内。大多情况下，装载引导记录的设备是*硬盘*比如 `/dev/sda`，不是某个特定分区。在此安装到 `/dev/sda` 为例：

```
# grub-install --target=i386-pc /dev/sda
# grub-mkconfig -o /boot/grub/grub.cfg
```

# 用户自定义设置

AOSC OS 默认不带用户且不开启 Root 用户（你仍可 `sudo` 来获取超级用户权限），在重启进入 AOSC OS 之前应创建用户。

## 创建用户

使用 `useradd` 命令添加用户（以 `aosc` 为例，下同）： 

请确保用户名只包含小写字母和数字。

```
# useradd -m -s /bin/bash aosc
```

加入用户组以提供必要特性支持，例 `wheel` 组可提供 `sudo` 权限：

```
# usermod -a -G audio,cdrom,video,wheel aosc
```

## 设置用户全名

接下来设置用户全名：

```
# chfn -f "AOSC User" aosc
```

## 设置密码

通过下列命令为用户设置密码：

```
# passwd aosc
```

## 启用 Root 账户

虽不建议，但仍可设置 root 密码以开启：

```
# passwd root
```

> 注意：正经的 Linux 用户从不使用 Root 账户。

## 设置系统时区

时区信息在 `/usr/share/zoneinfo/<region>/<city>`，以 `Asia/Shanghai` 为例：

```
# ln -svf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
```

## 设置系统语言

默认情况下，我们启用了所有 UTF-8 编码的 Locale 。若想启用或禁用某些 Locale ，请编辑 `/etc/locale.gen`，并以 `root` 权限执行 `locale-gen`（此操作需要时间）。

编辑 `/etc/locale.conf` 设置默认语言。例如设置为 `zh_CN.UTF-8` ：

```
LANG=zh_CN.UTF-8
```

> 注意：以后还可用 `localectl` 来做此事：

```
localectl set-locale "LANG=zh_CN.UTF-8"
```

## 设置主机名

编辑 `/etc/hostname` 来设置主机名。例如设置为 `MyNewComputer` ：

```
MyNewComputer
```

> 注意：以后还可用 `hostnamectl` 来做此事：

```
hostnamectl set-hostname yourhostname
```
