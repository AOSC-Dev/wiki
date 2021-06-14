+++
title = "Buildbots"
description = "Buildbots that can be used by AOSC developers"
date = 2020-05-04T03:36:10.683Z
[taxonomies]
tags = ["infra"]
[extra]
page_hack = "big-min-table-cell-width"
+++

# General Information

This page contains information about AOSC Buildbots.

AOSC buildbots are all connected to our central relay node (`relay.aosc.io`), and are allocated fixed port numbers. To be specific, ports are allocated as per the buildbot's architecture:

- **AMD64**: 22001 - 23000
- **MIPS**: 23001-24000
- **ARM**: 24001-25000
- **PowerPC**: 25001-26000
- **RISC-V**: 26001-27000

Between the relay and the buildbots, [Popub](https://github.com/m13253/popub) is used to forward your SSH port to our relay server. For usage of Popub, please read their README.

Each buildbot is allocated 2 ports; the smaller one is for connection between your machine and the relay, and the larger one is for outside connections to the relay. For example, the AMD64 buildbot _Ry1800X_ is using 12333 and 22333, where _Ry1800X_ forwards its SSH port using `popub-local` to 12333 on the relay, and the relay exposes this port to the outside on port 22333.

You can log into these buildbots over SSH (by using `ssh -p <port_number> <username>@relay.aosc.io`). Contact buildbot owners for usernames, and submit your public keys for authentication at the [dev-pubkeys](https://github.com/AOSC-Dev/dev-pubkeys) repository.

If you would like contribute your device to AOSC, please make sure your device have an usable Ciel installation, and contact Kexy Biscuit [<kexybiscuit@aosc.io>](mailto:kexybiscuit@aosc.io), providing:

- Name for your device (optional, just for fun).
- Port number of your choice, correspondent to the device's architecture.
- SSH access for Kexy Biscuit for Relay configuration.

# List of Buildbots

{% card(type="info") %}
- `port_number - 10000` is occupied by that machine. See information above.
- The parameter speed is defined as the total execution time for `make`, after `mkdir build && cd build && ../configure --prefix=/usr` within the unzipped source tree of GNU C Library (version 2.31)  - this will be the command `time make`, collect the `Real` time, and round up to a second. This test is to be conducted on the main storage/scratch disk/build partition/...
- A **Port** with a strikethrough means that the buildbot is not online recently.
{% end %}

---

## **AMD64** (22001 - 23000)

| Name | Port | CPU | Memory | Speed | Maintainer | Note |
|-----------|-----------|-----------|-----------|-----------|---------|-----------|
| **Curium** | ~~22003~~ | Intel i5-9600K (6) @ 4.60GHz | 32GiB | 99s (`-j7`, 2.32) | _Staph Zhang_ | Owned by Leo Shen. Read ~aosc/README.md for usage info. |
| **gbx-ry3700** | ~~22182~~ | AMD Ryzen 7 3700X (16) @ 3.600GHz | 1.5GiB~32GiB | ? | _Dingyuan Wang_ | ~3T ceph storage at `/media/shared`, `/` is on SSD |
| **Ry3950X** | 22333 | AMD Ryzen 9 3950X @ 3.50 - 4.70GHz | 64GiB | 40s (`-j33`) | _Mingcong Bai_ | Scratch disk at `/buildroots`, create own Ciel workspace |
| **vmaoscagent001** | ~~22658~~ | 2 * Intel Xeon Processor E5-2660 v2 @ 2.20 - 3.00GHz | 64GiB | 82s (`-j41`) | _Kexy Biscuit_ | `/buildroots/` available on SSD, repo mirror: `http://localhost/debs/`, BuildKit mirror: `http://localhost/aosc-os/os-amd64/buildkit/`, users in Asia-Pacific should connect with `vmaoscagent001.biscuit.moe:22658` |
| **EPSON-PC** | ~~22718~~ | VM on i7-3770, 2vCPU | 4GiB | 502s (`-j2`) | _Zamir Sun_ | Available time: 8:00 - 21:30 UTC+8, use zirouter.tpddns.cn:22718  for direct connection  |

## **MIPS** (23001-24000)

| Name | Port | CPU | Memory | Speed |Maintainer | Note |
|-----------|-----------|-----------|-----------|-----------|-----------|-----------|
| **lemote-a1511** | ~~23072~~ | Loongson 3B-1500G (R2, Hexa) @ 1.2GHz (A1511) | 8GiB | 1333s (`-j7`, 2.27) | _Junde Yhi_ | Hosted by the Network Coding Lab at [CUHK(SZ)](https://www.cuhk.edu.cn/) sponsored by _Xiaoxing Ye_; owned by _Mingcong Bai_ |
| **lemote-a1601** | ~~23141~~ | Loongson 3A-2000C (R2) @ 1GHz (A1601) | 8GiB | 801s (`-j5`, 2.27) | _Junde Yhi_ | |
| **lemote-8089d** | ~~23210~~ | Loongson 2F (STLS2F02-1) @ 1GHz (Lemote Yeeloong 8089D) | 1GiB | 9077s (`-j1`, 2.27) <!-- 10038s (`-j2`) --> | _Junde Yhi_ | For testing purposes only, not 24x7 online (slow, hot and noisy); owned by _Mingcong Bai_ |
| **lpi-2** | ~~23456~~ | Loongson 2K-1000 @ 1GHz (Loongson Pi 2) | 2GiB | 3850s (`-j3`) | _Junde Yhi_ | Sponsored by [windows1089](http://www.openloongson.org/?4655) |
| **lemote-a1901** | 23869 | Loongson 3A-4000 (R4) @ 1.8GHz (A1901) | 16GiB | 335s (`-j5`, 2.31) | _Mingcong Bai_ | Scratch disk at `/buildroots`, create own Ciel workspace |

## **ARM** (24001-25000)

| Name | Port | CPU | Memory | Speed |Maintainer | Note |
|-----------|-----------|-----------|-----------|-----------|-----------|-----------|
| **ice-rockpro64** | ~~24064~~ | Quad Core ARM Cortex-A53 @ 1.416GHz + Dual Core ARM Cortex-A72 @ 1.8GHz (Rockchip RK3399, RockPro64) | 4GiB | 565s (`-j7`) | _Icenowy Zheng_ | Scratch disk at `/mnt/sda3`; users in Asia could try `ssh -p 24064 root@aosc-relay-asiapacific.edge.biscuit.moe` |
| **Tegra** | ~~24096~~ | Quad Core ARM Cortex-A57 @ 1.73GHz (NVIDIA Jetson TX1 Developer Kit) | 4GiB | 446s (`-j5`, 2.27) |  _Mingcong Bai_ | Device dead, RIP |
| **Pine64** | ~~24399~~ | Quad Core ARM Cortex-A53 @ 1.2GHz (Allwinner A64, Pine64 Plus) | 2GiB | 1351s (`-j5`, 2.27) |  _Mingcong Bai_ | Retired |
| **kp920** | 24426 | 2 * 48-Core Huawei Kunpeng 920 @ 2.6GHz (Huawei Taishan 2280 v2; 94 cores allocated) | 192GiB (145GiB allocated) | 71s (`-j95`) | _Undisclosed_ | Scratch disk at `/buildroots`, create own Ciel worksapce; direct access with `ssh -p 2223 root@kp920.ip4.run` |
| **JellyXavier** | ~~24444~~ | 4 x dual core NVIDIA Carmel CPU clusters @ 2.26GHz (NVIDIA Jetson AGX Xavier Developer Kit) | 16GiB | 232s (`-j9`) |  _Mingcong Bai_ | Scratch disk at `/buildroots`, create own Ciel workspace |
| **YetAnotherPine64** | ~~24514~~ | Quad Core ARM Cortex-A53 @ 1.2GHz (Allwinner A64, Pine64 Plus) | 2GiB | 1365s (`-j5`, 2.27) | _Salted Fish_| (Down) Local mirror located at `/dev/sda4` |
| **Mio** | 24242 | 8-Core Apple Silicon M1 @ 2.064GHz | 16GiB | 71s (`-j8`) | _Xiaoxing Ye_ | Scratch disk at `/buildroots`, create own Ciel worksapce; direct access with `ssh -p 8765 root@athome.utopiosphere.net`; local mirror: http://192.168.100.232:2345/debs |

## **PowerPC** (25001-26000)

| Name | Port | CPU | Memory | Speed | Maintainer | Note |
|-----------|-----------|-----------|-----------|-----------|-----------|-----------|
| **G5-PPC64BE** | ~~25120~~ | IBM PowerPC 970MP @ 2.5GHz (PowerMac G5, Quad, 2005) | 8GiB | 566s (`-j5`, 2.27) | _Mingcong Bai_ | Scratch disk at `/buildroots`, create own Ciel workspace |
| **G5-PPC32BE** | ~~25121~~ | IBM PowerPC 970MP @ 2.5GHz (PowerMac G5, Quad, 2005) | 16GiB | 553s (`-j5`, 2.27) | _Mingcong Bai_ | Temporarily down to conserve energy |
| **powernv** | 25202 | IBM POWER9 CPU (4-Core) CP9M01 (3 cores, 12 threads allocated) | 24GiB | 178s (`-j13`) | _Mingcong Bai_ | PowerKVM based |

## **RISC-V** (26001-27000)

| Name | Port | CPU | Memory | Speed | Maintainer | Note |
|-----------|-----------|-----------|-----------|-----------|-----------|-----------|
| **ice-hfu** | ~~26001~~ | SiFive FU540 @ 1.5GHz (SiFive HiFive Unleashed) | 8GiB | 2000s (`-j5`, 2.27) | _Icenowy Zheng_ | On demand |
