+++
title = "Open Source Promotion Plan 2022 Projects"
description = ""
date = 2022-04-02
[taxonomies]
tags = ["ospp"]
+++

Welcome! The following are project topics that AOSC provides for you to work on. You could pick one and contact the corresponding leader, or you may discuss your interested topic with us in either our [IRC channel][irc], [Telegram group][tg], [Discord server][discord], or [mailing list][mlist].

> Please first read the [Students' Guide][guide].

[irc]: ircs://irc.libera.chat:6697/aosc
[tg]: https://t.me/joinchat/BMnG9zvfjCgZUTIAoycKkg
[discord]: https://discord.gg/VYPHgt9
[mlist]: mailto:discussions@aosc.io
[guide]: https://summer.iscas.ac.cn/help/en/student/

# Allwinner RISC-V chip Mainline Development


Allwinner has release an SoC (Allwinner D1) based on the XuanTie C906 RISC-V core. This project will focus on mainlining the U-Boot bootloader.

- Difficulty: Advanced
- Mentor: Xingda "Icenowy" Zheng
- Mentor contact: icenowy@aosc.io
- Project Requirements:
  - Basic bootloader functions, can boot a Linux kernel, and upstreaming all relevant code changes.
  - If the U-Boot itself is successfully implemented, the student could try to implement SPL based on it, and then implement the display support.
- Technical Requirements:
  - Build cross-compilation toolchains (or use off-the-shelf tools) and the Linux Kernel.
  - Using Git for code maintenance (commit, rebase, etc.).
  - Writing C code (implementing drivers for new devices while referencing existing Kernel code).
  - Writing commit messages, accepting patch reviews on mailing lists.
  - Understanding the RISC-V instruction set (being able to read assembly code output by GCC).
- Related Repositories:
  - https://source.denx.de/u-boot/u-boot
- License: Varies based on different upstream projects, mainly GPL; dual licensing in some cases (e.g. GPL + other licenses with device tree sources or bindings).

# Port AOSC OS to LoongArch Architecture

In June last year, Loongson launched the LoongArch 3A5000 processor based on the LoongArch architecture. The goal of this project is to create a new port of AOSC OS for LoongArch.

- Difficulty: Advanced
- Mentor: Xiaoyuan "Saki" Fu
- Mentor contact: sakiiily@aosc.io
- Project Requirements:
    - Set the standard compilation optimization, system type (tuplet) and package management configuration for the LoongArch architecture for [Autobuild](https://github.com/AOSC-Dev/autobuild3/).
    - Build the basic system with [Linux From Scratch](https://www.linuxfromscratch.org/) and [AOSC OS maintenance guides](https://wiki.aosc.io/developer/packaging/package-styling-manual/).
    - If time permits, build bootable systems and produce standard releases for other users.
- Technical Requirements:
    - Familiarity with the basic build and maintenance tools for AOSC OS, including [Autobuild3](https://github.com/AOSC-Dev/autobuild3/), [ACBS](https://github.com/AOSC-Dev/acbs/) and [Ciel](https: //github.com/AOSC-Dev/ciel/).
    - Basic understanding of the process and principles of [Linux From Scratch](https://www.linuxfromscratch.org/).
    - Familiarity with the [AOSC OS Maintenance Guide](https://wiki.aosc.io/developer/packaging/package-styling-manual/).
    - Familiarity with Bash syntax.
    - Create or rewrite patches.
    - Communicate with upstream projects or communities in English (write a \[commit message\] and receive patch reviews on the \[patch review\]).
- Related Repositories:
    - https://github.com/AOSC-Dev/aosc-os-abbs
- License: Varies based on different upstream projects.

# AOSC Packages Website Backend Re-implementation

AOSC's package information site is now severely disconnected from the current AOSC OS build system and metadata format. A new implementation of a website backend and data synchronization system was needed.

- Difficulty: Advanced
- Mentor: Zixing Liu
- Mentor contact: liushuyu@aosc.io
- Project Requirements:
  - Implement a new web backend that can correctly parse all AOSC OS package metadata.
  - Implement a new data synchronization backend that needs to be able to correctly parse all AOSC OS package metadata as well as all package information in the abbs tree.
  - The newly implemented backend needs to be able to handle a high number of concurrent requests.
- Technical Requirements:
  - The backend and synchronization system needs to be implemented in Rust and/or Python.
  - Basic understanding of basic AOSC OS build and maintenance tools is required.
  - Familiarity with PostgreSQL and SQLite database systems is required.
  - Familiarity with Bash syntax is required.
- Related Repositories:
  - https://github.com/AOSC-Dev/aosc-os-abbs
  - https://github.com/AOSC-Dev/packages-site
- License: GNU Public License Version 2

# Add Missing Documents on AOSC Wiki and Update Existing Documents

There are many AOSC projects missing documents on AOSC Wiki, and many existing documents are outdated. This project will update existing documents and add undocumented project documents to AOSC Wiki.

- Difficulty: Advanced [Temporary]
- Mentor: Kaiyang Wu
- Mentor contact: origincode@aosc.io
- Project Requirements:
  - Add documents for the projects in the work ticket, make sure the English contents are the latest if possible
- Technical Requirements:
  - Ability to write in formal English, familiarity with computer/Linux-related terminologies.
  - Familiarity with Markdown format.
  - Familiarity with searching documents for open-source projects (manpage, README etc.).
  - (If possible) be familiar with Rust, Python etc.
  - Essential familiarity with the current projects maintained by AOSC and the projects used by AOSC OS.
- Related Repositories:
  - https://github.com/AOSC-Dev/wiki
- License: MIT License
