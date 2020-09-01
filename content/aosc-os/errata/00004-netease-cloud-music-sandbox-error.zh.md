+++
title = "SYS-ERR-00004：网易云音乐 netease-cloud-music < 1.1.0 无法启动"
description = "因沙盒相关问题旧版本的 netease-cloud-music 无法启动"
date = 2020-05-04T03:37:31.576Z
[taxonomies]
tags = ["sys-errata"]
+++

# 概述

版本低于 1.1.0 的网易云音乐 `netease-cloud-music` 可能无法在 AOSC OS 上启动，报错如下：

```
[0316/200414:ERROR:browser_main_loop.cc(203)] Running without the SUID sandbox! See https://code.google.com/p/chromium/wiki/LinuxSUIDSandboxDevelopment for more information on developing with the sandbox on.
Gtk-Message: Failed to load module "canberra-gtk-module"
QFileSystemWatcher::removePaths: list is empty
QFileSystemWatcher::removePaths: list is empty
```

# 成因

由于 `netease-cloud-music` 是闭源软件，我们无法分析问题成因。

# 解决方案

## 软件包升级

将 `netease-cloud-music` 升级至 1.1.0 或更高版本将解决上述问题。

## 备选方案

如果您仍在使用旧于 1.1.0 的版本，可以在运行网易云音乐时带上 `--no-sandbox` 参数：

```
$ netease-cloud-music --no-sandbox
```

当然，想要在不升级的前提下永久地解决这一问题，可以编辑应用程序菜单启动文件：

```
$ install -Dm644 /usr/share/applications/netease-cloud-music.desktop ~/.local/share/applications
$ sed -e 's|Exec=netease-cloud-music|Exec=netease-cloud-music --no-sandbox|g' -i ~/.local/share/applications/netease-cloud-music.desktop
$ update-desktop-database ~/.local/share/applications
```

这样做完之后，在应用程序菜单应该可以正常启动网易云音乐。