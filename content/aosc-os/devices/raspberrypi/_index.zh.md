+++
title = "Raspberry Pi 设备主页"
insert_anchor_links = "right"
[extra]
list_section = false
+++

在这里可以获取有关在树莓派上运行 AOSC OS 的一些帮助，以及一些与发行版无关的、可能对用户有帮助的信息。

# 关于树莓派

树莓派（Raspberry Pi）是树莓派基金会研发的单板计算机系列。由于它相对较小的大小（普通版只有一张信用卡大小）、开放的生态以及合适的性能，颇受 DIY 爱好者和创客团体青睐。

# 受支持的设备

以下是社区受支持的设备。点击设备名可以查看针对该设备的指南。

| 设备名称 | 设备类型 | 设备平台 | 维护情况 | 维护者 |
| --- | --- | --- | --- | --- |
| [树莓派 4B](@/aosc-os/devices/raspberrypi/4b/_index.zh.md) | 单板计算机 | 博通 BCM2711 | 受支持 | Cinhi Young |


# 单板支持包（BSP）仓库

树莓派的 BSP 仓库可能适用于所有树莓派硬件。执行如下命令以将该仓库添加至 APT 软件源：

```
echo "deb https://repo.aosc.io/debs stable bsp-rpi" | sudo tee /etc/apt/sources.list.d/bsp-rpi.list
sudo apt update
```
