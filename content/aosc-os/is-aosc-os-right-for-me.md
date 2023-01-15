+++
title = "Is AOSC OS Right for Me?"
description = "Pick the right tool for the job."
date = 2020-05-04T03:37:21.732Z
[taxonomies]
tags = ["sys-info"]
+++

{% card(type="info") %}
This article is an introduction of our AOSC OS mainline distribution, some design features of our AOSC OS/Retro distribution differs from what this page describes. For an introduction of our AOSC OS/Retro distribution, please refer to [AOSC OS/Retro: An Introduction to Users and Maintainers](@/aosc-os/retro/intro.md).
{% end %}

# What is AOSC OS?

AOSC OS is an independently maintained operating system based on the Linux kernel and various software components, using APT and dpkg for package management. AOSC OS is targeted at experienced Linux users and optimised for use on personal devices. Moreover, AOSC OS aims to provide good out-of-the-box experience, simplified system administration, and a reliable work environment.

AOSC OS is one amongst thousands of Linux distributions. As such, you might find yourself drowning in choices. This article will brief you on various facts about AOSC OS to help you decide if AOSC OS is right for you.

# Design Principles

AOSC OS is built upon the following goals and principles in mind:

- Keep packages intact (one application per package) unless necessary.
- Offer satisfactory out-of-the-box experience for users of different language backgrounds.
- Embrace both open- and closed-source software.
- Strong emphasis on system reliability.
- Feature and experience parity for different hardware architectures.

# Pros and Cons

This section outlines various pros and cons of AOSC OS.

## Pros

- Quick deployment and ready to use out-of-the-box.
- Simple and intuitive system management.
- Maintainer offers technical support.
- Good support for closed-source and commercial software.
- Multilingual support as standard.
- Comprehensive hardware driver support.
- Pre-tuned power management support.
- Connectivity aid for Internet-restrictive regions.
- Refined support for Windows applications, powered by Wine.
- Consistent experience across different architectures and optimised binaries.

## Cons

- Heavy, takes up more storage than other distributions.
- No multilib or multiarch support, making cross-architecture development more convoluted.
- Austere software selection.
- Limited support for third-party commercial software.
- Longer response periods for bug fixes and security vulnerabilities, as the maintenance workgroup is short-staffed.
- Pre-installs closed-source and non-free software.

# Use Cases

This section outlines various use cases for AOSC OS.

## Recommended

- Personal or home usage.
- Satisfactory hardware conditions: abundant storage space and stable Internet connections.
- Preference for ease of deployment and out-of-the-box usability.
- Less sensitive to software updates.
- Laptop computers and other energy- and thermal-critical devices.
- You'd like to help maintain AOSC OS.

## Not Recommended

- No experience with using or managing a Linux distribution.
- Demand for lightweight or high customisability.
- Demand for quick software updates.
- Commercial or mission-critical deployments.
- Cloud or Virtual Private Servers (VPS), or other environments with high storage costs.
- Sensitivity for non-free software.
