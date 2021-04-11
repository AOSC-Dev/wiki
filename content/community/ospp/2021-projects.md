+++
title = "Open Source Promotion Plan 2021 Projects"
description = ""
date = 2021-03-21
[taxonomies]
tags = ["ospp"]
+++

Welcome! The following are project topics that AOSC provides for you to work on. You could pick one and contact the corresponding leader, or you may discuss your interested topic with us in either our [IRC channel][irc], [Telegram group][tg], [Discord server][discord], or [mailing list][mlist].

> Please first read the [Students' Guide][guide].

[irc]: ###
[tg]: https://t.me/joinchat/BMnG9zvfjCgZUTIAoycKkg
[discord]: https://discord.gg/VYPHgt9
[mlist]: mailto:discussions@aosc.io
[guide]: https://summer.iscas.ac.cn/help/en/student/

# Implementation of DeployKit

[DeployKit][dk] is the proposed installer for AOSC OS. The program should have two operating modes:

1. Helping the user to install AOSC OS as an installer;
2. Providing preventive back-up and disaster recovery functionalities;

At present, a very basic TUI interface has been implemented using [Cursive][cursive] and the [Rust Programming Language][rust]. However, a GUI interface is still yet to be implemented. The goal of this project is to provide an installer implementation that follows the [AOSC OS Installation Guide][inst-guide] and automates all installation steps.

- Difficulty: Medium
- Mentor: Zixing Liu
- Mentor Contact: liushuyu@aosc.io
- Project Requirements:
  - Implement a GUI interface for DeployKit.
  - Improve error handling and overall logic of the installer backend.
  - Provide necessary visual feedback in the UI (e.g. progress indications).
- Technical Requirements:
  - Understanding of basic Linux commands.
  - Familiarity with Rust or other system programming languages such as C/C++.
  - Familiarity with Rust FFI mechanisms and `unsafe` handling.
  - Familiarity with GObject, Glib, and GTK programming (Note: GTK/GLib API documentation is at times inconsistent, students with prior knowledge with GTK 3 API is preferred).
  - Note: This project assumes that the prospective student is already proficient with the first three "Technical Requirements" by the time of application.
- Related Repositories:
  - Backend and TUI: https://github.com/AOSC-Dev/aoscdk-rs
  - DeployKit reference GUI designs: https://github.com/AOSC-Dev/DeployKit
- Related Resources:
  - GTK 3 Rust bindings: https://lib.rs/crates/gtk/ Official website and tutorials: https://gtk-rs.org/
  - GTK 3 C API Documentation: https://developer.gnome.org/gtk3/stable/
  - Gettext Rust bindings: https://lib.rs/crates/gettext-rs/
  - Gettext C API Documentation: https://www.gnu.org/software/gettext/
  - _The Rustonomicon_ (a book explaining how to handle `unsafe`): https://doc.rust-lang.org/nomicon/
- License: [MIT](https://github.com/AOSC-Dev/DeployKit/blob/master/COPYING)

[dk]: https://github.com/AOSC-Dev/aoscdk-rs
[cursive]: https://lib.rs/crates/cursive
[gtk]: https://www.gtk.org/
[rust]: https://rust-lang.org
[inst-guide]: @/aosc-os/installation/amd64.md
