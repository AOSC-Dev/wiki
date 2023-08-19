+++
title = "Linux Distribution Review and Survey (2023)"
description = "Know yourself and your unlikely partners."
date = 2023-07-30
[taxonomies]
tags = ["minutes"]
+++

# Legend

Below are the symbols used to denote different types of notes taken during
distribution reviews, aggregated in tables in the following sections. | 

- ✓ : Good feature(s) planned for implementation in AOSC OS. | 
- ? : Questionable feature(s), further discussion needed. | 
- × : Anti-feature(s), flaw(s), and bad decision(s) to not repeat in AOSC OS. | 

# openEuler Community Edition

- Date of Review: 20230729
- Version: 22.03 LTS SP2

| Type | Remark                                                                             |
|------|------------------------------------------------------------------------------------|
| ✓    | Overriding locales to English (they used en_US.UTF-8) on bare TTY sessions.        |
| ×    | No Chinese input support during installation - can't set a Chinese full name.      |
| ×    | Bad fontconfig settings, Japanese glyphs displayed on Chinese installer interface. |
| ×    | PolicyKit installed but not enabled by default.                                    |
| ×    | Networking not enabled during installation.                                        |
| ×    | Random files from packages loitered around `/`.                                    |
| ?    | Cockpit not whitelisted by firewall, not accessible without further configuration. |

# RHEL Workstation

- Date of Review: 20230729
- Version: 9.2

| Type | Remark                                                                             |
|------|------------------------------------------------------------------------------------|
| ✓    | Power profile support available and enabled by default.                            |
| ×    | Bad fontconfig settings, Japanese glyphs displayed on Chinese installer interface. |
| ?    | Installer sets default language by GeoIP detection.                                |

# Ubuntu

- Date of Review: 20230819
- Version: 23.04

| Type | Remark                                                                             |
|------|------------------------------------------------------------------------------------|
| ✓    | Functionality to detect keyboard layout by a single key stroke at the installer. |
| ✓    | Internet connection wizard at the installer. |
| ✓    | Third-party drivers installation feature at the installer. |
| ✓    | Hardware driver manager. |
| ✓    | Installs open-vm-tools after detecting the virtual machine. |
| ✓    | Input method works out-of-the-box. |
| ?    | Theme selection at the installer. |
| ?    | Installation by rsync. |
| ?    | Skips GRUB menu by default. |
| ?    | Defaults to Wayland. |
| ?    | Pre-installs Remmina (RDP/VNC). |
| ×    | Language selection does not affect live session. |
| ×    | No input method support for full name input. |
| ×    | No valid installation progress indicator (only a "bouncing progress bar"). |
| ×    | Poor Chinese localization "利用最好的开源进行开发."
| ×    | No option to disable system upgrade during installation (nor was there an option to cancel the update, as with the previous Ubiquity installer). |
| ×    | Ubuntu Desktop Installer takes up a processor core. |
| ×    | Installation log was not output at real-time. |
| ×    | Yet more updates after updating during installation. |
| ×    | Data sharing with Canonical is opt-out. |
| ×    | Serif Chinese font in Ubuntu Software (Dart application)?
| ×    | Input method switching combination doesn't seem to work (in VMware). |
| ×    | command-not-found defaults to Snap. |

# openKylin

Date of Review: 20230819
Version: 1.0

| Type | Remark                                                                             |
|------|------------------------------------------------------------------------------------|
| ✓    | Built-in "restoration mode" with validation for backups. | 
| ✓    | Built-in backup tool with Ghost (?!) image support. | 
| ✓    | Biometrics support for PolicyKit. | 
| ✓    | Fully featured user's guide with graphical instructions! |
| ?    | Provides an older kernel (6.1 vs 5.15) at Live menu. | 
| ?    | Fullscreen installer. | 
| ?    | Has an on-screen keyboard enable icon. | 
| ?    | A/B partition. | 
| ?    | Installation by rsync. | 
| ?    | Graphical wizard for installing .deb packages. | 
| ?    | Built-in LAN chat. | 
| ?    | Teamviewer alternative. | 
| ?    | Defaults to Wayland. | 
| ?    | Pre-installs an alarm clock and voice recorder. | 
| ×    | Defaults to an awful resolution (800x600) while reporting 3840x2400 (VirtualBox). | 
| ×    | Two on-screen keyboards pre-installed (and enabled) by default. |
| ×    | No input method support for user name input. | 
| ×    | No full name setup. | 
| ×    | Installer log/status indication has poor readability. | 
| ×    | Bad line-wrap for desktop icons. | 
| ×    | Application menu is sometimes unresponsive. | 