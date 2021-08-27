+++
title = "systemd-boot-friend"
template = "software.html"
insert_anchor_links = "right"
[extra]
software_category = "System Administration"
package_site_url = "https://packages.aosc.io/packages/systemd-boot-friend"
+++

`systemd-boot-friend` is a software which helps you to use [systemd-boot](https://www.freedesktop.org/software/systemd/man/systemd-boot.html).

**NOTICE**: If you have installed `systemd-boot-friend`,
it will automatically install all existing kernels
and generate entries for you once the kernel is upgraded or modified.

# Initialize
In order to use `systemd-boot-friend`, you have two options:
1. Automatically initialize `systemd-boot` and install the newest kernel via `systemd-boot-friend init`
2. Manually install and set-up `systemd-boot` yourself, then utilize `systemd-boot-friend` just to update the kernels.

For the automatic method, simply mount your *ESP partition* to `/efi` and run `systemd-boot-friend init`.
If everything goes well, you should have a working `systemd-boot` installation.

For the manual method, you can take a look at [systemd-boot - ArchWiki](https://wiki.archlinux.org/index.php/systemd-boot),
which describes how to set up systemd-boot by yourself. Then after you have decided on where to mount your *ESP partition*,
you can fill in the mountpoint at `/etc/systemd-boot-friend.conf` and you are good to go.

# Usage
`systemd-boot-friend` has several subcommands.

    init              Initialize systemd-boot-friend
    list              List all available kernels
    install           Install the kernel specified
    list-installed    List all installed kernels
    remove            Remove the kernel specified
    update            Install all kernels and update boot entries

- `init`
  Initialize systemd-boot, install the newest kernel and generate its boot entry.

- `list`
  List all available kernels.

- `install`
  Install a specific kernel or install the newest kernel if no argument is given.
  The argument can either be the number corresponding to the kernel in `systemd-boot-friend list` or the kernel's name (e.g. `5.12.0-aosc-main`).

- `list-installed`
  List all kernels installed in systemd-boot.

- `remove`
  Similar to install. Remove a specific kernel or choose a kernel if no argument is given.
  The argument can either be the number corresponding to the kernel in `systemd-boot-friend list-installed` or the kernel's name (e.g. `5.12.0-aosc-main`).

- `update`
  Remove all installed kernels, reinstall all available kernels and re-generate the corresponding boot entries.

# Technical details
`systemd-boot-friend` will install kernels to `/EFI/systemd-boot-friend/` directory in your ESP partition,
and generate boot entries naming with `$VERSION-$LOCALVERSION.conf` (e.g. `5.12.0-aosc-main.conf` or `5.12.0-200.fc34.x86_64.conf`)
