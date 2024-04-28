+++
title = "Linux Distribution Review and Survey (2024)"
description = "Know yourself and your unlikely partners."
date = 2023-07-30
[taxonomies]
tags = ["minutes"]
+++

# Legend

Below are the symbols used to denote different types of notes taken during
distribution reviews, aggregated in tables in the following sections.

- ✓ : Good feature(s) planned for implementation in AOSC OS.
- ? : Questionable feature(s), further discussion needed.
- × : Anti-feature(s), flaw(s), and bad decision(s) to not repeat in AOSC OS.

# Fedora

- Date of Review: 20240428
- Version: 40 Workstation

| Type | Remark                                                                             |
|------|------------------------------------------------------------------------------------|
| ✓    | SSH/VNC remote access integration in GNOME Settings.                               |
| ✓    | Coloured kernel error output.                                                      |
| ?    | Two-tiered systemd startup status (Starting **foo.service** - Description for foo ...) |
| ?    | GRUB skips menu by default.                                                        |
| ×    | Netinst image does not ship with `llvmpipe`, VMware virtual machine greeted with `drisw` errors. |
| ×    | Installer does not reboot the system after hitting "Finish," whilst GNOME's session control is confusing for first-time users to find. |
| ×    | Broken maximise button display on Firefox's CSD (hidden but operable).            |
| ×    | Broken input method for some applications - GNOME Weather and Clocks.             |
| ×    | GNOME Clocks failed to index (inaccessible from search queries) localised cities that are also standard tzdata cities - such as Shanghai (上海) and Chongqing (重庆); other cities such as Hangzhou (杭州) are indexed properly and accessible in searches. |
| ×    | Fractional scaling not available out-of-the-box.                                  |
| ×    | Frequent loss of mouse input in GNOME Shell whilst testing in VMware - windows still updates and system responds to ACPI power events, but mouse clicks does not work. |
| ×    | GNOME Connections gets stuck in a loop if user chooses "Cancel" during initiation of RDP connection. |

# Anolis OS

- Date of Review: 20240428
- Version: 23.1 Beta (LoongArch)

| Type | Remark                                                                             |
|------|------------------------------------------------------------------------------------|
| ✓    | Ships both `BOOTLOONGARCH.EFI` and `BOOTLOONGARCH64.EFI` to maximise firmware compatibility. |
| ?    | Ships only old-world GRUB but offers old-world BPI support in the kernel (supports booting new-world kernels using old-world firmwares). |
| ×    | Lacks AMD GPU firmware (`/usr/lib/firmware/*`) in default system installation - AMD graphics cards will appear to lock up during boot. |
| ×    | `accounts-daemon.service` fails to launch due to "cannot make segment writable for relocation," causing GDM to also fail to launch (desktop does not start). |
| ×    | No repository access.                                                             |