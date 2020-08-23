+++
title = "SYS-ERR-00009: Error Updating to Systemd 242"
description = "Obsolete systemd services in memory cause problems"
date = 2020-05-04T03:37:44.030Z
[taxonomies]
tags = ["sys-errata"]
+++

# Symptoms

AOSC has identified an issue with a systemd update. While updating `systemd` to `1:242` or later versions, you may get an error message stating:

```shell
(Reading database ... 89562 files and directories currently installed.)
Preparing to unpack .../apt_1%3a1.7.0-3_amd64.deb ...
Unpacking apt (1:1.7.0-3) over (1:1.7.0-2) ...
Setting up apt (1:1.7.0-3) ...
Failed to enable unit: Access denied
dpkg: error processing package apt (--configure):
 installed apt package post-installation script subprocess returned error exit status 1
Errors were encountered while processing:
 apt
E: Sub-process /usr/bin/dpkg returned an error code (1)
```

# Cause

After updating `systemd` to `1:242` or newer, some packages updated later still calls the obsolete systemd protocol functions in memory, causing unrecoverable problems. 

- This issue is introduced by [this commit](https://github.com/systemd/systemd/commit/3f10c66270b74530339b3f466c43874bb40c210f).

# Workaround
If the error already occurred, doing a power cycle before continuing the system update, or, follow these steps:

```shell
kill 1
```

# Next steps

We are working on a more reliable solution and will provide an update in an upcoming release.