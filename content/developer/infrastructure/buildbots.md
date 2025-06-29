+++
title = "Buildbots"
description = "Buildbots that can be used by AOSC developers"
date = 2020-05-04T03:36:10.683Z
[taxonomies]
tags = ["infra"]
[extra]
page_hack = "big-min-table-cell-width"
+++

[zinfandel-crowdsourcing]: /community/crowdsourcing/mac-mini-m1/
[four-new-amd64-buildbots-crowdsourcing]: /community/crowdsourcing/new-amd64-servers/
[yerus-crowdsourcing]: /community/crowdsourcing/epyc-22333-upgrade-2023/
[ybsbny-crowdsourcing]: /crowdsourcing/new-loongson3-3b4000-server/
[resonance-crowdsourcing]: /community/crowdsourcing/loongson3-3b4000/

# General Information

This page contains information about AOSC Buildbots.

AOSC buildbots are all connected to our central relay nodes (`relay.aosc.io` and some others), and are allocated fixed port numbers. To be specific, ports are allocated as per the buildbot's architecture:

- **x86**: 22001 - 23000
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

For most buildbots, scratch disk is at `/buildroots`, create your own Ciel workspace there, and don't forget to clean it up after finishing your work.

## Contributing a Buildbot

If you would like contribute your device to AOSC, please make sure your device has a usable [Ciel 3](https://github.com/AOSC-Dev/ciel-rs) installation, and contact Kexy Biscuit <kexybiscuit@aosc.io> by [Telegram (preferred)](https://t.me/KexyBiscuit) or [email](mailto:kexybiscuit@aosc.io), providing:

- Name for your device;
- Port number of your choice, correspondent to the device's architecture;
- Shell access for Kexy Biscuit for Relay configuration.

# List of Buildbots

{% card(type="info") %}
- `port_number - 10000` is occupied by that machine. See information above.
- The parameter "Speed" presents an approximation on the relative performance of each Buildbot. To benchmark, download and run the [buildbot-benchmark.bash](https://github.com/AOSC-Dev/buildbot-benchmark) script.
- A **Port** with a strikethrough means that the buildbot is not online recently.
{% end %}

---

## **x86** (22001 - 23000)

| Name | Port | CPU | Memory | Speed | Maintainer | Comments |
|-----------|-----------|-----------|-----------|-----------|---------|-----------|
| **Hydaelyn** | 22040 | AMD Ryzen 7 5700X @ 3.4 - 4.6 GHz (8 cores, 16 threads) | 64GiB | 600s | _Cyan_ | [Community crowdsourced][four-new-amd64-buildbots-crowdsourcing]; repo mirror at `http://192.168.24.4/anthon/debs/` |
| **Zodiark** | 22041 | AMD Ryzen 7 5700X @ 3.4 - 4.6 GHz (8 cores, 16 threads) | 64GiB | 622s | _Cyan_ | [Community crowdsourced][four-new-amd64-buildbots-crowdsourcing]; repo mirror at `http://192.168.24.4/anthon/debs/` |
| **Coruscant** | 22042 | AMD Ryzen 7 5700X @ 3.4 - 4.6 GHz (8 cores, 16 threads) | 64GiB | 608s | _Mingcong Bai_ | [Community crowdsourced][four-new-amd64-buildbots-crowdsourcing] |
| **Tatooine** | 22043 | AMD Ryzen 7 5700X @ 3.4 - 4.6 GHz (8 cores, 16 threads) | 64GiB | 618s | _Mingcong Bai_ | [Community crowdsourced][four-new-amd64-buildbots-crowdsourcing] |
| **pika** | 22076 | AMD EPYC 9654 @ 2.3 - 3.7GHz (KVM, 96 cores allocated) | 384GiB | ~~128s~~ | Linux Club of Peking University | |
| **towards-modern-distro** | 22162 | AMD EPYC 9654 @ 2.3 - 3.7GHz (KVM, 96 cores allocated) | 384GiB | ~~124s~~ | Linux Club of Peking University | |
| **Ricks-Ryzen-Box** | 22238 | ~~AMD Ryzen 9 5950X @ 3.4 - 5.2GHz (16 cores, 32 threads)~~<br>Intel Core i7-13700K @ 3.4 - 5.4GHz (16 cores, 24 threads) | 128GiB | ~~352s~~<br>374s | _Ruikai Liu_ | |
| **Yerus** | 22333 | AMD EPYC 7H12 @ 2.6 - 3.3GHz (64 cores, 128 threads) | ~~1TiB~~<br>896GiB | 208s | _Jiangjin Wang_ | [Community crowdsourced][yerus-crowdsourcing] |

## **MIPS** (23001-24000)

| Name | Port | CPU | Memory | Speed | Maintainer | Comments |
|-----------|-----------|-----------|-----------|-----------|-----------|-----------|
| **LoongUnion1** | 23172 | 2 * Loongson-3A R4 (Loongson-3B4000) @ 1.8GHz (8 cores) | 64GiB | 4536s | _Loongson Technology (Wuhan)_ | |
| **LoongUnion2** | 23173 | 2 * Loongson-3A R4 (Loongson-3B4000) @ 1.8GHz (8 cores) | 64GiB | 4944s | _Loongson Technology (Wuhan)_ | |
| **ybsbny** | 23269 | 2 * Loongson-3A R4 (Loongson-3B4000) @ 1.8GHz (8 cores) | 64GiB | 4985s | _Henry Chen_ | [Community crowdsourced][ybsbny-crowdsourcing]; repo mirror at `http://50.50.1.224/debs/` |
| **Misaka23333** | 23333 | 2 * Loongson-3A R4 (Loongson-3B4000) @ 1.8GHz (8 cores) | 32GiB | 4911s | _KatyushaScarlet_ | |
| **Resonance** | 23541 | 2 * Loongson-3A R4 (Loongson-3B4000) @ 1.8GHz (8 cores) | 32GiB | 5026s | _Kexy Biscuit_ | [Community crowdsourced][resonance-crowdsourcing]; direct access with `ssh -4p23541 root@home.biscuit.moe`; repo mirror at `http://localhost/debs/`, BuildKit mirror at `http://localhost/aosc-os/os-loongson3/buildkit/` |

## **ARM** (24001-25000)

| Name | Port | CPU | Memory | Speed | Maintainer | Comments |
|-----------|-----------|-----------|-----------|-----------|-----------|-----------|
| **Catfish** | 24114 | HUAWEI Kunpeng 920 @ 2.6GHz (64 cores) | 256GiB | 368s | _Undisclosed_ | Local repository mirror at `http://localhost/debs` |
| **Asta** | 24151 | Apple M1, 4 * Firestorm @ 3.2GHz + 4 * Icestorm @ 2.06GHz (8 cores) | 8GiB | 823s | _Mingcong Bai_ | |
| **Zinfandel** | 24222 | Apple M1, 4 * Firestorm @ 3.2GHz + 4 * Icestorm @ 2.06GHz (8 cores) | 16GiB | 816s | [Community crowdsourced][zinfandel-crowdsourcing]; _Mingcong Bai_ | |
| **Mio** | 24242 | Apple M1, 4 * Firestorm @ 3.2GHz + 4 * Icestorm @ 2.06GHz (8 cores) | 16GiB | 815s | _Cyan_ | Local mirror at `http://192.168.24.4/anthon/debs` |
| **Dapen** | 24410 | HUAWEI Kunpeng 920 3211K @ 2.6GHz (24 cores) | 16GiB | 738s | _Mingcong Bai_ | |
| **kp920** | 24426 | HUAWEI Kunpeng 920 @ 2.6GHz (KVM, 96 cores allocated) | 192GiB (160GiB allocated) | 484s | _Undisclosed_ | Direct access with `ssh -4p2223 root@kp920.ip4.run` |
| **ailuropoda** | 24612 | HUAWEI Kunpeng 920 @ 2.0GHz (KVM, 16 cores allocated) | 64GiB | 908s | _神楽坂早苗️_ | |
| **eleventh** | 24808 | HUAWEI Kunpeng 920 @ 2.4GHz (12 cores) | 24GiB | 1123s | _Undisclosed_ | Direct access with `ssh -oProxyJump=aosc-build@hw-hk.innull.com:20022 root@192.168.1.11` |
| **ries** | 24691 | ARM Neoverse N2 @ 3.0GHz (128 cores) | 64GiB | 316s | _Undisclosed_ |

## **PowerPC** (25001-26000)

| Name | Port | CPU | Memory | Speed | Maintainer | Comments |
|-----------|-----------|-----------|-----------|-----------|-----------|-----------|
| **PowerNV** | 25202 | IBM POWER9 @ 3.2 - 3.8GHz (4 cores, 16 threads) | 128GiB | 1561s | _Jiangjin Wang_ | |
| **power8** | 25888 | IBM POWER8NVL @ 2.4 - 4.0GHz (32 cores, 128 threads) | 128GiB | 476s | _Undisclosed_ | |

## **RISC-V** (26001-27000)

| Name | Port | CPU | Memory | Speed | Maintainer | Comments |
|-----------|-----------|-----------|-----------|-----------|-----------|-----------|
| **ChubbyHydra** | 26128 | T-Head XuanTie C920 @ 2GHz (128 cores) | 256GiB | 2076s | _Undisclosed_ | |
| **Estelle** | 26397 | T-Head XuanTie C920 @ 2GHz (64 cores) | 64GiB | 2349s | _Undisclosed_ | |
| **GreenGoo** | 26666 | T-Head XuanTie C920 @ 2GHz (63 cores) | 96GiB | 2013s | _Icenowy Zheng_ | Local repository mirror is at `http://dorothea.fodlan.icenowy.me/anthon/debs` |
| **MagmaCube** | 26999 | T-Head XuanTie C920 @ 2GHz (64 cores) | 128GiB | 1956s | _Icenowy Zheng_ | Local repository mirror is at `http://dorothea.fodlan.icenowy.me/anthon/debs` |

## **LoongArch** (27001-28000)

| Name | Port | CPU | Memory | Speed | Maintainer | Comments |
|-----------|-----------|-----------|-----------|-----------|-----------|-----------|
| **Yukoaioi** | 27001 | Loongson 3C6000/S @ 2.50GHz (16 cores, 32 threads) | 128GiB | 770s | _Lain Yang_ |  |
| **Panulirus** | 27118 | Loongson 3C5000 @ 2.2GHz (16 cores) | 128GiB | 1518s | _Loongson Technology (Wuhan)_ | |
| **Apocalypse** | 27221 | Loongson 3C5000 @ 2.2GHz (16 cores) | 64GiB | 1339s | _Loongson Technology (Wuhan)_ | |
| **Yggdrasil** | 27234 | Loongson 3C6000 @ 2.2GHz (16 cores, 32 threads) | 96GiB | 828s | _darkyzhou_ | |
| **loongcraft** | 27777 | Loongson 3C6000 @ 2.2GHz (16 cores, 32 threads) | 128GiB | 764s | _Loongson Technology (Wuhan)_ | |
| **Stomatopoda** | 27863 | Loongson 3C5000 @ 2.2GHz (16 cores) | 128GiB | 1365s | _Loongson Technology (Wuhan)_ | Direct access with `ssh -p2222 root@211.137.78.121` |
| **Cambarus** | 27888 | Loongson 3C5000 @ 2.2GHz (16 cores) | 128GiB | 1442s | _Jiangjin Wang_ | |
| **YuanBao** | 27999 | 2x Loongson 3C6000/D @ 2.1GHz (64 cores) | 512GiB | 358s | _Loongson Technology (Wuhan)_ | |

## **Emulation Hosts** (28001-29000)

| Name | Port | CPU | Memory | Speed | Maintainer | Comments |
|-----------|-----------|-----------|-----------|-----------|-----------|-----------|
| **Taple** | 28002 | Intel Xeon E5-2698B v3 (16 cores, 32 threads) | 96GiB | ~~594s~~ | _Lain Yang_ | AMD64 |
| **PorterAlePro** | 28003 | AMD Ryzen 9 3950X @ 3.5 - 4.7GHz (16 cores, 32 threads) | 64GiB | ~~338s~~ | _Mingcong Bai_ | AMD64 |
| **AmpereA110Raptor1** | 28180 | Ampere eMAG 8180 @ 2.8 - 3.3GHz (32 cores) | 128GiB | 1083s | _Kexy Biscuit_ | Armv8-A AArch64, implementation supporting AArch32, repo mirror at `http://10.55.0.146/debs/` |

# List of archived buildbots

Please note that the following is not an exhaustive list.

| Name | Port | CPU | Memory | Speed | Maintainer | Comments |
|-----------|-----------|-----------|-----------|-----------|-----------|-----------|
| **Sandman-BuildIt** | 22044 | Intel Core i7-12700 @ 1.6 - 4.9 GHz (8P+4E cores, 20 threads) | 128GiB | 493s | _Cyan_ | |
| **JellyShrimp** | ~~23869~~ | Loongson 3A-4000 (R4) @ 1.80GHz (A1901) | 16GiB | 5604s | _Mingcong Bai_ | |
| **Macrobrachium** | ~~23999~~ | 2 * Loongson-3A R4 (Loongson-3B4000) @ 1.8GHz (8 cores) | 32GiB | 4353s | _Mingcong Bai_ | Unstable, BuildIt! disabled. |
| **Maple** | ~~24191~~ | Snapdragon 8cx Gen 3 (8) (4 * Cortex-X1 @ 3.00GHz + 4 * Cortex-A78 @ 2.40GHz) | 16GiB | 1098s | _Canarypwn_ | |
| **JellyXavier** | ~~24444~~ | 4 x dual core NVIDIA Carmel CPU clusters @ 2.26GHz (NVIDIA Jetson AGX Xavier Developer Kit) | 16GiB | - |  _Mingcong Bai_ | |
| **JellyPhy** | ~~24451~~ | 8-Core Phytium D2000 @ 2.30GHz | 32GiB | 2589s | _Mingcong Bai_ | |
| **Trionychidae** | ~~24514~~ | 64-Core Phytium FT-2000+/64 @ 2.2GHz | 128GiB | 2263s | _Undisclosed_ | Local repository mirror at `http://100.65.1.101/debs` |
| **Kirin** | ~~PENDING~~ | HUAWEI Kirin 9006C (8) (1 * Cortex-A77 @ 3.13GHz + 3 * Cortex-A77 @ 2.54GHz + 4x Cortex-A55@2.05GHz) | 8GiB | 1826s | _Rick Liu_ | Direct access with `ssh -p8038 root@nkg.rickliu.im` |
| **SiFarce** | ~~26002~~ | SiFive FU740 @ 1.4GHz (SiFive HiFive Unmatched) | 16GiB | - | _Mingcong Bai_ | |
| **marianne** | ~~26055~~ | SiFive FU740 @ 988MHz (SiFive HiFive Unmatched) | 16GiB | 22515s | _Icenowy Zheng_ | Scratch needs to be mounted manually by nbd-mount.sh in /root (currently using the scratch disk from **lorenz**); behind GFW, a HTTP proxy is available at http://dedue:8118, device sponsored by the PLCT Lab |
| **leonie** | ~~26056~~ | SiFive FU740 @ 988MHz (SiFive HiFive Unmatched) | 16GiB | 22612s | _Icenowy Zheng_ | Scratch is on NVMe disk ,maybe buggy, investigation needed; behind GFW, a HTTP proxy is available at http://dedue:8118, device sponsored by the PLCT Lab |
| **Chrysalis** | ~~27224~~ | Loongson 3A6000-HV @ 2.5GHz (4 cores, 8 threads) | 16GiB | 2461s | _Mingcong Bai_ | |
| **loong13** | ~~27282~~ | Loongson 3A5000-HV @ 2.5GHz (4 cores) | 16GiB | 3977s | _Henry Chen_ | |
| **dragonfly** | ~~27514~~ | Loongson 3C5000 @ 2.5GHz (16 cores, overclocked) | 128GiB | 1371s | _Xinmudotmoe_ | |
| **viperdesign** | ~~27688~~ | Loongson 3A6000-HV @ 2.5GHz (4 cores, 8 threads) | 32GiB | 2286s | _Viperdesign_ | |
| **PorterAle** | ~~28001~~ | Intel i7-8700T @ 2.40 - 4.00GHz | 16GiB | 996s | _MingcongBai_ | |
| **mieps** | ~~28004~~ | Intel Xeon W-1250P @ 4.1 - 4.8GHz (6 cores, 12 threads) | 32GiB | 793s | _Undisclosed_ | |

# Maintainer Notes

## Popub

Between the relay and the buildbots, [Popub](https://github.com/Jamesits/popub) is used to forward your SSH port to our relay server. For usage of Popub, please read their README.

Each buildbot is allocated 2 ports; the smaller one is for connection between your machine and the relay, and the larger one is for outside connections to the relay. For example, the AMD64 buildbot _Yerus_ is using 12333 and 22333, where _Yerus_ forwards its SSH port using `popub-local` to 12333 on the relay, and the relay exposes this port to the outside on port 22333.
