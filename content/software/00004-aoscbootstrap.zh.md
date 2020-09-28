+++
title = "AOSCBootstrap"
description = ""
date = 2020-08-10T12:35:51.595Z
[taxonomies]
tags = ["sys-software"]
+++

# AOSCBootstrap

## 依赖

AOSCBootstrap 依赖下面这些 Perl 模块：

- [LWP](https://metacpan.org/pod/LWP)
- [Try::Tiny](https://metacpan.org/pod/Try::Tiny)

在 AOSC OS，你可以使用下面的命令安装它们：

```bash
apt install perl-try-tiny libwww-perl
```

## 用法

```
aoscbootstrap.pl --arch=<architecture> --include=[additional package] --include-file=[list of packages] <branch> <path/to/target> [mirror URL]
```

`[mirror URL]` 参数是可选的，不提供的情况下默认设定为 `https://repo.aosc.io/debs`。

`--include=` 和 `--include-file=` 参数同样也是可选的，可以多次指定，也可以同时指定。

例如，如果你要使用 `localhost` 作为镜像，在 `/root/aosc` 引导使用 `stable` 分支的 `amd64` 系统：

```
aoscbootstrap.pl --arch=amd64 stable /root/aosc http://localhost/debs/
```

如果你想添加更多的软件包，例如 `network-base` 和 `systemd-base`：

```
aoscbootstrap.pl --arch=amd64 --include=network-base --include=systemd-base stable /root/aosc http://localhost/debs/
```

你还可以将你希望添加的软件包写到一个文本文件中：

```
network-base
systemd-base
editor-base
[...]
```

假设你将文件保存为 `base.lst`，你可以利用下面的方式将软件包列表传递给 AOSCBootstrap：

```
aoscbootstrap.pl --arch=amd64 --include-file=base.lst stable /root/aosc http://localhost/debs/
```

## 与 Ciel 配合使用

要配合 [Ciel](https://github.com/AOSC-Dev/ciel) 及其插件使用 AOSCBootstrap：

1. 创建一个工作目录并使用 `cd` 进入该目录。
1. 执行 `ciel init`。
1. 执行 `aoscbootstrap.pl --arch=<architecture> <branch> $(pwd)/.ciel/container/dist/ [mirror URL]`。
1. 在完成之后，你就可以执行其它任务了，例如 `ciel generate` 和 `ciel release`。

## 引导系统

您可以使用 AOSCBootstrap 来引导一个稍大一些的基本系统，或是带有桌面环境（如 GNOME 或 KDE Plasma）的系统。

要这样做，你需要准备一个列有所需软件的清单，你可以在 [Ciel 的源码树](https://github.com/AOSC-Dev/ciel/raw/master/plugin/ciel-generate) 找到一个用于生成预设方案的 Bash 脚本。

要想将 Bash 脚本变为列有所需软件包的纯文本，`recipes` 目录里有方便你做这事的脚本。你只需要执行 `perl recipes/convert.pl ./ciel-generate ./recipes`，`ciel generate` 命令支持的所有基本变种都将转储到 `recipes` 文件夹中。

现在，要想使用这些预设方案，例如生成一个 KDE Plamsa 的变种版本，你可以执行：

```
aoscbootstrap.pl --arch=amd64 --include-file=./recipes/kde.lst stable /root/aosc http://localhost/debs/
```

AOSCBootstrap 就会在 `/root/aosc` 为你准备一个附有 KDE Plamsa 的 AOSC OS 系统。
