+++
title = "SYS-ERR-00006: VLC 3.0 and Above May Fail to Start in GNOME"
description = "Error when Trying to Start VLC in a GNOME Desktop Session"
date = 2020-05-04T03:37:36.716Z
[taxonomies]
tags = ["sys-errata"]
+++

# Summary

When using AOSC OS with the GNOME Desktop, VLC version 3.0 and above may fail to start with the following error output...

```
Gdk-Message: vlc: Fatal IO error 2 (No such file or directory) on X server :0.
```

# Possible Cause

Not yet identified. However, the VLC upstream [claims](https://trac.videolan.org/vlc/ticket/18910#no1) that the issue does not lie within VLC itself.

# Fixed Version

Unfortunately, we are yet to find a solution to this issue.