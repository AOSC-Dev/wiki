+++
title = "Installation/ARM*/M1Mac (简体中文)"
description = "在 ARM M1 Mac 上安装 AOSC OS"
date = 2021-06-02
[taxonomies]
tags = ["sys-installation"]
+++

# 准备

在 M1 Mac 上使用 AOSC OS，你需要：

- 一台运行 macOS 11.2 及以上的 M1 Mac
- 一台 AArch64 Linux 设备用于编译内核和 preload-m1（用于在 M1 Mac 上引导 Linux），也可以交叉编译，但我们不提供交叉编译的支持
- 稳定的网络连接
- 有空余的磁盘空间（AOSC OS 至少需要 20GB 的磁盘空间，而用于引导 Linux 的 macOS 分区需要 70GB 的空间，原因稍后解释）
- （也许）需要一条 USB-C 3.0/SuperSpeed 线，用于调试设备
- 一个空间足够的启动 USB 磁盘（Base Tarball 建议 16GB，其他 Tarball 则建议 32GB）

# 分区

首先需要分区，与 AMD64 设备稍有不同，你需要认真的考虑分区策略。由于 APFS 会动态分配磁盘空间，一旦分区完成，改变布局会相当繁琐。在安装之前，请再三考虑：你要把 AOSC OS 安装到哪里？（硬盘还是外部存储？）安装 AOSC OS 之后是否要保留 macOS？

## 若保留 macOS

保留 macOS 的分区结构如下（下图的 ext4 分区可在你成功引导 Linux 之后进行格式化，再此之前先格式化成 FAT32，下同）：

