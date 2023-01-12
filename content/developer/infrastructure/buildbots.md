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
- The parameter "speed" is used to offer a rough idea on the relative performance of each Buildbot. To benchmark, download the LLVM (version 15.0.6) [tarball](https://github.com/llvm/llvm-project/releases/download/llvmorg-15.0.6/llvm-project-15.0.6.src.tar.xz), untar the tarball, configure the source tree by running `mkdir llvm/build && cd llvm/build && cmake -DCMAKE_BUILD_TYPE=Release -GNinja ..`. Collect execution time by running `time ninja`, record the `Real` time, and round up to a second. This test is to be conducted on the device where future package building will be conducted.
- A **Port** with a strikethrough means that the buildbot is not online recently.
{% end %}

---

## **AMD64** (22001 - 23000)

| Name | Port | CPU | Memory | Speed | Maintainer | Note |
|-----------|-----------|-----------|-----------|-----------|---------|-----------|
| **Ry3950X** | 22333 | AMD Ryzen 9 3950X @ 3.50 - 4.70GHz | 64GiB | 389s | _Mingcong Bai_ | Scratch disk at `/buildroots`, create own Ciel workspace; local mirror at http://192.168.88.3/debs |

## **MIPS** (23001-24000)

| Name | Port | CPU | Memory | Speed |Maintainer | Note |
|-----------|-----------|-----------|-----------|-----------|-----------|-----------|
| **lemote-a1901** | 23869 | Loongson 3A-4000 (R4) @ 1.80GHz (A1901) | 16GiB | 8041s | _Mingcong Bai_ | Scratch disk at `/buildroots`, create own Ciel workspace |
| **Resonance** | 23541 | Loongson 3B-4000 (R4) @ 1.80GHz (LX-2510) | 32GiB | 5059s | _Kexy Biscuit_ | Community crowdsourced; Scratch disk at `/buildroots`, create own Ciel workspace; repo mirror at `http://localhost/debs/`, BuildKit mirror at `http://localhost/aosc-os/os-amd64/buildkit/` |

## **ARM** (24001-25000)

| Name | Port | CPU | Memory | Speed | Maintainer | Note |
|-----------|-----------|-----------|-----------|-----------|-----------|-----------|
| **kp920** | 24426 | 2 * 48-Core Huawei Kunpeng 920 @ 2.60GHz (Huawei Taishan 2280 v2; 94 cores allocated) | 192GiB (145GiB allocated) | 450s | _Undisclosed_ | Scratch disk at `/buildroots`, create own Ciel worksapce; direct access with `ssh -p 2223 root@kp920.ip4.run` |
| **JellyXavier** | ~~24444~~ | 4 x dual core NVIDIA Carmel CPU clusters @ 2.26GHz (NVIDIA Jetson AGX Xavier Developer Kit) | 16GiB | - |  _Mingcong Bai_ | Scratch disk at `/buildroots`, create own Ciel workspace |
| **Mio** | ~~24242~~ | 4 * Firestorm @ 3.2GHz + 4 * Icestorm @ 2.06GHz (Apple M1 chip) | 16GiB | - | _Mag Mell_ | Scratch disk at `/buildroots`, create own Ciel worksapce; direct access with `ssh -p 8765 root@athome.miraclemilk.me`; local mirror: http://192.168.100.240:2345/debs |
| **JellyPhy** | 24451 | 8-Core Phytium D2000 @ 2.30GHz | 32GiB | 3599s | _Mingcong Bai_ | Scratch disk at `/buildroots`, create own Ciel workspace; local mirror at http://192.168.88.3/debs |
| **eleventh** | 24808 | 8-Core Huawei Kunpeng 920 @ 2.40GHz | 16GiB | 2176s | _Undisclosed_ | Scratch disk at `/buildroots`, create own Ciel worksapce; direct access with `ssh -oProxyJump=aosc-build@hw-hk.innull.com:20022 root@192.168.1.11` |
| **Zinfandel** | ~~24222~~ | 4 * Firestorm @ 3.2GHz + 4 * Icestorm @ 2.06GHz (Apple M1 chip) | 16GiB | - | _Salted Fish_ | Scratch disk at `/buildroots`, create own Ciel workspace; local mirror: http://pit.aosc.saltedfi.sh/mirror/aosc/debs |
| **Kirin** | ~~PENDING~~ | HUAWEI Kirin 9006C (8) (1 * Cortex-A77 @ 3.13 GHz + 3 * Cortex-A77 @ 2.54 GHz + 4x Cortex-A55@2.05 GHz) | 8GiB | - | _Rick Liu_ | Scratch disk at `/buildroots`,  create own Ciel workspace, direct access with `ssh root@nkg.rickliu.im -p 8038` |
| **Maple** | ~~24191~~ | Snapdragon 8cx Gen 3 (8) (4 * Cortex-X1 @ 3.00 GHz + 4 * Cortex-A78 @ 2.40 GHz) | 16GiB | - | _Canarypwn_ | Scratch disk at `/buildroots`, create own Ciel workspace |

## **PowerPC** (25001-26000)

| Name | Port | CPU | Memory | Speed | Maintainer | Note |
|-----------|-----------|-----------|-----------|-----------|-----------|-----------|
| **powernv** | ~~25202~~ | IBM POWER9 CPU (4 cores, 16 threads) | 128GiB | 1899s | _Mingcong Bai_ | Scratch disk at `/buildroots`, create own Ciel workspace; local mirror at http://192.168.88.3/debs |

## **RISC-V** (26001-27000)

| Name | Port | CPU | Memory | Speed | Maintainer | Note |
|-----------|-----------|-----------|-----------|-----------|-----------|-----------|
| **SiFarce** | ~~26002~~ | SiFive FU740 @ 1.4GHz (SiFive HiFive Unmatched) | 16GiB | - | _Mingcong Bai_ | Scratch disk at `/buildroots`, create own Ciel workspace; local mirror at http://192.168.88.3/debs |
| **marianne** | 26055 | SiFive FU740 @ 988MHz (SiFive HiFive Unmatched) | 16GiB | 35378s | _Icenowy Zheng_ | Scratch at `/buildroots` is on NBD and needs to be mounted manually by nbd-mount.sh in /root (currently using the `/buildroots` from **lorenz**), behind GFW, a HTTP proxy is available at http://dedue:8118, device sponsored by the PLCT Lab |
| **leonie** | 26056 | SiFive FU740 @ 988MHz (SiFive HiFive Unmatched) | 16GiB | 35278s | _Icenowy Zheng_ | Scratch at `/buildroots` is on NVMe disk (maybe buggy, investigation needed), behind GFW, a HTTP proxy is available at http://dedue:8118, device sponsored by the PLCT Lab |

## **LoongArch** (27001-28000)

| Name | Port | CPU | Memory | Speed | Maintainer | Note |
|-----------|-----------|-----------|-----------|-----------|-----------|-----------|
| **Yukoaioi** | ~~27001~~ | Quad core @ 2.50GHz (Loongson 3A5000) | 16GiB | - | _Mag Mell_ | Direct access with `ssh -p 9876 root@athome.miraclemilk.me` |

## **Emulation Hosts** (28001-29000)

| Name | Port | CPU | Memory | Speed | Maintainer | Note |
|-----------|-----------|-----------|-----------|-----------|-----------|-----------|
| **PorterAle** | 28001 | Intel i7-8700T @ 2.40 - 4.00GHz | 16GiB | 1396s | _MingcongBai_ | Scratch disk at `/buildroots`, create own Ciel workspace; local mirror at http://192.168.88.3/debs |
