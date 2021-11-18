+++
title = "Raspberry Pi Homepage"
insert_anchor_links = "right"
[extra]
list_section = true
+++

Here you can learn about how to run AOSC OS for Raspberry Pi devices.

About Raspberry Pi
------

Raspberry Pi is a series of Single Board Computers developed by Raspberry Pi Foundation. Raspberry Pi gained wide community due to its relatively small form factor (the normal version is just size about a credit card), its open ecosystem and adequate performance.

Supported Hardware
------

Here is a list of community supported devices. Click the name to checkout the documentation for a device.

| Name | Type | Platform | Maintenance Status | Maintainer |
| --- | --- | --- | --- | --- |
| [Raspberry Pi 4B](@/aosc-os/devices/raspberrypi/4b.md) | Single Borad Computer | Broadcom BCM2711 | Supported | Cinhi Young |

Board Support Packages repository
------

BSP packages repository is available for all Raspberry Pi devices. Execute following command to add it to your APT source:

```
echo "deb https://repo.aosc.io/debs stable bsp-rpi" | sudo tee /etc/apt/sources.list.d/bsp-rpi.list
sudo apt update
```