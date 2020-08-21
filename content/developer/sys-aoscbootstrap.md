+++
title = "AOSCBootstrap"
description = ""
date = 2020-08-10T11:24:36.887Z
tags = ""
+++

# AOSCBootstrap

## Dependencies

AOSCBootstrap requires the following Perl modules:

- [LWP](https://metacpan.org/pod/LWP)
- [Try::Tiny](https://metacpan.org/pod/Try::Tiny)

On AOSC OS, you may install these dependencies using the following command:

```bash
apt install perl-try-tiny libwww-perl
```

## Usage

```
aoscbootstrap.pl --arch=<architecture> --include=[additional package] --include-file=[list of packages] <branch> <path/to/target> [mirror URL]
```

The `[mirror URL]` argument is optional, when omitted, the script defaults to `https://repo.aosc.io/debs`.
The `--include=` and `--include-file=` are optional, can be specified multiple times and can be specified together.

For example, to bootstrap a `amd64` architecture base system on the `stable` branch at `/root/aosc`, using `localhost` as the mirror:

```
aoscbootstrap.pl --arch=amd64 stable /root/aosc http://localhost/debs/
```

If you want to include additional packages, for example, add `network-base` and `systemd-base`:

```
aoscbootstrap.pl --arch=amd64 --include=network-base --include=systemd-base stable /root/aosc http://localhost/debs/
```

If you want to include even more packages, it is recommended to list them in a separate file like this:

```
network-base
systemd-base
editor-base
[...]
```

Assume you have saved the file as `base.lst`, then you can use AOSCBootstrap like this:

```
aoscbootstrap.pl --arch=amd64 --include-file=base.lst stable /root/aosc http://localhost/debs/
```

## Usage with `CIEL!`

To use AOSCBootstrap with [CIEL!](https://github.com/AOSC-Dev/ciel) and its plugins, you can follow these procedures below:

1. Create your work directory and `cd` into it.
1. Run `ciel init`.
1. Run `aoscbootstrap.pl --arch=<architecture> <branch> $(pwd)/.ciel/container/dist/ [mirror URL]`.
1. When finished, you may proceed to other tasks you may want to perform such as `ciel generate` and `ciel release`.

## Full Bootstrap to a Larger Base System

You can use AOSCBootstrap to bootstrap a larger base system or even a base system with a graphic user interface based desktop environment like GNOME or KDE.

To do this, you need a list of required packages. Fortunately, you can find the recipe [inside CIEL!'s source tree](https://github.com/AOSC-Dev/ciel/raw/master/plugin/ciel-generate).

To help you convert this bash script to a plaintext file containing the required packages, there is a conversion script resides in the `recipes` folder.

Simply do `perl recipes/convert.pl ./ciel-generate ./recipes` and all the base variants currently supported by `ciel generate` command will be dumped into the `recipes` folder.

Now, to use those recipes, for instance, bootstrapping a `kde` variant of the system, you can execute AOSCBootstrap like this:

```
aoscbootstrap.pl --arch=amd64 --include-file=./recipes/kde.lst stable /root/aosc http://localhost/debs/
```

AOSCBootstrap will prepare a ready-to-use KDE flavored AOSC OS located at `/root/aosc`.
