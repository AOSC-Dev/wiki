+++
title = "Linux Distribution Review and Survey (2023)"
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
