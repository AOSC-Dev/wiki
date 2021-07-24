+++
title = "Installation/WSL"
description = "Install AOSC OS on WSL"
date = 2021-07-23T22:50:00.00Z
[taxonomies]
tags = ["sys-installation"]
+++

# Install WSL

Please see [Windows Subsystem for Linux Installation Guide for Windows 10](https://docs.microsoft.com/en-us/windows/wsl/install-win10). If you want to run Linux GUI apps, also see [Run Linux GUI apps on the Windows Subsystem for Linux (preview)](https://docs.microsoft.com/en-us/windows/wsl/tutorials/gui-apps).

# Get AOSC OS on WSL

It's the easiest way to get AOSC OS on WSL from Microsoft Store.

<a href='//www.microsoft.com/store/apps/9NMDF21NV65Z?cid=storebadge&ocid=badge'><img src='https://developer.microsoft.com/store/badges/images/English_get_L.png' alt='English badge' style='width: 127px; height: 52px;'/></a>

If you're running a Windows Server or Long-Term Servicing (LTSC) desktop OS SKU that doesn't support Microsoft Store, or your corporate network policies and/or admins to not permit Microsoft Store usage in your environment, you can get AOSC OS on WSL for your architecture from [GitHub Releases](https://github.com/AOSC-Dev/AOSCOSLauncher/releases/latest). Extract all files from the compressed folder, then run Install.ps1 in it.

# Configure AOSC OS

Please see [Create a user account and password for your new Linux distribution](https://docs.microsoft.com/en-us/windows/wsl/user-support), AOSC OS also uses apt to manage packages.
