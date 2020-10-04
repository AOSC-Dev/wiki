+++
title = "Installation/WSL (简体中文)"
description = "在 WSL 安装 AOSC OS"
date = 2020-09-01T01:28:00.00Z
[taxonomies]
tags = ["sys-installation"]
+++

事实上，在 WSL（适用于 Linux 的 Windows 子系统）上安装 AOSC OS 比您想的要简单很多。

# 写在前面

WSL 又分为 WSL 1 和 WSL 2 两个版本：

* WSL 1 创建了一个转换层，对系统调用进行翻译，以允许它们在 Windows NT 内核上工作。
* WSL 2 包含自己的 Linux 内核，它具有完整的系统调用兼容性。

在开始下一步之前，请先阅读 [微软官方文档](https://docs.microsoft.com/en-us/windows/wsl/install-win10) 了解如何在您的 Windows 系统上启用 WSL。

# 选择一个 Tarball

截止 2020 年 9 月，WSL 只支持 AMD64 设备，请阅读 [AMD64 安装指南](@/aosc-os/installation/amd64.zh.md#xuan-ze-yi-ge-tarball) 了解可用的 Tarball。

# 解压 Tarball

[LxRunOffline](https://github.com/DDoSolitary/LxRunOffline) 可以很好地管理 WSL 实例，它还提供一些微软尚未提供的功能，例如：

- 使用基于 `xz` 压缩方案的 Tarball。
- 支持自定义发行版安装路径。
- 对 WSL 发行版注册表进行修改。

在下载好 Tarball 和上面提到的工具之后，在 PowerShell 中运行：

```powershell
# Unpack the distro (avoid using a name with spaces!)
& ".\LxRunOffline.exe" install `
  -n AOSC-Whatever `
  -d C:\path\to\the\target `
  -f C:\path\to\the\tarball `
  -s
```

接下来您就可以使用常规的方式启动装好的 AOSC OS 了：可以使用 `LxRunOffline`，可以在 Windows Terminal 新建选项卡，也可以直接使用刚刚创建好的快捷方式。

# 安装后配置

为了实现 WSL 系统和 Windows 系统的交互，您需要在 WSL 中新创建的 AOSC OS 实例内使用管理员身份执行：

```bash
# Remove /etc/resolv.conf so WSL can generate it for us
rm /etc/resolv.conf
# Put sane defaults in /etc/wsl.conf
cat > /etc/wsl.conf << 'EOF'
[automount]
options = "metadata,umask=22,fmask=11"
EOF
# Leave setting PATH to WSL so appends will work
sed -i -e 's/^unset PATH MANPATH/# \1/g' /etc/profile
```

重启 WSL 系统，接下来请参照 [这篇指南](@/aosc-os/installation/amd64.zh.md#yong-hu-zi-ding-yi-she-zhi) 完成用户创建等剩余的设定。

LxRunOffline 不支持创建 WSL2 实例。如果需要 WSL2 实例，只能在安装后手动转换为 WSL，具体参考[微软网站上的文档](https://docs.microsoft.com/en-us/windows/wsl/install-win10)。另外注意，硬盘[不能开启加密或压缩](https://github.com/microsoft/WSL/issues/4103)，否则可能会转换失败。

# 下一步...

## 图形界面

为了让图形化登录登录管理器工作，我们需要 [魔改版 systemd 以及 Xvnc](https://most-useful.com/ubuntu-20-04-desktop-gui-on-wsl-2-on-surface-pro-4/)。我们正在将它们添加到我们的打包列表中。

## 微软应用商店

要想将 AOSC OS 提交到微软应用商店，[除非微软采纳我们的建议](https://github.com/microsoft/WSL/issues/4736)，不然我们就要制作基于 Gzip 压缩算法的 Tarball。此外在提交前我们也需要将 `/etc/profile` 问题修复好。
