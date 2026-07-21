+++
title = "Installation/WSL（简体中文）"
description = "在适用于 Linux 的 Windows 子系统上安装 AOSC OS"
date = 2021-07-23T22:50:00.00Z
[taxonomies]
tags = ["sys-installation"]
+++

# 安装 WSL

请参阅[如何使用 WSL 在 Windows 上安装 Linux](https://learn.microsoft.com/zh-cn/windows/wsl/install)。如果想要运行 Linux GUI 应用程序，也请参阅[在适用于 Linux 的 Windows 子系统上运行 Linux GUI 应用](https://docs.microsoft.com/zh-cn/windows/wsl/tutorials/gui-apps)。

# 获取 AOSC OS on WSL

从 Microsoft Store 获取 AOSC OS on WSL 是最简单的方法。

<a href='//www.microsoft.com/store/apps/9NMDF21NV65Z?cid=storebadge&ocid=badge'><img src='https://developer.microsoft.com/store/badges/images/Chinese_Simplified_Get_L.png' alt='Chinese badge' style='width: 127px; height: 52px;'/></a>

如果你正在运行不支持 Microsoft Store 的 Windows Server 或长期服务 (LTSC) 桌面操作系统 SKU，或者你的公司网络策略和/或管理员不允许在你的环境中使用 Microsoft Store，你可以从 [GitHub Releases](https://github.com/AOSC-Dev/AOSCOSLauncher/releases/latest) 获取适用于你的体系结构的 AOSC OS on WSL。从压缩的文件夹提取全部文件，然后运行其中的 Install.ps1。

# 配置 AOSC OS

请参阅[配置 WSL 开发环境的 Linux 用户名和密码](https://learn.microsoft.com/zh-cn/windows/wsl/setup/environment#set-up-your-linux-username-and-password)，AOSC OS 也使用 apt 管理软件包。
