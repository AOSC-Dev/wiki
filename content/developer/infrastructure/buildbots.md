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

AOSC buildbots are all connected to our central relay nodes (`relay.aosc.io` and some others), and are allocated fixed port numbers. To be specific, ports are allocated as per the buildbot's architecture:

- **AMD64**: 22001 - 23000
- **MIPS**: 23001-24000
- **ARM**: 24001-25000
- **PowerPC**: 25001-26000
- **RISC-V**: 26001-27000
- **LoongArch**: 27001-28000
- **Emulation hosts**: 28001-29000

## Before You Start

1. You are *not* to use these community Buildbots for personal purposes, *nor* to resell them.
2. *Do not* alter terminal sessions or files in others' workspaces.
3. You *must* inform contributors and infrastructure administrators regarding any changes to the host system, network configuration, or hardware.

## Signing In

Submit your public keys for authentication at the [dev-pubkeys](https://github.com/AOSC-Dev/dev-pubkeys) repository, then view [Buildbots](https://github.com/AOSC-Dev/Buildbots) on GitHub for connection infomation.

For most buildbots, scratch disk is at `/buildroots`, create your own Ciel workspace there, and don't forget to clean it up after finishing your work, storage space isn't infinite unfortunately.

## Contributing a Buildbot

If you would like contribute your device to AOSC, please make sure your device has a usable [Ciel 3](https://github.com/AOSC-Dev/ciel-rs) installation, and contact Kexy Biscuit <kexybiscuit@aosc.io> by [Telegram (preferred)](https://t.me/KexyBiscuit) or [email](mailto:kexybiscuit@aosc.io), providing:

- Name for your device;
- Port number of your choice, correspondent to the device's architecture;
- Shell access for Kexy Biscuit for Relay configuration.

# List of Buildbots

{% card(type="info") %}
- `port_number - 10000` is occupied by that machine. See information above.
- The parameter "Speed" presents an approximation on the relative performance of each Buildbot. To benchmark, download and run the [buildbot-benchmark.bash](https://github.com/AOSC-Dev/scriptlets/tree/master/buildbot-benchmark) script.
- A **Port** with a strikethrough means that the buildbot is not online recently.
{% end %}

---

## **AMD64** (22001 - 23000)

| Name | Port | CPU | Memory | Speed | Maintainer | Note |
|-----------|-----------|-----------|-----------|-----------|---------|-----------|
| **Yerus** | 22333 | AMD EPYC 7H12 @ 2.6 - 3.3GHz | 1TiB | 173s | _Jiangjin Wang_ | |

## **MIPS** (23001-24000)

| Name | Port | CPU | Memory | Speed |Maintainer | Note |
|-----------|-----------|-----------|-----------|-----------|-----------|-----------|
| **Resonance** | 23541 | Loongson 3B-4000 (R4) @ 1.80GHz (LX-2510) | 32GiB | 3748s | _Kexy Biscuit_ | Community crowdsourced; direct access with `ssh -4p23541 root@home.biscuit.moe`; repo mirror at `http://localhost/debs/`, BuildKit mirror at `http://localhost/aosc-os/os-amd64/buildkit/` |

## **ARM** (24001-25000)

| Name | Port | CPU | Memory | Speed | Maintainer | Note |
|-----------|-----------|-----------|-----------|-----------|-----------|-----------|
| **kp920** | 24426 | 2 * 48-Core Huawei Kunpeng 920 @ 2.60GHz (Huawei Taishan 2280 v2; 94 cores allocated) | 192GiB (145GiB allocated) | 439s | _Undisclosed_ | Direct access with `ssh -4p2223 root@kp920.ip4.run` |
| **eleventh** | 24808 | 8-Core Huawei Kunpeng 920 @ 2.40GHz | 16GiB | 1582s | _Undisclosed_ | Direct access with `ssh -oProxyJump=aosc-build@hw-hk.innull.com:20022 root@192.168.1.11` |

## **PowerPC** (25001-26000)

| Name | Port | CPU | Memory | Speed | Maintainer | Note |
|-----------|-----------|-----------|-----------|-----------|-----------|-----------|
| **PowerNV** | 25202 | IBM POWER9 CPU (3 cores, 12 threads) | 36GiB | 1293s | _Mingcong Bai_ | |

## **RISC-V** (26001-27000)

| Name | Port | CPU | Memory | Speed | Maintainer | Note |
|-----------|-----------|-----------|-----------|-----------|-----------|-----------|
| **GreenGoo** | 26666 | T-Head XuanTie C920 @ 2GHz | 96GiB | 1376s | _Icenowy Zheng_ | TBC |

## **LoongArch** (27001-28000)

| Name | Port | CPU | Memory | Speed | Maintainer | Note |
|-----------|-----------|-----------|-----------|-----------|-----------|-----------|
| **Stomatopoda** | 27863 | 16x LA464 cores @ 2.20GHz (Loongson 3C5000) | 32GiB | 1376s (with LLVM 16.0.4) | _Loongson Technology (Wuhan)_ | Direct access with `ssh -p2222 root@211.137.78.121` |

## **Emulation Hosts** (28001-29000)

| Name | Port | CPU | Memory | Speed | Maintainer | Note |
|-----------|-----------|-----------|-----------|-----------|-----------|-----------|
| **Taple** | 28002 | AMD Ryzen R5 5500 @ 3.9 - 4.4GHz | 32GiB | 726s | _Lain Yang_ | Local mirror at http://localhost/debs |
| **PorterAlePro** | 28003 | AMD Ryzen 9 3950X @ 3.50 - 4.70GHz | 64GiB | 313s | _Mingcong Bai_ | |

# List of archived buildbots

Please note that the following is not an exhaustive list.

| Name | Port | CPU | Memory | Speed | Maintainer | Note |
|-----------|-----------|-----------|-----------|-----------|-----------|-----------|
| **JellyShrimp** | ~23869~ | Loongson 3A-4000 (R4) @ 1.80GHz (A1901) | 16GiB | 5604s | _Mingcong Bai_ | |
| **Maple** | ~~24191~~ | Snapdragon 8cx Gen 3 (8) (4 * Cortex-X1 @ 3.00GHz + 4 * Cortex-A78 @ 2.40GHz) | 16GiB | 1098s | _Canarypwn_ | |
| **Zinfandel** | ~~24222~~ | 4 * Firestorm @ 3.2GHz + 4 * Icestorm @ 2.06GHz (Apple M1 chip) | 16GiB | - | _Salted Fish_ | Local mirror: http://pit.aosc.saltedfi.sh/mirror/aosc/debs |
| **Mio** | ~~24242~~ | 4 * Firestorm @ 3.2GHz + 4 * Icestorm @ 2.06GHz (Apple M1 chip) | 16GiB | - | _Mag Mell_ | Direct access with `ssh -p8765 root@athome.miraclemilk.me`; local mirror: http://192.168.100.240:2345/debs |
| **JellyXavier** | ~~24444~~ | 4 x dual core NVIDIA Carmel CPU clusters @ 2.26GHz (NVIDIA Jetson AGX Xavier Developer Kit) | 16GiB | - |  _Mingcong Bai_ | |
| **JellyPhy** | ~~24451~~ | 8-Core Phytium D2000 @ 2.30GHz | 32GiB | 2589s | _Mingcong Bai_ | |
| **Kirin** | ~~PENDING~~ | HUAWEI Kirin 9006C (8) (1 * Cortex-A77 @ 3.13GHz + 3 * Cortex-A77 @ 2.54GHz + 4x Cortex-A55@2.05GHz) | 8GiB | 1826s | _Rick Liu_ | Direct access with `ssh -p8038 root@nkg.rickliu.im` |
| **SiFarce** | ~~26002~~ | SiFive FU740 @ 1.4GHz (SiFive HiFive Unmatched) | 16GiB | - | _Mingcong Bai_ | |
| **marianne** | ~~26055~~ | SiFive FU740 @ 988MHz (SiFive HiFive Unmatched) | 16GiB | 22515s | _Icenowy Zheng_ | Scratch needs to be mounted manually by nbd-mount.sh in /root (currently using the scratch disk from **lorenz**); behind GFW, a HTTP proxy is available at http://dedue:8118, device sponsored by the PLCT Lab |
| **leonie** | ~~26056~~ | SiFive FU740 @ 988MHz (SiFive HiFive Unmatched) | 16GiB | 22612s | _Icenowy Zheng_ | Scratch is on NVMe disk ,maybe buggy, investigation needed; behind GFW, a HTTP proxy is available at http://dedue:8118, device sponsored by the PLCT Lab |
| **Yukoaioi** | ~~27001~~ | Quad core @ 2.50GHz (Loongson 3A5000) | 16GiB | - | _Mag Mell_ | Direct access with `ssh -p9876 root@athome.miraclemilk.me` |
| **PorterAle** | ~~28001~~ | Intel i7-8700T @ 2.40 - 4.00GHz | 16GiB | 996s | _MingcongBai_ | |

# Maintainer Notes

## Popub

Between the relay and the buildbots, [Popub](https://github.com/m13253/popub) is used to forward your SSH port to our relay server. For usage of Popub, please read their README.

Each buildbot is allocated 2 ports; the smaller one is for connection between your machine and the relay, and the larger one is for outside connections to the relay. For example, the AMD64 buildbot _Yerus_ is using 12333 and 22333, where _Yerus_ forwards its SSH port using `popub-local` to 12333 on the relay, and the relay exposes this port to the outside on port 22333.
