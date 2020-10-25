+++
title = "Exceptions to the Update Cycles"
description = "A Suggested List of Packages to be Updated Immediately and Made Available in Stable Repositories"
date = 2020-05-04T03:35:43.402Z
[taxonomies]
tags = ["dev-sys"]
+++

> **Attention: This guideline has been deprecated from October 25, 2020.** We've switched to a newly-proposed [Topic-Based Maintenance Guidelines](@/developer/packaging/topic-based-maintenance-guideline.md); please refer to that document instead.

# Rationale and Definition

Since the monthly update cycle was introduced to AOSC OS in July of 2017 (and later, seasonal update cycles introduced since July 2018), packages which represents feature, and non-bugfix/security updates should first have their build configurations pushed to the [testing-proposed](https://github.com/AOSC-Dev/aosc-os-abbs/tree/testing-proposed) of the [ABBS Tree](https://github.com/AOSC-Dev/aosc-os-abbs), uploaded to the [testing-proposed](https://repo.aosc.io/debs/pool/testing-proposed/) repositories - and made available in the stable repository at the end of each seasonal cycle after testing.

However, given the bugfix/security update may rely - and limited to - on backporting of patches, there are some other packages which could be...

- **Category 1:** Hard (or impossible in case of binary packages) to backport security/bugfix patches to, and frequently updated in mixture of feature and security updates. This category is most well represented by (larger) Web browsers, for example, Firefox and Chromium.
- **Category 2:** Heavily relied on frequent updates to remain functional. This category is most well represented by tools which reads online APIs/page contents for its basic functionality, for example, youtube-dl.
- **Category 3:** Essential to basic Internet access in certain regions. This category is most well represented by network utilities which have to work around new blockades and constraints, for example, shadowsocks.
- **Category 4:** AOSC OS distribution-specific development toolkits, which should be the newest at all times.

A list of packages exempt from branch rules are shown below.

# Exception List

The list below is a **comprehensive** list of packages which could be considered as a part of the exception list - meaning that these packages' build configurations could be pushed to the [stable-proposed](https://github.com/AOSC-Dev/aosc-os-abbs/tree/stable-proposed) branch, as a part of the effort to address bugs, usability issues, and security vulnerabilities. These updates are then made available in the [stable](https://repo.aosc.io/debs/pool/stable) repositories after testing - regardless of the version changes, and whether new features are to be introduced.


| Project Name | Package Name | Category |
| ------------------ | -------------------- | ------------ |
| Brave Browser | `brave-browser` | 1 |
| Chromium | `chromium` | 1 |
| Google Chrome | `google-chrome` | 1 |
| Intel Processor Microcode Data File | `intel-ucode` | 1 |
| Mozilla Firefox  | `firefox` | 1 |
| Min Browser | `min` | 1 |
| NetSurf | `netsurf` | 1 |
| OpenJDK | `openjdk` | 1 |
| Opera | `opera` | 1 |
| Pale Moon | `palemoon` | 1 |
| qutebrowser | `qutebrowser` | 1 |
| SeaMonkey | `seamonkey` | 1 |
| Thunderbird | `thunderbird` | 1 |
| Vivaldi | `vivaldi` | 1 |
| Flash Player PepperAPI Plugin | `flashplayer-ppapi` | 1 |
| Arch Linux Keyring | `archlinux-keyring` | 2 |
| Baidu Cloud Client | `bcloud` | 2 |
| BiliDan | `bilidan` | 2 |
| Citra  | `citra`  | 2 |
| ClamAV | `clamav` | 2 |
| Hardware ID Data | `hwdata` | 2 |
| Linux Kernels | `linux-kernel`, `linux-kernel-lts` | 2 |
| NVIDIA Proprietary Unix Drivers | `nvidia`, `nvidia+340`, `nvidia+390` | 2 |
| PyTZ | `pytz` | 2 |
| Rime Data | `rime-data` | 2 |
| Telegram Desktop | `telegram-desktop` | 2 |
| Time Zone Data | `tzdata` | 2 |
| AOSC U-Boot Utilities | `u-boot-aosc-utils` | 2 |
| You-Get | `you-get` | 2 |
| Youtube-DL | `youtube-dl` | 2 |
| Yuzu | `yuzu` | 2 |
| Gost | `gost` | 3 |
| I2pd | `i2pd` | 3 |
| KCPTUN | `kcptun` | 3 |
| OBFS Proxy | `obfsproxy` | 3 |
| OBFS4 Proxy | `obfs4proxy` | 3 |
| OpenSwan | `openswan` | 3 |
| OpenVPN | `openvpn` | 3 |
| PCAP-DNSProxy | `pcap-dnsproxy` | 3 |
| Shadowsocks | `shadowsocks` | 3 |
| Shadowsocks-LibEv | `shadowsocks-libev` | 3 |
| Shadowsocks-Qt5 | `shadowsocks-qt5` | 3 |
| Simple-OBFS | `simple-obfs` | 3 |
| StrongSwan | `strongswan` | 3 |
| Tor | `tor` | 3 |
| Trojan | `trojan` | 3 |
| V2Ray | `v2ray` | 3 |
| WireGuard | `wireguard` | 3 |
| CA Certificates | `ca-certs` | 3 |
| ACBS | `acbs` | 4 |
| Ciel | `ciel` | 4 |
| XMRig | `xmrig` | 2 |
| Monero Wallet | `monero` | 2 |
| TurtleCoin | `turtlecoin` | 2 |
