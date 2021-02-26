+++
title = "Installation/PowerMac (简体中文)"
description = "在 PowerPC/PPC64 架构的 Macintosh 设备安装 AOSC OS"
date = 2020-05-04T03:37:16.458Z
[taxonomies]
tags = ["sys-installation"]
+++

<!--
Needs update: The "User, and Post-installation Configuration" chapter is PROBABLY out-of-dated as the `aosc` account is no longer provided in other ports. The "Extra Notes" chapter is NOT translated yet.
-->

受设备可用性限制，我们只在 G3/G4 [NewWorld](https://en.wikipedia.org/wiki/New_World_ROM) Apple Macintosh 设备上对 AOSC OS 的 PowerPC 架构支持进行了测试；只在 G5 Apple Macintosh 设备上对 AOSC OS 的 PPC64 架构支持进行了测试。

因此很遗憾，我们目前只为 Macintosh 设备提供 PowerPC/PPC64 架构支持。本指南将引导你在这些设备上安装 AOSC OS，并使用 Yaboot 引导器引导系统。安装过程中的每个步骤都是至关重要的，所以不要随意跳过某个步骤！

# 注意

- 所有以 `# ` 开头的命令请使用 `root` 用户来运行。

# 选择一个 Tarball

所有的 PowerPC 32/64-bit 的 .tar 压缩包都是通用的。您要做的就是按您的喜好和需求选择他们。

> 注意：您在选择 .tar 压缩包的时候还要考虑您的设备是否支持，关于这部分的信息请参考 [PowerPC 系统要求](@/aosc-os/installation/powermac-notes-sysreq.md)。

## 可引导

- Base
- MATE
- XFCE
- LXDE
- i3 Window Manager

## 不可引导

- Container
- BuildKit

在此略过 Container 或 BuildKit 版本的安装与配置。若有需要，请参阅 [(Broken link) AOSC Cadet Training](/developers/aosc-os/index)。


# 获取 Lubuntu Live

为了完成 AOSC OS 的安装，你需要一个 Live 演示系统，我们推荐你使用 Lubuntu 16.04 LTS，你可以从下面的两个版本中任选一个进行下载：

- 桌面版本，[点击这里下载](http://cdimage.ubuntu.com/lubuntu/releases/16.04/release/lubuntu-16.04-desktop-powerpc.iso)。
- 备选版本，[点击这里下载](http://cdimage.ubuntu.com/lubuntu/releases/16.04/release/lubuntu-16.04-alternate-powerpc.iso)。

接下来将下载下来的镜像文件写入 USB 闪存设备，绝大部分的 NewWorld PowerPC Macintosh 支持从 USB 设备引导。在 Lubuntu 镜像文件所在的目录执行：

```
# dd if=nameofimage.iso of=/dev/sdX bs=4M
```

其中：

- `nameofimage.iso` 是 Lubuntu 介质的文件名。
- `/dev/sdX` 是 USB 闪存设备的设备名。

# 引导 Lubuntu Live

如果你能从 USB 闪存设备引导 Lubuntu 那当然是最好的。但如果你无法这样做，或你在使用基于 USB 1.1 的 G3 系统，你也可以考虑将介质文件烧录到 CD/DVD，并从 CD/DVD 引导 Lubuntu。

## 从 USB 闪存设备引导

按下电源按钮后，立即按住 Option 键。如果你能进入引导选单并能从中找到你的 USB 闪存设备，那么你很幸运，只需要选择你的设备并按下右键启动即可。

如果你无法通过这种方式引导 Lubuntu，你可能需要使用 Open Firmware 手动引导。者也就意味着你需要使用下面的组合键进入 Open Firmware 的命令行界面：

```
Command + Option/Alt + O + F
```

当你看到 `OK` 字样并能看到 Open Firmware 命令行界面（应该是白底黑字的），输入下面的命令（我们假设你没有插入其它的 USB 设备）：

```
boot ud:2,\\yaboot
```

要注意的是，在某些情况下需要输入的命令可能会有所不同。如果你在使用一台 2005 产的 12 寸 PowerBook G4（1.5GHz G4），那么正确命令应该是下面这个（如果你执行上面的命令，恐怕只会得到 "forbidden" 的提示）：

```
boot usb1/disk@1:,\\yaboot
```

接下来就应该可以看到引导菜单了：

- 如果你在使用 G3/G4，请输入 `linux32` 并按下回车键。
- 如果你在使用 G5，请输入 `linux64` 并按下回车键。

## 从 CD/DVD 介质引导

在启动 PowerPC Macintosh 的时候长按 `c` 以从 CD/DVD 介质引导。如果一切顺利，你应该能够看到引导菜单：

- 如果你在使用 G3/G4，请输入 `linux32` 并按下回车键。
- 如果你在使用 G5，请输入 `linux64` 并按下回车键。

## 准备分区

PowerPC Macintoshs 使用一个叫做 [苹果分区映射](https://en.wikipedia.org/wiki/Apple_Partition_Map) 的分区结构，许多人可能从来没有听说过这个玩意。要给这些设备分区，遵守一些特定的规则，也需要一些特殊工具。简而言之：

- 第一个分区必须是所有分区的抽象映射。
- 第二个分区必须是 "Bootstrap" 分区，用于放置引导加载程序。
- 其它分区则没有更多要求。

第一个分区是不可挂载的，因为它本身就是所有分区的抽象映射。第二个分区则需要 HFS 文件系统（不是 HFS+）。

下面我们将假设您的硬盘上没有安装任何操作系统，并且不打算保留硬盘上的任何数据（如果您已经在硬盘上安装了一个操作系统，麻烦事可能会少一些，你是需要调整已有分区的大小并为 AOSC OS 创建一个分区就好了）。我们接下来将使用 `mac-fdisk` 对硬盘进行分区，假设您打算将 AOSC OS 安装到 `/dev/sda` 上：

```
# mac-fdisk /dev/sda
```

然后严格按照下面的顺序操作：

- 按下 `i` 初始化分区映射信息，从而建立第一个分区。
- 按下 `b` 创建 "Bootstrap" 分区。

接下来就随你便啦！不过要主要的是 G3/G4 设备的 RAM 确实很小，我们还是建议你创建一个 4GB 以上大小的交换分区以保证使用体验。

接下来格式化 "Bootstrap" 分区：

```
# mkfs.hfs /dev/sda2
```

# 解压 Tarball

首先我们把系统根分区（注意不是 "Bootstrap" 分区）挂载到 `/mnt`。我们假定这个分区是 `/dev/sda3`（毕竟前两个分区应该已经被用作 "Map" 和 "Bootstrap" 分区了）：

```
# mount /dev/sda3 /mnt
```

如果你还希望将 `/dev/sda4` 用作用户目录分区，我们还要把它给挂载到 `/mnt/home`:

```
# mkdir -v /mnt/home
# mount -v /dev/sda4 /mnt/home
```

接下来我们解压 Tarball 吧：

```
# cd /mnt
# tar --numeric-owner -pxf /path/to/tarball/tarball.tar.xz
```

如果你希望得到一个更加刺激的体验，使用下面的命令（已在解压时输出更详细的信息）：

```
# cd /mnt
# tar --numeric-owner -pxvf /path/to/tarball/tarball.tar.xz
```

# 安装后配置

在配置引导程序之前还需要做一些准备工作，以避免各种潜在的问题发生。

## 生成 /etc/fstab Generation

如果您在多个分区下安装 AOSC OS， 您需要配置正确的 `/etc/fstab`。可以使用 `genfstab` 这个工具：

```
# /mnt/usr/bin/genfstab -U -p /mnt >> /mnt/etc/fstab
```

## 绑定设备和系统路径

```
# for i in dev proc sys; do mount --rbind /$i /mnt/$i; done
```

> 注意：在这一节过后，所有的命令全部需要在 Chroot 环境里执行。

## 进入新系统

进入 Chroot 环境：

```
# chroot /mnt /bin/bash
```

如果你在使用 G5 设备，你可能无法立马进入新系统，这是因为 Lubuntu 的 Live 环境是 32 位的，但我们新安装的系统是 64 位的。这种情况下，你需要先为 Lubuntu 添加合适的架构支持，并安装相应的软件包：

```
# dpkg --add-architecture ppc64
# apt update
# apt install libc6:ppc64
```

## 更新，你的，系统！

Tarball 的更新周期比较长，所以我们建议在启动之前更新您的系统来修复 Tarball 发布后被发现的 BUG：

```
# apt update
# apt full-upgrade
```

## 初始化 RAM Disk

使用下面的命令来初始化 RAM Disk：

```
# update-initramfs
```

# 配置引导器

> 注意：下面的所有命令都应该在 chroot 环境中执行。

现在已经可以开始配置引导器了，在 PowerPC 架构的 Macintosh 设备上，我们默认使用 Yaboot 这个引导器。首先我们来安装它：

```
# ybin -v -b /dev/sda2
```

如果你在 `/dev/sda3` 上安装了 AOSC OS，那么不需要再做其它调整了。否则的话，你需要挂载 "Bootstrap" 分区：

```
# mount /dev/sda2 /mnt
```

然后打开 `/etc/yaboot.conf`，根据文件中的注释完成编辑。

# 用户自定义设置

> 注意：下面的所有命令都应该在 chroot 环境中执行。

所有的 Tarballs 都带有默认账户 `aosc` 且 `root` 账户默认被禁用。我们建议你在重启进入 AOSC OS 之前修改默认账户的用户名和密码，并不启用 `root` 账户（您仍然可以用 `sudo` 来获取超级用户权限）。

账户 `aosc` 的密码是 `anthon`。

## 账户重命名

要想为 `aosc` 账户重命名：

```
# usermod -d /home/username -l username -m aosc
```

其中，你需要把 `username` 替换为你希望为账户取的新账户名。

## 密码重置

要想为刚刚完成重命名的账户修改密码：

```
# passwd username
```

其中，你需要把 `username` 替换为你刚刚为账户取的新账户名。

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