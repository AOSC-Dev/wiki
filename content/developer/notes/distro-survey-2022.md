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
- ✕ : Anti-feature(s), flaw(s), and bad decision(s) to not repeat in AOSC OS.

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
| ✕    | Messy application menus.                                               |

# Deepin

- Date of Review: 20220430
- Version: 20.5

| Type | Remark                                                                 |
|------|------------------------------------------------------------------------|
| ✓    | Extremely fast browser and LibreOffice launch times ([deepin-turbo?](https://github.com/linuxdeepin/deepin-turbo). |
| ✓    | Out-of-the-Box Experience (OOBE) wizard on first boot.                 |
| ✓    | Audio effects on login and other system events.                        |
| ?    | Virtual machine detection and warning about possible performance penalties. |
| ?    | A/B partiton scheme for more efficient and reliable system upgrades.   |
| ✕    | Sluggish installation UI.                                              |
| ✕    | No final confirmation between configuration wizard and installation.   |
| ✕    | Useless installer log.                                                 |

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
| ✕    | Poor layering handling with modified GNOME Shell.                      |

# openSUSE

- Date of Review: 20220430
- Version: Leap 15.3

| Type | Remark                                                                 |
|------|------------------------------------------------------------------------|
| ✓    | Graphical GRUB menu for both installation media and installed copy.    |
| ✓    | "Boot from Hard Disk" entry on installation media GRUB menu (detects whether openSUSE was installed on the hard disk; displayed if detected). |
| ✓    | Option to check installation media.                                    |
| ?    | Option to enable automatic login during installation.                  |
| ✕    | Ugly boot splash.                                                      |
| ✕    | Poor colour scheme and contrast on installation UI.                    |

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

# Miscellaneous Notes

| Type | Remark                                                                 |
|------|------------------------------------------------------------------------|
| ?    | Option to enter DeployKit from LiveKit GRUB menu.                      |
| ?    | Games and music during installation (as with Magic Linux).             |
| ?    | Offline installer (bundled with tarballs).                             |
| ?    | Overlay tarball for NVIDIA driver.                                     |
| ×    | Incomplete KDE localisation data (KWrite, Elisa, etc.).                |
