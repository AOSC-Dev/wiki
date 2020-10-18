+++
title = "systemd-boot-friend"
template = "software.html"
insert_anchor_links = "right"
[extra]
software_category = "System Administration"
package_site_url = "https://packages.aosc.io/packages/systemd-boot-friend"
+++

`systemd-boot-friend` is a script set which helps you to use [systemd-boot](https://www.freedesktop.org/software/systemd/man/systemd-boot.html).

There are three scripts in this package:
- `systemd-boot-friend`, install latest kernels (including mainline and lts kernels) to your EFI partition.
  - This script should (not yet) be executed automatically after a kernel modification, so that you will always have the latest kernel in ESP partition.
  - This script will install `intel-ucode` too.
- `systemd-boot-mkinit`, generate config files for `systemd-boot`.
- `systemd-boot-init`, attempt to install `systemd-boot` on your system, try to generate systemd-boot configs, and install the kernels.


**NOTICE**: For now the automatic hook does **NOT** work yet. So you will have to manually run `systemd-boot-friend` after the kernel is updated or modified.

# Usage
In order to use `systemd-boot-friend`, you have two options:
1. Automatically install via using `systemd-boot-init`
2. Manually install and set-up systemd-boot yourself, then utilize `systemd-boot-friend` just to update the kernels.

For the automatic method, simply mount your *ESP partition* to `/efi` and run `systemd-boot-init`. If everything goes well, you should have a working systemd-boot installation.

For the manual method, you can take a look at [systemd-boot - ArchWiki](https://wiki.archlinux.org/index.php/systemd-boot), which describes how to set up systemd-boot by yourself. Then after you have decided on where to mount your *ESP partition*, you can fill in the mountpoint at `/etc/systemd-boot-friend.conf` and you are good to go.

# Technical details
`systemd-boot-friend` will install kernels to `/EFI/aosc/` directory in your ESP partition. Files will be named like this:

+ `vmlinuz-aosc-$FLAVOR`: kernels, *$FLAVOR* is usually main or lts.
+ `initramfs-aosc-$FLAVOR`: init RAM disks, *$FLAVOR* matches your kernel.
+ `intel-ucode.img`: Intel processor microcdoes (installed by [intel-ucode in repo](https://packages.aosc.io/packages/intel-ucode)).
