+++
title = "Installation/ARM*/RaspberryPi/Troubleshooting"
description = "树莓派的常见问题及故障排除"
date = 2021-04-14T04:37:11.499Z
[taxonomies]
tags = ["sys-installation"]

+++

这里将讲述使用树莓皮中出现的一些常见问题，以及一些基本的故障排除。

配置树莓派
------

如君所见，树莓派一些底层设置是可以通过 `config.txt` 和 `cmdline.txt` 配置的。

`config.txt` 存放着各种基本配置信息，它控制着各种硬件接口（如 UART, I2C, SPI 等）的行为，以及管理设备树的加载。

`cmdline.txt` 存储启动内核时使用的参数。

为了增强体验，除去启用 64 位内核（`arm_64bit=1`）之外，我们默认开启了以下配置参数：

- 启动时自动加载蓝牙硬件 (`dtparam=krnbt=on`)
- 启用 VideoCore 4 GPU 驱动 (`dtoverlay=vc4-fkms-v3d`)
- 禁用过度扫描以移除屏幕四周的黑边 (`disable_overscan=1`)

### 常见的配置项

在配置文件中一行只能写一项配置。对于大多数配置项，语法是 `key=value`，但有几个例外。

#### 使用其他内核

如果你想使用其他内核而非 `kernel8.img`，请使用该选项。

参数写法为 `kernel=文件名`，其中 `文件名` 是内核镜像的名称。**内核只能存放在启动分区的根目录下。**

#### Load initrd image

树莓派原生支持初始化内存盘（initrd），如此一来你就可以启动 LVM 或 NFS 上的系统。

该参数的格式和其他参数略微不同，等于号（=）是不能使用的。例如，要将 initrd 加载至固定的地址：

```
initramfs filename 0x80000000
```

或者将其加载在内核之后：

```
initramfs filename followkernel
```

其中 `filename` 是 initrd 的文件名。**和内核一样，initrd 只允许存在于启动分区的根目录中。**

- 请勿在这里使用等号，否则该选项会被忽略。

#### 调整 GPU 大小

参数格式为 `gpumem=X`，其中 `X` 是一个大于 16 的整数。默认值为 64。

#### 启用声音

参数为 `dtparam=sound=on`，其中你可以使用 `on` 或 `off` 来将其启用或禁用。该选项默认启用，并且在默认配置中显式启用。

#### 启用自动加载蓝牙硬件

参数为 `dtparam=krnbt=on`，其中你可以使用 `on` 或 `off` 来将其启用或禁用。该选项默认禁用，但我们依旧在默认配置中显式启用。

树莓派的蓝牙硬件使用 UART 连接，所以在通常情况下很难让它出现在系统中。启用该选项，蓝牙硬件就会自动枚举。

#### 使用其他的内核参数 cmdline.txt

若要使用其他的内核命令行参数，请使用如下参数：

```
cmdline=filename
```

#### 包含自定义配置文件

树莓派提供一个 `include` 参数来合并指定文件名中的配置参数。参数的语法如下：

```
include filename
```

要了解更多参数，请参阅[设备树文档](https://github.com/raspberrypi/firmware/blob/master/boot/overlays/README)以及[config.txt 文档](https://www.raspberrypi.com/documentation/computers/config_txt.html)。

### 内核命令行参数

内核命令行参数存储在 `cmdline.txt` 文件中，但也可以是其他文件名（你可以使用如上所述的参数调整它）。该文件必须只能有一行文字。

除去根文件系统设备参数外，所有的命令行必须至少包含以下参数：

- `rootwait`：等待根文件系统出现。在所有情况下都是必须的，无论你所使用的系统介质。如果移除此项，则内核会崩溃，并告诉你无法找到根文件系统。
- `fsck.repair=yes`：总是在启动时检查文件系统错误。由于树莓派平时是不使用 initrd 的，所以该选项必须启用。

通用问题排除
------

本节内容将带你逐步排除树莓派的相关问题。

#### HDMI 接口无输出

- 移除连接到树莓派上的所有外设、存储，包括 SD 卡。然后将 MicroHDMI 线插入 Type-C 接口旁的 MicroHDMI 口。
- 如果你能看到启动诊断屏幕，则说明树莓派启动正常，请进一步检查操作系统的安装。
- 如果依旧无输出，则请(重新写入 EEPROM 固件)[https://www.raspberrypi.org/documentation/hardware/raspberrypi/booteeprom.md]。

#### 卡在启动诊断屏幕

检查你的系统介质是否已经插入，若介质存在，请确认 `start4.elf` 存在并完整。在另一台机器上挂载系统介质，重新安装 `rpi-firmware-boot` 软件包。

#### 卡在彩虹屏幕

这意味着你的树莓派无法找到内核，或者内核损坏无法启动。请检查 `kernel8.img` 或指定的内核文件存在于启动分区的根目录中。内核必须为未压缩的 `Image`。

请同时检查 HDMI 接口是否接错。请保持 HDMI 连接在 Type-C 接口旁的 MiniHDMI 接口。第二个 HDMI 接口只有在系统启动之后才可用。

#### 屏幕左上角有树莓派的标志，其余黑屏

如果没有光标闪动，说明内核已经崩溃了。

检查 `cmdline.txt`，删除其中的 `quiet` 参数，否则在启动时无法看到内核输出。

如果光标依旧在闪动，说明内核依旧在等待根文件系统出现。检查 `cmdline.txt`，确保 `root=` 参数指向了正确的根分区。

#### 内核崩溃了 (paniked)

内核崩溃的原因有很多，具体请观察屏幕提示。以下是几个例子：

- `VFS: Unable to mount root fs on unknown-block(0,0)`:
  
  内核无法定位到根文件系统。检查 `cmdline.txt`，确保 `root=` 参数指向了正确的根分区，并且 `rootwait` 存在。

- `Attempted to kill init!`
  
  初始化程序意外结束。重新安装操作系统可能解决问题。如果你使用 initrd，尝试去掉 initrd 选项。

#### 性能不佳

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
