+++
title = "SYS-ERR-00004: NetEase Cloud Music < 1.1.0 Fails to Launch"
description = "Older Versions of netease-cloud-music Fails to Launch with Sandbox-related Errors"
date = 2020-05-04T03:37:31.576Z
[taxonomies]
tags = ["sys-errata"]
+++

# Summary

With NetEase Cloud Music (`netease-cloud-music`, 网易云音乐) version < 1.1.0, the application may fail to launch with errors similar to the following...

```
[0316/200414:ERROR:browser_main_loop.cc(203)] Running without the SUID sandbox! See https://code.google.com/p/chromium/wiki/LinuxSUIDSandboxDevelopment for more information on developing with the sandbox on.
Gtk-Message: Failed to load module "canberra-gtk-module"
QFileSystemWatcher::removePaths: list is empty
QFileSystemWatcher::removePaths: list is empty
```

# Possible Cause

Not yet identified, given that this package is closed-source.

# Fixed Version
## Package Update

With `netease-cloud-music` version 1.1.0, this issue has been resolved.

## Workaround

With any versions older than 1.1.0, launching the application with the `--no-sandbox` parametre will allow it to run...

```
$ netease-cloud-music --no-sandbox
```

Or, to workaround this issue "permanently" - enabling the option by default...

```
$ install -Dm644 /usr/share/applications/netease-cloud-music.desktop ~/.local/share/applications
$ sed -e 's|Exec=netease-cloud-music|Exec=netease-cloud-music --no-sandbox|g' -i ~/.local/share/applications/netease-cloud-music.desktop
$ update-desktop-database ~/.local/share/applications
```

Now, you should experience no further errors launching NetEase Cloud Music from your application menu.