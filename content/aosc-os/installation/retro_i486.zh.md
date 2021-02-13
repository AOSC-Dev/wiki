+++
title = "Installation/Retro_i486 (简体中文)"
description = "在 i486 设备安装 AOSC OS/Retro"
date = 2021-02-13T16:28:52.708Z
[taxonomies]
tags = ["sys-installation"]
+++

本文适用于 i486 架构的设备上安装 AOSC OS/Retro。

# 注意

- 所有以 `# ` 开头的命令请使用 `root` 用户来运行。

# 选择一个 Tarball

所有 i486 的 .tar 归档包都通用。任君选择即可。

> 注意：在选择 .tar 归档包时，请查看设备是否受支持，于此请参考 [Retro/intro](@/aosc-os/retro/intro.zh.md) 中`系统要求（x86）`一节。

# 准备安装环境

安装 AOSC OS/Retro 需要 Linux 环境，但我们暂时没有提供 Live 镜像。

考虑到安装此系统的设备配置较低，我们推荐使用 [TinyCoreLinux](http://tinycorelinux.net/downloads.html) 的 CorePlus 作为 Live 环境，接下来以此为示例。

> **警告：请确认你下载的是 CorePlus，只有它是可以引导的！**

> 提示：如果设备内存太小或者不支持光盘/U 盘启动，建议拆盘安装。

先准备 Live 环境，在此推荐使用 `dd` 来写入镜像。若你在使用 Windows，可以尝试 [Rufus](https://rufus.akeo.ie/) 或 [Win32DiskImager](https://sourceforge.net/projects/win32diskimager/)。

```
# dd if=nameofimage.iso of=/dev/sdX bs=4M
```

其中:

- `nameofimage.iso` 是你下载的 CorePlus 文件位置。
- `/dev/sdX` 是你的可启动设备路径。

在完成后，请启动到此环境。

## 附加提示

- 如果采用拆盘安装的方案，请注意替换后文中目标磁盘的挂载路径。
- 启动 CorePlus 时会用许多启动项，无论那一项均可满足我们的需要。
- 在 CorePlus 的 Live 环境里你可以使用 `sudo su root` 来获得 `root` 身份。 

# 准备分区

对于在 i486 架构的设备上安装 AOSC OS/Retro，我们只介绍使用 MBR 分区表的情形。

在此推荐使用 fdisk 进行分区。有关此软件之问题，请参考 [fdisk Manual](https://man.archlinux.org/man/fdisk.8)。

## 附加提示

- 若你在多分区上安装 AOSC OS/Retro，请在重启之前创建了正确的 `/etc/fstab`，具体方法在稍后说明。

# 解压 Tarball

在分区设置完成后，请解压 tarball 以准备安装。在开始解压前请挂载到欲安装分区。如下（在此假设安装到 `/dev/sda1` ）：

```
# mkdir /root/mnt
# mount -v /dev/sda1 /root/mnt
```

如果将把 `/dev/sda2` 作为 `/home`：

```
# mkdir -v /root/mnt/home
# mount -v /dev/sda2 /root/mnt/home
```

之后解压 Tarball：

```
# cd /root/mnt
# tar --numeric-owner -pxvf /path/to/tarball/tarball.tar.xz
```

# 安装后配置

在配置引导器之前为了避免问题，应做：

## 绑定设备和系统路径

```
# mkdir /root/mnt/run/udev
# for i in dev proc sys run/udev; do mount --rbind /$i /root/mnt/$i; done
```

## 进入新系统

进入 Chroot 环境：

```
# chroot /root/mnt /bin/bash
```

> 注意：此后命令全部需要在 Chroot 环境执行。

## 生成 /etc/fstab

如果你在多分区上安装 AOSC OS/Retro， 则需要正确的 `/etc/fstab`。可用 `genfstab` ：

```
# genfstab -U -p / >> /etc/fstab
```

检查 `/etc/fstab` 文件是否正确，并做出一些必要的修改，比如删除 `zram` 所在的行。

## 更新，你的，系统！

Tarball 更新周期较长，建议在启动前更新系统修复 Tarball 发布后发现的 BUG：

```
# apt update
# apt full-upgrade
```

# 配置引导器

现在应开始配置引导器，在此将会使用 GRUB 作示例。

在 BIOS 引导下安装 GRUB 很简单，只需将引导记录写到某个启动设备内。大多情况下，装载引导记录的设备是*硬盘*比如 `/dev/sda`，不是某个特定分区。在此安装到 `/dev/sda` 为例：

```
# grub-install --target=i386-pc /dev/sda
# grub-mkconfig -o /boot/grub/grub.cfg
```

# 用户自定义设置

AOSC OS/Retro 默认不带用户且不开启 Root 用户（你仍可 `sudo` 来获取超级用户权限），在重启进入 AOSC OS/Retro 之前应创建用户。

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

编辑 `/etc/locale.gen` 移除需要的地区前的注释符号 `#`。

接着执行 `locale-gen` 以生成 locale 信息：

```
# locale-gen
```

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

## 配置预设服务

> 这将会使用我们的预设文件来启用一些服务，如 `xdm` 和 `NetworkManager` 。

```
# systemctl preset-all
```
