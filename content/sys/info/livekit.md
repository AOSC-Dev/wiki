+++
title = "LiveKit"
description = "The design of Livekit"
date = 2020-05-04T03:36:50.056Z
[taxonomies]
tags = ["sys-info"]
+++

# LiveKit
LiveKit is a live environment for installing and maintaining AOSC OS or other Linux distributions.

## Packages
- LXDE
- X11 drivers for display and basic input (libinput)
- Browsers
	- Pale Moon
	- w3m, lynx
- NetworkManager (with Applets)
- Data recovery
	- ddrescue, ddrescueview
	- testdisk
	- gparted
- Default wallpaper with reduced quality
- Remove all documentation from /usr/share/doc
- Accessibility (Orca + Onboard)
- Fonts inclusion as specified in SMALL_ARCH
- Utilities
	- System admin
		- dash, bash, bash-completion, less
		- bc, units (calculators)
		- screen, tmux, byobu
		- pv, progress
		- busybox
		- util-linux
		- sudo
		- genfstab
		- ipcalc
		- haveged
		- john
		- fbterm
	- Automation
		- grep, sed, awk
		- python(2,3), perl, tcl
		- parallel
		- diffutils, patch
		- expect
		- xdotool
	- Connectivity
		- ssh, mosh
		- wget, curl, aria2, zsync
		- netcat, socat
		- ntp
		- mtr
		- privoxy, shadowsocks-libev
		- darkhttpd
		- iperf3
	- File format
		- bsdtar, zip, cpio, xz, lbzip2, pigz, zstd, lzop, lz4, lzip, lziprecover, p7zip, zpaq
		- sqlite
		- file, chardet, dos2unix
		- gnupg
		- dmg2img, nrg2iso
	- Editor
		- ed
		- nano, vim
	- Monitor
		- htop, iotop, dstat, lsof
		- bmon, nethogs, iftop
	- File System
		- e2fsprogs, xfsprogs, btrfs-progs, hfsprogs, ntfs-3g, f2fs-tools, nfs-utils
		- cryptsetup, lvm2
		- nbd, sshfs, curlftpfs
		- fuse, fuse-exfat
		- (libguestfs)
		- fatattr
		- convmv
		- duff
		- mc
		- tree
		- trash-cli
		- parted, gptfdisk
	- Backup
		- rsync
		- unison
		- megatools
	- Hardware
		- dmidecode, hardinfo, hwdata
		- crazydiskinfo, hddtemp, hdparm
		- f3
		- ipmitool