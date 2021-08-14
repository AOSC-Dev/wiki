+++
title = "Installation/AMD64/SoftRAID (简体中文)"
description = "在配置有软件磁盘阵列的设备上安装 AOSC OS"
date = 2020-05-04T03:36:58.392Z
[taxonomies]
tags = ["sys-installation"]
+++

要想在配置有软件磁盘阵列的设备上安装 AOSC OS，在执行完 [常规的安装流程](@/aosc-os/installation/amd64.zh.md) 之后还需要进行一些额外的操作。

# 注意

- 所有以 `# ` 开头的命令都需要您使用 `root` 来运行。

# RAM Disk 初始化配置

要成功引导阵列上的系统，我们需要制作 initrd/initramfs 镜像。在此之前，为了能检测到您的软件磁盘阵列，我们需要先对 `dracut` 配置文件进行一些修改。使用您偏好的编辑器编辑 `/etc/dracut.conf`，在文件中加入下面的内容：

```bash
# For MD-RAID support modules
add_dracutmodules+=" mdraid "
# Use generated mdadm.conf
mdadmconf="yes"
```

现在我们来制作 initrd 启动镜像文件：

```
# update-initramfs
```

# 内核参数

使用您偏好的编辑器编辑 `/etc/default/grub`，找到带有 `GRUB_CMDLINE_LINUX_DEFAULT` 的一行，在两个引号中间加入 `rd.auto rd.auto=1`，然后重新生成 GRUB 主配置文件 `grub.cfg`：

```
# grub-mkconfig -o /boot/grub/grub.cfg
```

# 配置 MDADM

使用下面的命令创建 `mdadm.conf`：

```
# mdadm --detail --scan >> /etc/mdadm.conf
```
