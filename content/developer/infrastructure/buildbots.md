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
- **LoongArch**: 27001-28000
- **Emulation Hosts**: 28001-29000

Between the relay and the buildbots, [Popub](https://github.com/m13253/popub) is used to forward your SSH port to our relay server. For usage of Popub, please read their README.

Each buildbot is allocated 2 ports; the smaller one is for connection between your machine and the relay, and the larger one is for outside connections to the relay. For example, the AMD64 buildbot _Ry3950X_ is using 12333 and 22333, where _Ry3950X_ forwards its SSH port using `popub-local` to 12333 on the relay, and the relay exposes this port to the outside on port 22333.

Submit your public keys for authentication at the [dev-pubkeys](https://github.com/AOSC-Dev/dev-pubkeys) repository, then view [Buildbots](https://github.com/AOSC-Dev/Buildbots) on GitHub for connection infomation.

If you would like contribute your device to AOSC, please make sure your device have a usable Ciel installation, and contact Kexy Biscuit <kexybiscuit@aosc.io> by [email](mailto:kexybiscuit@aosc.io) or [Telegram](https://t.me/KexyBiscuit), providing:

- Name for your device (optional, just for fun).
- Port number of your choice, correspondent to the device's architecture.
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
| **Yerus** | 22333 | AMD EPYC 7H12 @ 2.6 - 3.3GHz | 1TiB | 173s | _Jiangjin Wang_ | Scratch disk at `/buildroots`, create own Ciel workspace |

## **MIPS** (23001-24000)

| Name | Port | CPU | Memory | Speed |Maintainer | Note |
|-----------|-----------|-----------|-----------|-----------|-----------|-----------|
| **lemote-a1901** | 23869 | Loongson 3A-4000 (R4) @ 1.80GHz (A1901) | 16GiB | 5604s | _Mingcong Bai_ | Scratch disk at `/buildroots`, create own Ciel workspace |
| **Resonance** | 23541 | Loongson 3B-4000 (R4) @ 1.80GHz (LX-2510) | 32GiB | 3748s | _Kexy Biscuit_ | Community crowdsourced; directly connect with `ssh -4p23541 root@home.biscuit.moe`; Scratch disk at `/buildroots`, create own Ciel workspace; repo mirror at `http://localhost/debs/`, BuildKit mirror at `http://localhost/aosc-os/os-amd64/buildkit/` |

## **ARM** (24001-25000)

| Name | Port | CPU | Memory | Speed | Maintainer | Note |
|-----------|-----------|-----------|-----------|-----------|-----------|-----------|
| **Maple** | 24191 | Snapdragon 8cx Gen 3 (8) (4 * Cortex-X1 @ 3.00 GHz + 4 * Cortex-A78 @ 2.40 GHz) | 16GiB | 1098s | _Canarypwn_ | Scratch disk at `/buildroots`, create own Ciel workspace |
| **Zinfandel** | ~~24222~~ | 4 * Firestorm @ 3.2GHz + 4 * Icestorm @ 2.06GHz (Apple M1 chip) | 16GiB | - | _Salted Fish_ | Scratch disk at `/buildroots`, create own Ciel workspace; local mirror: http://pit.aosc.saltedfi.sh/mirror/aosc/debs |
| **Mio** | ~~24242~~ | 4 * Firestorm @ 3.2GHz + 4 * Icestorm @ 2.06GHz (Apple M1 chip) | 16GiB | - | _Mag Mell_ | Scratch disk at `/buildroots`, create own Ciel worksapce; direct access with `ssh -p 8765 root@athome.miraclemilk.me`; local mirror: http://192.168.100.240:2345/debs |
| **kp920** | 24426 | 2 * 48-Core Huawei Kunpeng 920 @ 2.60GHz (Huawei Taishan 2280 v2; 94 cores allocated) | 192GiB (145GiB allocated) | 439s | _Undisclosed_ | Scratch disk at `/buildroots`, create own Ciel worksapce; direct access with `ssh -p 2223 root@kp920.ip4.run` |
| **JellyXavier** | ~~24444~~ | 4 x dual core NVIDIA Carmel CPU clusters @ 2.26GHz (NVIDIA Jetson AGX Xavier Developer Kit) | 16GiB | - |  _Mingcong Bai_ | Scratch disk at `/buildroots`, create own Ciel workspace |
| **JellyPhy** | 24451 | 8-Core Phytium D2000 @ 2.30GHz | 32GiB | 2589s | _Mingcong Bai_ | Scratch disk at `/buildroots`, create own Ciel workspace |
| **eleventh** | 24808 | 8-Core Huawei Kunpeng 920 @ 2.40GHz | 16GiB | 1582s | _Undisclosed_ | Scratch disk at `/buildroots`, create own Ciel worksapce; direct access with `ssh -oProxyJump=aosc-build@hw-hk.innull.com:20022 root@192.168.1.11` |
| **Kirin** | ~~PENDING~~ | HUAWEI Kirin 9006C (8) (1 * Cortex-A77 @ 3.13 GHz + 3 * Cortex-A77 @ 2.54 GHz + 4x Cortex-A55@2.05 GHz) | 8GiB | 1826s | _Rick Liu_ | Scratch disk at `/buildroots`,  create own Ciel workspace, direct access with `ssh root@nkg.rickliu.im -p 8038` |

## **PowerPC** (25001-26000)

| Name | Port | CPU | Memory | Speed | Maintainer | Note |
|-----------|-----------|-----------|-----------|-----------|-----------|-----------|
| **powernv** | ~~25202~~ | IBM POWER9 CPU (4 cores, 16 threads) | 128GiB | 1293s | _Mingcong Bai_ | Scratch disk at `/buildroots`, create own Ciel workspace |

## **RISC-V** (26001-27000)

| Name | Port | CPU | Memory | Speed | Maintainer | Note |
|-----------|-----------|-----------|-----------|-----------|-----------|-----------|
| **SiFarce** | ~~26002~~ | SiFive FU740 @ 1.4GHz (SiFive HiFive Unmatched) | 16GiB | - | _Mingcong Bai_ | Scratch disk at `/buildroots`, create own Ciel workspace |
| **marianne** | 26055 | SiFive FU740 @ 988MHz (SiFive HiFive Unmatched) | 16GiB | 22515s | _Icenowy Zheng_ | Scratch at `/buildroots` is on NBD and needs to be mounted manually by nbd-mount.sh in /root (currently using the `/buildroots` from **lorenz**), behind GFW, a HTTP proxy is available at http://dedue:8118, device sponsored by the PLCT Lab |
| **leonie** | 26056 | SiFive FU740 @ 988MHz (SiFive HiFive Unmatched) | 16GiB | 22612s | _Icenowy Zheng_ | Scratch at `/buildroots` is on NVMe disk (maybe buggy, investigation needed), behind GFW, a HTTP proxy is available at http://dedue:8118, device sponsored by the PLCT Lab |
| **greengoo** | 26666 | T-Head XuanTie C920 @ 2GHz | 96GiB | 1376s | _Icenowy Zheng_ | TBC |

## **LoongArch** (27001-28000)

| Name | Port | CPU | Memory | Speed | Maintainer | Note |
|-----------|-----------|-----------|-----------|-----------|-----------|-----------|
| **Yukoaioi** | ~~27001~~ | Quad core @ 2.50GHz (Loongson 3A5000) | 16GiB | - | _Mag Mell_ | Direct access with `ssh -p 9876 root@athome.miraclemilk.me` |

## **Emulation Hosts** (28001-29000)

| Name | Port | CPU | Memory | Speed | Maintainer | Note |
|-----------|-----------|-----------|-----------|-----------|-----------|-----------|
| **PorterAle** | 28001 | Intel i7-8700T @ 2.40 - 4.00GHz | 16GiB | 996s | _MingcongBai_ | Scratch disk at `/buildroots`, create own Ciel workspace |
| **Taple** | 28002 | AMD Ryzen R5 5500 @ 3.9 - 4.4GHz | 32GiB | 726s | _Lain Yang_ | Scratch disk at `/buildroots`, create own Ciel workspace; local mirror at http://localhost/debs |
| **PorterAlePro** | 28003 | AMD Ryzen 9 3950X @ 3.50 - 4.70GHz | 64GiB | 313s | _Mingcong Bai_ | Scratch disk at `/buildroots`, create own Ciel workspace |
