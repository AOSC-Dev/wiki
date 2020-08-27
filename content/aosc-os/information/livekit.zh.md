+++
title = "LiveKit"
description = "Livekit 设计理念"
date = 2020-05-04T03:36:50.056Z
[taxonomies]
tags = ["sys-info"]
+++

# LiveKit

LiveKit 是一个安装和维护 AOSC OS（及其它 Linux 发行版）的 Live 环境。

## 软件包
- LXDE
- 用于显示和输入的 X11 驱动（libinput）
- 浏览器
	- Pale Moon
	- w3m, lynx
- NetworkManager (with Applets)
- 数据恢复
	- ddrescue, ddrescueview
	- testdisk
	- gparted
- 默认壁纸集
- 删除 `/usr/share/doc` 所有文档
- 通用辅助（Orca + Onboard）
- SMALL_ARCH 指定的字体
- 工具
	- 系统管理
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
	- 自动化
		- grep, sed, awk
		- python(2,3), perl, tcl
		- parallel
		- diffutils, patch
		- expect
		- xdotool
	- 连通工具
		- ssh, mosh
		- wget, curl, aria2, zsync
		- netcat, socat
		- ntp
		- mtr
		- privoxy, shadowsocks-libev
		- darkhttpd
		- iperf3
	- 文件格式支持
		- bsdtar, zip, cpio, xz, lbzip2, pigz, zstd, lzop, lz4, lzip, lziprecover, p7zip, zpaq
		- sqlite
		- file, chardet, dos2unix
		- gnupg
		- dmg2img, nrg2iso
	- 编辑器
		- ed
		- nano, vim
	- 信息看板
		- htop, iotop, dstat, lsof
		- bmon, nethogs, iftop
	- 文件系统支持
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
	- 备份
		- rsync
		- unison
		- megatools
	- 硬件管理
		- dmidecode, hardinfo, hwdata
		- crazydiskinfo, hddtemp, hdparm
		- f3
		- ipmitool