- disk0s1: iBoot System Container（macOS 引导程序）
- disk0s2: Macintosh HD (OS #1 macOS APFS 容器)
- disk0s3: LinuxBoot（用于引导 Linux 的 macOS）
- disk0s4: Linux /boot (FAT32)
- disk0s5: Linux / (ext4)
- disk0s6: 1TR (macOS 救援系统)

若你的 M1 Mac 硬盘是 500GB 的：（下同）

```
# diskutil apfs resizeContainer disk0s2 200GB
# diskutil addPartition disk0s2 APFS LinuxBoot 70GB
# diskutil addPartition disk0s5 FAT32 LB 1GB
# diskutil addPartition disk0s4 FAT32 LR 0
```

你需要一个 70GB 的分区用于安装引导 Linux 的 macOS，为何仅仅用于引导 Linux 的 macOS 分区要这么大？因为 macOS 的安装和更新实在是非常的低效，需要至少这么多空间才能够正常安装。

## 若不保留 macOS

不保留 macOS 的分区结构如下：

- disk0s1: iBoot System Container（macOS 引导程序）
- disk0s2: LinuxBoot（用于引导 Linux 的 macOS）
- disk0s3: Linux /boot (FAT32)
- disk0s4: Linux / (ext4)
- disk0s6: 1TR (macOS 救援系统)

若要变成这样的分区表，你需要关机长按电源键进入 1TR（macOS 的救援程序，下同），选择 "选项" 后，在救援程序的标题栏中进入终端，执行以下命令：

```
# diskutil deketeVolume disk0s2 
# diskutil addPartition disk0s1 APFS LinuxBoot 70GB
# diskutil addPartition disk0s4 FAT32 LB 1GB
# diskutil addPartition disk0s3 FAT32 LR 0
```

## 若安装至 USB 磁盘

仅仅只做分配出 70GB 空间，并创建一个叫 "LinuxBoot" 的分区就好。

# 在 LinuxBoot 分区上安装 macOS

重启，长按电源键进入 1TR，并选择 "重新安装 macOS"，并选择叫 "LinuxBoot" 的分区，按照提示安装即可。安装后请检查你是否有可用的管理员账户，以及 macOS 版本是否为 11.2 及以上。若都正常，请关机，按住电源键进入 1TR。

# 关闭安全检查

首先进入 "工具 -> 终端"，输入以下命令：

```
# diskutil apfs listVolumeGroups
```

查看你的 LinuxBoot 分区是哪个 UUID，把这个 UUID 记下来以便后面你认得出哪个 UUID 是 LinuxbBoot 分区的 UUID。

再执行：

```
# bputil -nkcas
```

这里需要你选择你刚刚记住的那个指向 LinuxBoot 分区的 UUID，之后按照提示输入用户和密码即可。

同样的，再执行：

```
# csrutil disable
```

选择 LinuxBoot，这样安全检查就完全再见了。但若遇到奇怪的权限问题，你可能还需要执行：

```
# csrutil clear
```

# 为启动 USB 磁盘分区

无论你最终目标是安装到内部硬盘还是 USB 磁盘，都需要先把 Linux 安装到 USB 启动磁盘上。因为前者还需要格式化目标分区用于安装 AOSC OS。

分区后应该像这样（假设 USB 磁盘是 `/dev/sda`）：

- /dev/sda1 1GB FAT32
- /dev/sda2 （其他剩余容量）ext4

# 编译内核和 preload-m1

接下来，切换到你的 AArch64 Linux 机器上，拉取需要用到的 linux-m1 内核源码：

```
$ git clone https://github.com/AOSC-Dev/linux.git
$ cd linux
$ git checkout corellium-linux-m1
```

调整内核配置，由于一开始需要把系统写入 USB 磁盘，要调整内核启动参数的 `root` 为分区位置，所以：

```
$ cp -v ./arch/arm64/configs/defconfig-m1 .config
$ nano .config // 找到 CONFIG_CMDLINE 并改成 root=/dev/sda2 rw splash=off quiet
$ make -j$(nproc)
```

把 kernel modules 提取出来，放到一个压缩包中：

```
# make modules_install 
$ tar -cvf linux-modules.tar /usr/lib/modules/5.11.0-rc4-aosc-main-m1+
$ xz -T0 linux-modules.tar
```

接下来我们再编译 preload-m1，拉取源码，复制内核和内核树（.dtb 文件）并编译：

```
$ git clone https://github.com/AOSC-Dev/preloader-m1
$ cd preloader-m1
$ cp /linux/m1/source/path/arch/arm64/boot/Image .
$ cp /linux/m1/source/path/arch/arm64/boot/dts/apple/apple-m1-j274.dtb .
$ make
```

编译成功后（会得到一个 linux.macho），再当前位置打开一个 http 服务器，使得 M1 Mac 通过网络可以访问到这里，下载文件：

```
$ python3 -m http.server
```

# 往 LinuxBoot 分区写入启动配置

接下来再次进入 1TR，打开终端，执行以下命令下载并安装 macho 文件：

```
$ curl /your/aarch64/host/ip:8000/linux.macho > linux.macho
# kmutil configure-boot -c linux.macho -C -v /Volume/LinuxBoot
```

恭喜，内核已经成功安装。

# 把系统写入 USB 磁盘

在 Mac 以外的 Linux 机器上，把 tarball 写入到 USB 磁盘的第二个分区中（这里假设第二个分区号是 `/dev/sda2`，可以通过 `lsblk` 查看）（安装到 USB 磁盘后需要执行的步骤请参考 AMD64 安装指南）：

```
# mount /dev/sda2 /mnt
# cd /mnt
# tar --numeric-owner -xvf /mnt
```

请注意的是，解压完成后必须 chroot 进去修改 Root 密码，否则将无法登录：

```
# arch-chroot /mnt
# passwd
```

之后再把之前打包的内核模块解压到对应的路径，否则启动后甚至无法使用键盘：

```
# tar --numeric-owner -xvf /your/kernel/modules/path.tar.xz /usr/lib/modules
```

一切完成后，把 USB 磁盘插入到你的 M1 Mac 中启动，若无意外，你应该就能看到 AOSC OS 的登录控制台了。

# 把系统写入到内部硬盘
若你只打算安装到 USB 磁盘中，现在已经完成了。但若你需要安装到内置的硬盘，则需要先把刚刚那个 Linux 目标分区格式化了，在这个例子里，则是 disk0s4:

- disk0s1: iBoot System Container（macOS 引导程序）
- disk0s2: LinuxBoot（用于引导 Linux 的 macOS）
- disk0s3: Linux /boot (FAT32)
- disk0s4: Linux / (ext4)
- disk0s5: 1TR (macOS 救援系统)

列出 `lsblk` 看看对应的是哪个：

```
$ lsblk
...
nvme0n1     259:0    0 465.9G  0 disk 
├─nvme0n1p1 259:1    0   500M  0 part 
├─nvme0n1p2 259:2    0  65.2G  0 part 
├─nvme0n1p3 259:3    0   952M  0 part
├─nvme0n1p4 259:4    0 394.3G  0 part 
└─nvme0n1p5 259:5    0 5G      0 part
...
```

这个例子中 nvme0n1p4 就是所要的分区，我们需要继续更改内核配置的 CMDLINE，再编译内核和 preload-m1：

```
$ nano KERNEL_DIRECTORY/.config // 找到 CONFIG_CMDLINE 并改成 root=/dev/nvme0n1p4 rw splash=off quiet
$ make -j$(nproc)
$ cd PRELOAD_M1_DIRECTORY
$ cp /linux/m1/source/path/arch/arm64/boot/Image .
$ cp /linux/m1/source/path/arch/arm64/boot/dts/apple/apple-m1-j274.dtb .
$ make
```

接下来挂载 `/dev/nvme0n1p4` 并在其中解压 tarball：

```
# mount /dev/nvme0n1p4 /mnt
# tar --numeric-owner -xvf /your/aosc/tarball/path /mnt
```

解压 kernel modules 到 `/mnt/usr/lib/modules`：

```
# tar --numeric-owner -xvf /your/krtnrl/modules/tarball/path /mnt/usr/lib/modules
```

Chroot 并修改 Root 密码，否则无法登录：

```
# arch-chroot /mnt
# passwd
```

关机，再执行步骤六（即使用 kmutil 写入 macho 到 LinuxBoot 分区），重启，如无意外应该已经进入 AOSC OS 了。

# Wi-Fi

若需要 Wi-Fi，你可以尝试如下操作：

```
# mount /dev/nvme0n1p3 /mnt // 即那个 1GB 大小的 FAT32 分区
# cp -RLav /usr/share/firmware/wifi /mnt
```

并重启看看是否能够加载，我们目前尚未测试该方法的可用性。

# 已知问题

- 目前安装步骤繁琐，需要更加简化。
- 内核的 evlog 似乎没有找到关闭的选项（`CONFIG_INPUT_EVBUG=n` 并没有作用），现在在 tty 中打一个字就会打印一条调试信息，导致在纯 TTY 环境下可用性很差。

# 参考
- [Corellium 的 M1 Linux 安装教程（英语）](https://corellium.com/blog/linux-m1)
- [Asahi Linux 开发者指南（英语）](https://github.com/AsahiLinux/docs/wiki/Developer-Quickstart)