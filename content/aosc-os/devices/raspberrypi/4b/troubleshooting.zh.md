+++
title = "树莓派 4B 故障排除指南"
description = "FAQs and troubleshooting guides for Raspberry Pi 4B"
date = 2021-04-14T04:37:11.499Z
[taxonomies]
tags = ["sys-installation"]

+++

# 通用故障排除

本节内容将带你逐步排除树莓派的相关问题。

## HDMI 接口无输出

- 移除连接到树莓派上的所有外设、存储，包括 SD 卡。然后将 MicroHDMI 线插入 Type-C 接口旁的 MicroHDMI 口。
- 如果你能看到启动诊断屏幕，则说明树莓派启动正常，请进一步检查操作系统的安装。
- 如果依旧无输出，则请[重新写入 EEPROM 固件](https://www.raspberrypi.org/documentation/hardware/raspberrypi/booteeprom.md)。

## 卡在启动诊断屏幕

检查你的系统介质是否已经插入，若介质存在，请确认 `start4.elf` 存在并完整。在另一台机器上挂载系统介质，重新安装 `rpi-firmware-boot` 软件包。

## 卡在彩虹屏幕

这意味着你的树莓派无法找到内核，或者内核损坏无法启动。请检查 `kernel8.img` 或指定的内核文件存在于启动分区的根目录中。内核必须为未压缩的 `Image`。

请同时检查 HDMI 接口是否接错。请保持 HDMI 连接在 Type-C 接口旁的 MiniHDMI 接口。第二个 HDMI 接口只有在系统启动之后才可用。

## 屏幕左上角有树莓派的标志，其余黑屏

如果没有光标闪动，说明内核已经崩溃了。

检查 `cmdline.txt`，删除其中的 `quiet` 参数，否则在启动时无法看到内核输出。

如果光标依旧在闪动，说明内核依旧在等待根文件系统出现。检查 `cmdline.txt`，确保 `root=` 参数指向了正确的根分区。

## 内核崩溃了 (panicked)

内核崩溃的原因有很多，具体请观察屏幕提示。以下是几个例子：

- `VFS: Unable to mount root fs on unknown-block(0,0)`:
  
  内核无法定位到根文件系统。检查 `cmdline.txt`，确保 `root=` 参数指向了正确的根分区，并且 `rootwait` 存在。

- `Attempted to kill init!`
  
  初始化程序意外结束。重新安装操作系统可能解决问题。如果你使用 initrd，尝试去掉 initrd 选项。

## 性能不佳

该问题不应该在 AOSC OS 中出现，因为 AOSC 的树莓派内核使用的是 `ondemand` 调度器。

如果你在使用树莓派官方分发的内核，请注意，该内核中 CPU 默认调度器为 `powersave`，它会一直保持你的树莓派运行在最低频率。

要设置 CPU 调度器，运行如下命令：

```
sudo cpupower frequency-set -g governor
```

`ondemand` 和 `conservative` 是很好的选择。如果你的散热足够好，考虑使用 `performance` 或者超频。

另请参阅
------

- [树莓派文档](https://www.raspberrypi.org/documentation/)
- [树莓派 GitHub](https://github.com/raspberrypi/)
- [eLinux.org 社区文档](https://elinux.org/RPi_Hub)
- [LibreELEC 源码](https://github.com/LibreELEC/LibreELEC.tv)
- [Arch Linux ARM Wiki](https://archlinuxarm.org/wiki/Raspberry_Pi)
