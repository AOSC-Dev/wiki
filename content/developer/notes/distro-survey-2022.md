+++
title = "Linux Distribution Review and Survey (2022)"
description = "Know yourself and your unlikely partners."
date = 2022-05-18
[taxonomies]
tags = ["minutes"]
+++

# Legend

Below are the symbols used to denote different types of notes taken during
distribution reviews, aggregated in tables in the following sections.

- ✓ : Good feature(s) planned for implementation in AOSC OS.
- ? : Questionable feature(s), further discussion needed.
- × : Anti-feature(s), flaw(s), and bad decision(s) to not repeat in AOSC OS.

# Manjaro

- Date of Review: 20220424
- Version: 21.2.6

| Type | Remark                                                                 |
|------|------------------------------------------------------------------------|
| ✓    | A news aggregator for community/distribution news and PSAs.            |
| ✓    | Pre-installed backup application: Timeshift.                           |
| ✓    | Graphical utility for installing NVIDIA drivers.                       |
| ?    | OnlyOffice as LibreOffice replacement, where possible.                 |
| ?    | A snazzy and semi-graphical (font-dependent) shell prompt.             |
| ×    | Messy application menus.                                               |

# Deepin

- Date of Review: 20220430
- Version: 20.5

| Type | Remark                                                                 |
|------|------------------------------------------------------------------------|
| ✓    | Extremely fast browser and LibreOffice launch times ([deepin-turbo?](https://github.com/linuxdeepin/deepin-turbo)). |
| ✓    | Out-of-the-Box Experience (OOBE) wizard on first boot.                 |
| ✓    | Audio effects on login and other system events.                        |
| ?    | Virtual machine detection and warning about possible performance penalties. |
| ?    | A/B partiton scheme for more efficient and reliable system upgrades.   |
| ×    | Sluggish installation UI.                                              |
| ×    | No final confirmation between configuration wizard and installation.   |
| ×    | Useless installer log.                                                 |

# Pop_OS!

- Date of Review: 20220430
- Version: 22.04

| Type | Remark                                                                 |
|------|------------------------------------------------------------------------|
| ✓    | Defaults to a larger TTY font.                                         |
| ✓    | Fast, squashfs-based installation (parallel decompression).            |
| ✓    | Out-of-the-Box Experience (OOBE) on first boot.                        |
| ✓    | Eddy, a graphical .deb package installer.                              |
| ✓    | Popsicle, a USB backup media creator.                                  |
| ?    | Mandatory installation media checksum verification (skip unavailable). |
| ?    | Full-disk encryption option on installer.                              |
| ×    | Poor layering handling with modified GNOME Shell.                      |

# openSUSE

- Date of Review: 20220430
- Version: Leap 15.3

| Type | Remark                                                                 |
|------|------------------------------------------------------------------------|
| ✓    | Graphical GRUB menu for both installation media and installed copy.    |
| ✓    | "Boot from Hard Disk" entry on installation media GRUB menu (detects whether openSUSE was installed on the hard disk; displayed if detected). |
| ✓    | Option to check installation media.                                    |
| ?    | Option to enable automatic login during installation.                  |
| ×    | Ugly boot splash.                                                      |
| ×    | Poor colour scheme and contrast on installation UI.                    |

# ZorinOS

- Date of Review: 20220507
- Version: 16.1

| Type | Remark                                                                 |
|------|------------------------------------------------------------------------|
| ✓    | Option to update system on installation.                               |
| ✓    | Mandatory installation media checksum verification (possible to skip with ^C). |
| ✓    | Out-of-the-Box Experience (OOBE) on first boot.                        |
| ✓    | LibreOffice launches much faster                                       |
| ?    | "Power Off" entry on installation media GRUB menu.                     |
| ?    | "Eject media" prompt on installation media reboot.                     |
| ?    | OnlyOffice as LibreOffice replacement, where possible.                 |

# Ubuntu

- Date of Review: 20220507
- Version: 22.04

| Type | Remark                                                                 |
|------|------------------------------------------------------------------------|
| ✓    | Introduction to pre-installed software and possible alternatives during installation. |
| ✓    | Power profile configuration GUI (future feature to upstream KDE).      |
| ✓    | Fast LibreOffice launch.                                               |
| ✓    | Recovery media creator.                                                |
| ?    | Pre-installed Remmina.                                                 |
| ?    | Installation begins during configuration.                              |
| ×    | Sluggish installation UI (Ubiquity).                                   |
| ×    | GNOME with all its flaws...                                            |

# Kubuntu

- Date of Review: 20220513
- Version: 22.04

| Type | Remark                                                                 |
|------|------------------------------------------------------------------------|
| ✓    | Fcitx5 as default input method framework, works on first boot.         |
| ✓    | Fast LibreOffice launch.                                               |
| ✓    | "usb-creator-kde" for creating backup media (let's fork it?).          |
| ✓    | More comprehensive peripheral support: Thunderbolt (kcm-bolt) and Wacom (kcm-wacomtablet). |
| ✓    | Pre-installed backup manager (KUp, kup-backup).                        |
| ?    | Release note avaiable pre-installation.                                |
| ?    | Pre-installed BitTorrent (KTorrent) and Remote Desktop Protocol (KRDC) clients. |
| ?    | Pre-installed firewall manager (KFirewall, using firewalld or ufw).    |
| ?    | Pre-installed partition manager (PartitionManager, KDE project; use GParted instead?). |
| ?    | Blur effect disabled by default.                                       |
| ?    | Include games on default KDE installation?                             |
| ×    | HTML files opened with Kate by default.                                |
| ×    | Inconsistent L10n settings: incomplete language packs and confused KDE localization settings (stating that language packs were not installed when they were) |
| ×    | No L10n support for LibreOffice.                                       |

# Ubuntu MATE

- Date of Review: 20220522
- Version: 22.04

| Type | Remark                                                                 |
|------|------------------------------------------------------------------------|
| ✓    | OOBE dialog and a quick navigation for pre-installed software.         |
| ✓    | Fast LibreOffice launch.                                               |
| ✓    | Screen narrator (Orca); KDE equivalent available?                      |
| ✓    | Fcitx5 as default input method framework, works on first boot.         |
| ?    | Pre-installed gufw firewall manager.                                   |
| ?    | Sound effects for login and desktop.                                   |
| ?    | Preinstalled BitTorrent client (Transmission).                         |
| ?    | Evolution as default e-mail client.                                    |
| ?    | Webcamoid to augment Webcam functions (like a simple OBS).             |
| ?    | Out-of-tree `v4l2loopback` driver for virtual video input devices.     |
| ?    | "Boutique" application store for recommended applications, with detailed introductions and reviews. |
| ×    | L10n provided via (unreliable and incomplete, such was the case with LibreOffice) language packs. |
| ×    | Loads of updates on first boot, before language packs could be installed. |
| ×    | Two bluetooth managers (MATE and Blueman).                             |
| ×    | No graphical configuration tool for Fcitx5.                            |

# Linux Mint Cinnamon

- Date of Review: 20220529
- Version: 20.3

| Type | Remark                                                                 |
|------|------------------------------------------------------------------------|
| ✓    | "Mint Upgrade" offers mirror tester.                                   |
| ✓    | Fast LibreOffice launch.                                               |
| ✓    | Windows XP "Security Center"-like user suggestion application (asks to enable backup via Timeshift). |
| ?    | Hardware detection and listing tool at Live medium boot menu.          |
| ?    | OOBE/Onboarding wizard starts by default unless unchecked.             |
| ?    | A wizard for creating progressive Web application entries (webapp-manager). |
| ?    | Pre-installed BitTorrent client (Transmission).                        |
| ?    | Pre-installed IRC client (HexChat) joins #linuxmint channel on first launch. |
| ?    | A flash drive formatter?                                               |
| ×    | Installer runs localedef for all locales (takes years).                |
| ×    | Ambiguous "Skip" button on installer (Ubiquity) for seemingly key steps. |
| ×    | Asks to install extra graphical drivers on Qemu, then prompts that no driver was necessary (with a big tick mark on the UI). |
| ×    | Applications freeze on exit occasionally.                              |
| ×    | HYpotix TV channel streamer... but nothing works.                      |
| ×    | Dated Sunpinyin as default Simplified Chinese input method.            |
| ×    | Two backup applications pre-installed.                                 |
| ×    | Sluggish software center UI - Python applications with loads of fading animations. |

# MX Linux

- Date of Review: 20220605
- Version: 21.1 (non-AHS)

| Type | Remark                                                                 |
|------|------------------------------------------------------------------------|
| ✓    | Help message for each installation step.                               |
| ✓    | Option for RTC as local time.                                          |
| ✓    | Snapshot manager saves current system state into live installation media. |
| ✓    | "MX Tour" as a short visual guide for new users.                       |
| ?    | "MX Tools" as a collection of (not so) distro-specific administration tools/utilities. |
| ?    | Uses gfxboot for MBR by default.                                       |
| ?    | Option to migrate Live media state to installed system.                |
| ×    | Live system froze on first boot.                                       |
| ×    | Installer does not have any i18n support.                              |
| ×    | Ugly installer UI with a narrow log window.                            |
| ×    | No confirmation before installation - procedure starts after partition selection. |
| ×    | Tips only showing after user configuration wizard - not much time to read. |
| ×    | Peculiar desktop layout, with logoff menu button on top left and application menu button on bottom left. |
| ×    | Multiple backup tools (MX Snapshot + luckyBackup).                     |
| ×    | Midnight Commander on a desktop distribution.                          |
| ×    | Messy init system situation (sysvinit as PID 1, runit as extra tools, and systemd for desktop sessions). |
| ×    | Systemd not PID 1, but pre-installs systemd tools - most report errors and will not function. |

# UOS

- Date of Review: 20220605
- Version: 21.3 (revision 13000034, Home Edition)

Note: Most of the remarks overlap with [Deepin](#deepin) since UOS is a rebranded version of Deepin.

| Type | Remark                                                                 |
|------|------------------------------------------------------------------------|
| ✓    | Out-of-the-Box Experience (OOBE) wizard on first boot.                 |
| ✓    | Audio effects on login and other system events.                        |
| ?    | Virtual machine detection and warning about possible performance penalties. |
| ?    | A/B partiton scheme for more efficient and reliable system upgrades.   |
| ?    | Included an Android compatibility layer to run Android applications.   |
| ×    | Sluggish installation UI.                                              |
| ×    | No final confirmation between configuration wizard and installation.   |
| ×    | Useless installer log.                                                 |

# UbuntuKylin

- Date of Review: 20220611
- Version: 22.04 Professional

| Type | Remark                                                                 |
|------|------------------------------------------------------------------------|
| ✓    | Out-of-the-Box Experience (OOBE) wizard on first boot.                 |
| ✓    | Device Manager-like Hardware information application.                  |
| ?    | Mandatory Live media verification (skippable via ^C).                  |
| ?    | Windows 7-like desktop interface.                                      |
| ×    | 50GiB disk requirement for automatic partitioning (but not for manual partitioning: 25GiB). |
| ×    | Useless installation progress indicator (stuck at 96% throughout installation). |
| ×    | Systemd service failures.                                              |
| ×    | Boots to TTY login prompt... then X11.                                 |
| ×    | Desktop crashes randomly to a blank screen with a cursor (VirtualBox). |
| ×    | File manager pops up on first boot... for some reason.                 |
| ×    | Pre-installed Fcitx 4 does not come with Qt support - but self-developed applications uses Qt. |
| ×    | Opt-out distro telemetry.                                              |
| ×    | Two scanner applications and music players installed by default.       |

# elementaryOS

- Date of Review: 20220611
- Version: 6.1-stable.20211218-rc

| Type | Remark                                                                 |
|------|------------------------------------------------------------------------|
| ✓    | Out-of-the-Box Experience (OOBE) wizard on first boot.                 |
| ✓    | Clean application menu.                                                |
| ?    | Mandatory Live media verification (skippable via Esc).                 |
| ?    | An application for system maintenance (file clean-up, etc.) scheduling. |
| ×    | Installer UI (Ubiquity?) takes ~30 seconds to respond after language change. |
| ×    | LiveCD's "Boot from HDD" option does not work.                         |
| ×    | "Purchase" button for paid applications crashes App Center.            |
| ×    | Default video player fails to launch.                                  |
| ×    | No zh_CN locale option by default in settings application.             |
| ×    | Ambiguous name for "Chinese" language pack.                            |
| ×    | zh_CN locale paired to Bulgarian (then Denmark?!) regional formats.    |
| ×    | Random, rapidly repeating PolicyKit agent crashes.                     |
| ×    | Uses an IDE as default text editor.                                    |
| ×    | Automatic system update does not check space availability, crashes desktop. |

# Miscellaneous Notes

| Type | Remark                                                                 |
|------|------------------------------------------------------------------------|
| ?    | Option to enter DeployKit from LiveKit GRUB menu.                      |
| ?    | Games and music during installation (as with Magic Linux).             |
| ?    | Offline installer (bundled with tarballs).                             |
| ?    | Overlay tarball for NVIDIA driver.                                     |
| ×    | Incomplete KDE localisation data (KWrite, Elisa, etc.).                |
