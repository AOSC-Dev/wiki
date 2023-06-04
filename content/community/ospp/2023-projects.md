+++
title = "Open Source Promotion Plan 2023 Projects"
description = ""
date = 2023-06-04
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

# [Implement GUI for DeployKit](https://summer-ospp.ac.cn/org/prodetail/23f3e0031?lang=en&list=pro)

DeployKit is the installer for AOSC OS. The program should have two operating modes:

  - Helping the user to install AOSC OS as an installer.
  - Providing preventive back-up and disaster recovery functionalities.

At present, a very basic TUI interface has been implemented using Cursive and the Rust Programming Language. However, a GUI interface is still yet to be implemented. The goal of this project is implement the DeployKit GUI as a Web application using Vue.js 3 and the WRY framework.

- Difficulty: Advanced
- Mentor: liushuyu
- Mentor contact: liushuyu@aosc.io
- Project Requirements:
  - Implement a GUI interface for DeployKit
  - Improve error handling and overall logic of the installer backend
  - Provide necessary visual feedback in the UI (e.g. progress indications)
- Technical Requirements:
  - Basic understanding of Linux commands
  - Familiarity with Rust or other system programming languages such as C/C++
  - Familiarity with Rust FFI mechanisms and unsafe handling
  - Application development with Vue.js 3, Vite, WRY, and TAO frameworks
- Related Repositories:
  - https://github.com/AOSC-Dev/deploykit-ui/
  - https://github.com/AOSC-Dev/aoscdk-rs
- License: MIT

# [Automatic Package Testing Framework for Autobuild3](https://summer-ospp.ac.cn/org/prodetail/23f3e0033?lang=en&list=pro)

Autobuild3 is an automated package building system for AOSC OS. Although Autobuild3 already has a basic QA system, in order to improve quality assurance, a unit testing and integration testing framework must be implemented to proactively curb potential issues - such as common quality issues and missing optional dependencies. This framework will be adapted to work with the GitHub Actions CI/CD system.

- Difficulty: Advanced
- Mentor: Camber Huang
- Mentor contact: camber@aosc.io
- Project Requirements:
  - Implement multiple test cases for packages.
    Test using in-source test suites, such as Pytest, `cargo test`, `go test`, etc.

    The key is to implement *multiple* test cases.

    Smoke tests for main executables (scripts and binaries);

    If possible, implement smoke tests for graphical applications.
  - Record test information in package metadata (tagging test results).
  - Output human- and machine- readable test reports
  - Allowing disabling known upstream issues via metadata options.

    If specified to run anyway, treat failures as expected failures (build proceeds).
  - Implement integration with GitHub Actions for packages of the AMD64 architecture

    If GitHub Actions Runner for AArch64 is introduced, implement integration for that as well.
  - Edit and update documentations.

    If time allows, update the documentations on AOSC Wiki with information related to the testing functions.
- Technical Requirements:
  - Basic knowledge for Linux commands and basic workings of Linux-based operating systems.
  - Knowledge for APT/DPKG package management, or experience with distribution packaging

    Before starting the project, the intern must have basic knowledge for ACBS, Ciel-rs, and Autobuild3's operations and source code structures.

    Understanding of how package testing works for other distributions, such as the check() function in PKGBUILD.

    Those experienced with AOSC OS packaging will be preferred.
  - Good command of scripting languages, such as Bash and Python programming.

    Rust language considered a plus, as Ciel-rs is written in Rust
  - Basic understanding of common methods of software testing methods.
- Related Repositories:
  - https://github.com/AOSC-Dev/autobuild3
- License: GPL-2.0
