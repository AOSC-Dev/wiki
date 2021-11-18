+++
title = "树莓派 4B 配置指南"
description = "Configurate your Raspberry Pi boards"
date = 2021-11-18
[taxonomies]
tags = ["rpi"]
+++


# 配置树莓派

如君所见，树莓派一些底层设置是可以通过 `config.txt` 和 `cmdline.txt` 配置的。

`config.txt` 存放着各种基本配置信息，它控制着各种硬件接口（如 UART, I2C, SPI 等）的行为，以及管理设备树的加载。

`cmdline.txt` 存储启动内核时使用的参数。

为了增强体验，除去启用 64 位内核（`arm_64bit=1`）之外，我们默认开启了以下配置参数：

- 启动时自动加载蓝牙硬件 (`dtparam=krnbt=on`)
- 启用 VideoCore 4 GPU 驱动 (`dtoverlay=vc4-fkms-v3d`)
- 禁用过度扫描以移除屏幕四周的黑边 (`disable_overscan=1`)

## 常见的配置项

在配置文件中一行只能写一项配置。对于大多数配置项，语法是 `key=value`，但有几个例外。

### 使用其他内核

如果你想使用其他内核而非 `kernel8.img`，请使用该选项。

参数写法为 `kernel=文件名`，其中 `文件名` 是内核镜像的名称。**内核只能存放在启动分区的根目录下。**

### 加载 initrd 镜像

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

### 调整 GPU 大小

参数格式为 `gpumem=X`，其中 `X` 是一个大于 16 的整数。默认值为 64。

### 启用声音

参数为 `dtparam=sound=on`，其中你可以使用 `on` 或 `off` 来将其启用或禁用。该选项默认启用，并且在默认配置中显式启用。

### 启用自动加载蓝牙硬件

参数为 `dtparam=krnbt=on`，其中你可以使用 `on` 或 `off` 来将其启用或禁用。该选项默认禁用，但我们依旧在默认配置中显式启用。

树莓派的蓝牙硬件使用 UART 连接，所以在通常情况下很难让它出现在系统中。启用该选项，蓝牙硬件就会自动枚举。

### 使用其他的内核参数 cmdline.txt

若要使用其他的内核命令行参数，请使用如下参数：

```
cmdline=filename
```

### 包含自定义配置文件

树莓派提供一个 `include` 参数来合并指定文件名中的配置参数。参数的语法如下：

```
include filename
```

要了解更多参数，请参阅[设备树文档](https://github.com/raspberrypi/firmware/blob/master/boot/overlays/README)以及[config.txt 文档](https://www.raspberrypi.com/documentation/computers/config_txt.html)。

# 内核命令行参数

内核命令行参数存储在 `cmdline.txt` 文件中，但也可以是其他文件名（你可以使用如上所述的参数调整它）。该文件必须只能有一行文字。

除去根文件系统设备参数外，所有的命令行必须至少包含以下参数：

- `rootwait`：等待根文件系统出现。在所有情况下都是必须的，无论你所使用的系统介质。如果移除此项，则内核会崩溃，并告诉你无法找到根文件系统。
- `fsck.repair=yes`：总是在启动时检查文件系统错误。由于树莓派平时是不使用 initrd 的，所以该选项必须启用。