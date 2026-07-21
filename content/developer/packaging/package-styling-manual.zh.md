+++
title = "AOSC OS 软件包样式指南"
description = "过好生活，打美包儿包儿"
date = 2020-08-04T03:13:17.895Z
[taxonomies]
tags = ["dev-sys"]
+++

# 概述

[AOSC OS ABBS Tree](https://github.com/AOSC-Dev/aosc-os-abbs/) 现在有超过 5000 个包，这些包由 20 多个工具人维护。有些软件包已经有着五年的历史，问题也随之出现：

- 软件包依赖项缺失。
- 构建脚本中的变量没加引号。
- 构建脚本缺少注释，晦涩难懂。
- 软件包描述（`$PKGDES`）不清晰。
- 软件包分类（`$PKGSEC`）不正确。
- ...

如果没有一个全面的指导方针在未来的打包工作，问题只会继续增加，这也是本文诞生的目的。

# 打包者、软件包名称与说明

本小节我们会讲到描述一个 AOSC OS 软件包的三大利器。

## 打包者

Debian 软件包（`.deb`）中的打包者或维护者信息应该按照以下格式填写：

```
Executed Packager <suffering@pakreq.work>
```

## 软件包名称

软件包名称（`PKGNAME=` 或 `$PKGNAME`）应为小写且应当符合包管理器对包名称的其它规定。

## 软件包说明

软件包说明（`PKGDES=` 或 `$PKGDES`）在格式上有以下的要求：

- 使用大写字母开头。
- 结尾没有句号或其它标点符号。


值得注意的是，AOSC OS 软件包的包描述应该是描述性的，而不是定义性的。可接受的包描述应该类似于：

    "Library with common API for various MATE modules"

而不应过于简略：

    "MATE Desktop Library"

亦不应过于详尽或复述来自上游项目的宣传性口吻：

    "Library with concise and convenient API for various MATE modules"

# Spec 文件

在使用 [ACBS](https://github.com/AOSC-Dev/acbs)（Autobuild CI Build Service）时，会在名为 `spec` 的文件中定义多种变量，下面我们将讨论这些变量。

## 软件包版本

软件包版本变量定义了软件包的版本号和修订号。

### VER

`VER=` 行（`$VER` 变量）定义软件包的主版本号。在为 AOSC OS 打包时，打包者应遵守下列规则。

| 情形 | 应当采取的措施 | 举例 |
|-------------------|-------------------------------------|-------------------|
| 版本号只带有半角句号 | 直接使用上游的版本号 | GNOME Clocks 3.32.1 -> `VER=3.32.1` |
| 版本号带有字母 | 将字母转为小写，将字母相邻的标点移除 | Bind 9.12.3-P4 -> `VER=9.12.3p4` |
| 版本号带有短横线（`-`） | 将短横线替换为加号（`+`） | ImageMagick 6.9.10-23 -> `VER=6.9.10+23` |
| 版本号带有下划线 (`_`) | 将下划线替换为小数点（`.`） |  Icarus Verilog 10_2 -> `VER=10.2` |
| 版本号带有发布阶段标记（`alpha`、`beta`、`rc`） | 将字母转为小写，并在字母前加波浪号（`~`） | Golden Dict 1.5.0-RC2 -> `VER=1.5.0~rc2` |
| 版本号为格式化后的日期 | 将短横线替换为小数点 (`.`) | QuickJS 2020-09-06 -> `VER=2020.09.06` |
| 版本号基于版本控制系统的提交哈希值 | 由最后 tag 版本开头（如“3.2.1”），如从未 tag 则写“0”；而后接上“+”、版本控制器名称（如“git”）及提交日期 | Shadowsocks 5ff694b2c2978b432918dea6ac104706b25cbf48 -> `VER=0+git20181219` |
| 版本号基于版本控制系统的提交哈希值 | 由最后 tag 版本开头（如“3.2.1”），如从未 tag 则写“0”；而后接上“+”、版本控制器名称（如“git”）、提交日期及修订编号（如版本控制系统允许，还需附加短提交哈希值）；基本格式：`${VER}+${VCS_NAME}.r${REV_COUNT}[.${SHORT_HASH}]` [^1] | Nano 7f4c2c6a2556ecab6a8c2018a5f44b7fbdfc092d -> `VER=7.2+git20230602.r10185.7f4c2c6a` |

[^1] 对于 Git 仓库，您可以通过在本地仓库中运行如下命令自动补全 `+` 后的版本信息（请注意将 `[commit_hash]` 更改为对应的提交哈希值）：`echo git$(date --date="@$(git show -s --format=%ct [commit_hash])" "+%Y%m%d").r$(git rev-list --count [commit_hash]).$(git rev-parse --short [commit_hash])`.

### REL=

`REL=` 行（`$REL` 变量）定义软件包的修订号。此变量默认值为 0，在主版本 (`VER=`) 不变的情况下，每次修订应为该值递增 1。该规则的一个已知例外是 Linux 内核的 RC 版本标记法：此处我们使用 0.1, 0.2, 0.3, ... 的数值对应 RC 序号（`REL=0.2` 对应内核的 `-rc2` 版本），并使用 a, b, c, ... 作为同一 RC 版本下的修订号。如需引入其他规则例外，请提前与其他维护者讨论。

ACBS 在构建非 `stable` 分支软件包时也会在 `REL=` 追加 `~pre${ISO_8601-1_2019_TIMESTAMP}` 后缀，详见[《测试源内软件包迭代版本规范》](@/developer/packaging/topic-version-suffix.zh.md)。

更新软件包时应删除 `REL=` 行以将修订号复位为 0（此时一般做法是在 spec 中删除 `REL=`）。

### EPOCH=

`EPOCH` 行（`$EPOCH` 变量）定义软件包的“纪元”号，即 dpkg 在比较版本号时最优先比较的字段。此变量默认值为 0，在主版本 (`VER=`) 下降的情况下（例：从 `32.0` 降级到 `25.2`），每次修订应为该值递增 1。递增“纪元”值的作用是使降级包的实际版本号大于降级前的包（例：`1:25.2` 大于 `32.0`）。

## 源码文件

源码文件变量定义了软件源码的下载地址。对于使用了版本控制系统的软件，还额外定义了选取的快照。

### SRCS=

`SRCS=` 行（`$SRCS`）变量用于声明软件包要使用的各类文件，要求（或建议）遵守的规则如下。`SRCS=` 的写法请详见 [ACBS - Specification Files](https://wiki.aosc.io/developer/packaging/acbs/spec-format/) 一文。

| 项目 | 级别 | 应当采取的措施 |
|-------------|----------------------------------------|---------------------------------|
| 版本替换 | 要求 | 源码包地址中的所有软件包版本号必须替换为 `$VER` 变量。`$SRCS` 条目不应含有硬编码的版本号 |
| 源码包来源 | 要求 | 在可能的情况下尽可能使用官方推荐的源站或自动重定向设施，避免使用特定镜像站 |
| SourceForge 源码包 | 要求 | 遵从[官方指引](https://sourceforge.net/p/forge/documentation/Downloading%20files%20via%20the%20command%20line/)，在源码 URL 末尾保留 `/download`，如：`tbl::https://sourceforge.net/projects/wqy/files/wqy-microhei/${UPSTREAM_VER}/wqy-microhei-${UPSTREAM_VER}.tar.gz/download"` |
| 统一资源标识符 | 建议 | 尽可能使用 HTTPS（`https://`），避免使用 HTTP（`http://`）和 FTP（`ftp://`） |
| 源码包格式 | 建议 | 尽可能使用基于 XZ 压缩方案的压缩包（`.tar.xz`），其它格式也可接受，但尽量避免基于 BZip2 压缩方案的压缩包（`.tar.bz2`） |
| 平台自动生成的源码包 | 禁用 | 请勿使用各类托管平台（尤其是 GitHub 和 GitLab）自动生成的源码包，因为这些平台往往会重新生成源码包，导致校验值发生变化；请使用 `git::` 源码类型搭配 `commit=tags/...` 参数使用 |

### CHKSUMS=

`CHKSUMS=` 行（`$CHKSUMS` 变量）和 `$SRCS` 变量一起使用，以定义源码包应有的校验和，格式如下：

```
CHKSUMS="$ALGORITHM::$CHECKSUM $ALGORITHM::$CHECKSUM $ALGORITHM::$CHECKSUM $ALGORITHM::$CHECKSUM"
```

其中...

- `$ALGORITHM` 应该被替换成计算校验和所使用的哈希算法，例如 `sha256`（必须小写所有字母）。
- `$CHECKSUM` 应该被替换为使用上述哈希算法得到的源码包的校验和。

想要进一步了解哈希算法，请参阅 [Wikipedia 的相关页面](https://en.wikipedia.org/wiki/Cryptographic_hash_function#Cryptographic_hash_algorithms)。

该行一般使用 `abbs-update-checksum $PKGNAME` 自动填写。

### DUMMYSRC=

当一个软件包是虚包或元包，或者您希望自定义其源码来源时使用 `$DUMMYSRC` 变量。该变量接受一个布尔值。

### CHKUPDATE=

如有可能或适用，所有软件包均应标记 `CHKUPDATE=` 行（`$CHKUPDATE` 变量），具体写法请参阅 [AOSC Find Update 语法](https://github.com/AOSC-Dev/aosc-findupdate/blob/master/docs/config.zh-CN.md)一文。请尽可能使用 `anitya::` 检查类型。

### 其它变量

您还可以定义其它上面没有提到的变量，这些变量通常用于辅佐 `$SRCDIR` 变量，可以参考 `app-devel/netbeans` 的 `spec` 文件。

```
VER=8.2
REL=1
SUB=201609300101
SRCTBL="http://download.netbeans.org/netbeans/$VER/final/zip/netbeans-$VER-$SUB.zip"
SUBDIR=.
```

# 依赖项

在 AOSC OS，软件包的依赖项通常被分为两类，一类是运行时依赖，一类是构建时依赖。前者使用 `$PKGDEP` 变量，后者使用 `$BUILDDEP` 变量。

## 运行时依赖

运行时依赖的选择不应只考虑软件能否运行，只要是软件链接到的包都应该写进去。例如填写 `app-multimedia/ario` 的 `$PKGDEP` 除了填写：

`avahi, curl, dbus-glib, gnutls, hicolor-icon-theme, libglade, libmpdclient, libnotify, libsoup, libunique, taglib, xdg-utils`

以通过显式和隐式依赖关系，允许系统环境满足运行 `/usr/bin/ario` 的条件。根据 [E432](@/developer/packaging/qa-issue-codes.md#class-4-dependencies) 的规定，所有 ELF 级别的直接依赖项都应该被写进 `$PKGDEP`，这意味着您还需要为 `$PKGDEP` 补上一个 `dbus`。

### 备注

- 当一个软件包仅仅直接依赖 GCC Runtime（`gcc-runtime`）或 GNU C Library（`glibc`），这些依赖也应该写入 `$PKGDEP`。

## 构建时依赖

构建时依赖的选择应该要保证软件包在 BuildKit 构建环境中正常编译、安装和打包。BuildKit 环境中已经包含的任何包都不需要再包含在 `$BUILDDEP` 中，例如：

- 构建 `app-devel/extra-cmake-modules` 需要 CMake（`CMake`）。但是，`cmake` 已经是 BuildKit 包含的一部分。因此，打包程序不需要在 `$BUILDDEP` 中包含 `cmake`。
- 构建 `app-scientific/tensorflow` 需要 Bazel（`bazel`）。因为 `bazel` 不被包含在 BuildKit 中，所以 `$BUILDDEP` 必须填写 `bazel`。

# 软件包功能

在为 AOSC OS 打包时，请遵循我们的 [发行版特性清单](@/aosc-os/is-aosc-os-right-for-me.md)。下表列出了打包者需要注意的一些事项。

| 项目 | 应当采取的措施 |
|-------------------------|---------------------------------|
| 功能与特性 | 启用所有功能，除非某个功能未被维护，或违反了此表中的任何其他注意事项 |
| 语言包 | 语言包必须与主要的可执行文件放置在同一个软件包中 |
| 分包 | 除非某个软件有多个派生，或者得到大多数开发者的同意，否则不能拆分软件包 |
| 遥测 | 默认情况下，必须删除或禁用所有遥测功能，非特殊情况不接受无法删除或禁用遥测功能的软件包 |
| API 及开发者文档 | 除有具体软件内置功能需要（如 Qt Creator），原则上不默认安装 gtk-doc、API（HTML, PDF 等）、Doxygen 文档 |

# 脚本编写

大多数软件包可以使用 [Autobuild 内置的类型](https://github.com/AOSC-Dev/autobuild4/tree/master/templates)（`$ABTYPES`）进行构建，通常补丁也只需要放在 `autobuild/patches` 目录就能被自动添加（还可以通过定义 `series` 指定打补丁的顺序），但是有些程序包依然需要手工的准备、打补丁和构建。本节专门介绍 `autobuild/` 目录下的 `prepare`、`patch`、`build` 和 `beyond`。

编写这样的脚本的最佳实践通常包括给变量加引号、在合适的地方加注释、有周全的异常处理、考虑各个架构的差异、提供进展报告等等。编写既易于阅读又可靠的构建脚本并不容易，下表旨在帮助您写出这样的脚本。

| 项目 | 级别 | 应当采取的措施 |
|-------------|----------------------------------------|----------------------|
| Autobuild 构建模板 | 要求 | 应尽可能使用 [Autobuild Types](https://github.com/AOSC-Dev/autobuild4/tree/master/templates)，而不使用 `autobuild/build` 或 `ABTYPE=self` |
| Autobuild 构建模板定义 | 要求 | 所有软件包均应显式标记所使用的 Autobuild 构建模板（`ABTYPE=`)  |
| 异常处理 | 要求 | 异常应被及时捕获并处理。 |
| 进展报告 | 要求 | 应该通过适当地使用 `abinfo` 和 `abwarn` 来报告进度，这对于使用 `autobuild/build` 或 `ABTYPE=self` 的软件包是必需的 |
| 详尽输出 | 要求 | 构建脚本应打开所有命令的详尽输出开关以便通过构建日志查错 |
| 绝对路径 | 要求 | 构建脚本应为所有引用的源码内文件、路径和可执行文件增加构建根 (`$SRCDIR`)、打包根 (`$PKGDIR`) 或离树构建 (shadow build) 根 (`$BLDDIR`)；如果您在构建时已切换 (`cd`) 到某个路径中，则可忽略该项 |
| 符号链接 | 要求 | 创建符号链接时请使用相对路径引用其他系统内文件，以免在其他系统访问系统根时污染其中文件 |
| 引用与参考来源 | 要求 | 如果您的构建脚本从其他发行版改编而来，则需要提供一段注释表明构建脚本的来源 |
| 变量 | 要求 | 变量需要用引号括起来，例如 `"$SRCDIR"` 和 `"$PKGDIR"` |
| 架构 | 要求 | 除非通过 `$FAIL_ARCH` 变量限制了某软件包的支持架构，构建脚本应在所有受支持架构上进行测试 |
| FIXME 注释 | 要求 | 打包时遇到的所有问题和临时解决方法前必须使用 `# FIXME:` 注释说明原因；如有可能，请在注释后附加简略的出错日志 |
| 其他注释 | 建议 | 好的脚本都会有好的注释，当然注释可以用进度报告语句代替，详见“进度报告” |
| 内建宏 | 建议 | 请尽可能多地使用如 `ab_apply_patches` 和 `ab_match_arch` 等内建宏以便简化脚本 |
| 行宽 | 建议 | 请尽可能将脚本单行宽度限制到 80 字符以内以便其他人阅读 |

# 补丁命名

在将补丁添加到 `autobuild/patches/` 之前，请为您的补丁按照统一且可排序的规则命名。

## 基于 Git 的源码仓库

对于基于 Git 的源码仓库，可以通过以下命令创建带有编号的补丁：

```
git format-patch -n $HASH
```

`n` 定义了自 `$HASH` 这个提交前选取多少个提交（含）。您还可以省略 `$HASH`：

```
git format-patch -n
```

以从 `HEAD` 往前选取 `n` 个提交（含）制作补丁。

生成的补丁的名字大致是这样子的：

```
0001-contrib-autobuild-aoscarchive-one-more-syntax-fix.patch
0002-common_switches-add-sanitizer-support.patch
0003-contrib-autobuild-aoscarchive-fix-overlay-subdir-che.patch
0004-arch-_common_switches-fix-syntax.patch
0005-autobuild-aoscarchive-adapt-to-new-workflow.patch
```

## 其它情形

如果上面自动生成补丁的方式不适用，那么应以下面的格式为您的补丁命名：

```
NNNN-$CATEGORY-$CONTENT.patch
```

其中：

- `NNNN` 与前面的示例补丁名称一样，是用于为补丁排序的“序列号”。
- `$CATEGORY` 定义了补丁的类别，例如 `bugfix`、`feature` 等。
- `$CONTENT` 定义了补丁的作用，例如 `fix-build-with-openssl-1.1`。

同样，当添加来自其它发行版的补丁时，也应根据上述规则对补丁重命名。

# 文件放置

和其它 Linux 发行版类似，AOSC OS 希望打包好的文件能被解压到合适的目录中。请参考下面的表格，了解我们的文件放置标准。

| 文件类型 | 合适的放置位置 |
|-----------------------|---------------------------------------|
| 可执行文件 | `/usr/bin` |
| 被其它程序调用的二进制文件 | `/usr/libexec`（除非文件位置被硬编码） |
| 数据文件 | `/usr/share` |
| 守护进程 | `/var/lib/$COMPONENTNAME`（`$COMPONENTNAME` 根据实际情况指定，例如 `/var/lib/lightdm`） |
| Go 组件和共享数据 | `/usr/share/gocode` |
| 头文件 | `/usr/include` |
| Java 组件 | `/usr/share/java` |
| 共享库文件 | `/usr/lib` |
| 许可证 | `/usr/share/doc/$PKGNAME` |
| Manpage | `/usr/share/man` |
| 文档 | `/usr/share/doc/$PKGNAME` |
| 私有库文件 | `/usr/lib/$COMPONENTNAME`（`$COMPONENTNAME` 根据实际情况指定，例如 `/usr/lib/R`） |

## 基于 Electron 或 Chromium 的软件包

Electron、Chromium 和基于它们的软件包应该按照下面的要求放置文件。

| 文件类型 | 合适的放置位置 |
|---------------------|----------------------------------------|
| 可执行文件 | `/usr/bin` 放置指向 `/usr/lib/$PKGNAME` 目标文件的符号链接 |
| 数据文件 | `/usr/share` |
| 主程序 | `/usr/lib/$PKGNAME` |

## 二进制包

二进制软件应该安装到 `/usr` 而不是 `/opt`。如果软件许可证禁止这样做或者在打包时发现无法做到，则应考虑拒绝此类软件包。

打包二进制包时，应在 `defines` 文件中声明 `ABSTRIP=0` 以禁用 Stripping。

# Git 提交信息

在为 [AOSC OS ABBS Tree](https://github.com/AOSC-Dev/aosc-os-abbs/) 提交（或贡献）更改时，请按照下面的要求填写提交信息：

| 情形 | 格式要求 | 举例 |
|-----------|-----------------------------------|-----------------------------------------|
| 引入新的软件包 | `$PKGNAME: new, $PKGVER` | `windowsnt-kernel: new, 5.1.2600` |
| 版本更新（安全更新） | `$PKGNAME: security update to $PKGVER` | `firefox: security update to 142.0`，并在该提交所属 GitHub PR 的 Development 侧边栏中勾选对应的安全更新工单（GitHub Issue） |
| 非版本更新（安全更新，使用补丁） | `$PKGNAME: fix $CVEID` | `samba: fix CVE-2025-0620`，并在该提交所属 GitHub PR 的 Development 侧边栏中勾选对应的安全更新工单（GitHub Issue） |
| 版本更新 | `$PKGNAME: update to $PKGVER` | `mate-desktop: update to 1.22.0` |
| 软件构建失败 | `$PKGNAME: ... (FTBFS)` | `chromeos-desktop: update to 99.0.9999 (FTBFS)`，FTBFS 是 Failed To Build From Source 的简写 |
| 软件包改动（单处） | `$PKGNAME: ...` | `kde-workspace: add qt-5 dependency`，使用一般现在时即可 |
| 软件包改动（使用发行版补丁） | `$PKGNAME: ($DISTNAME patch[es], $CHANNEL) ...` | `qt-4: (Arch Linux patches) rebuild for openssl` |
| 软件包改动（使用上游补丁） | `$PKGNAME: (upstream patch[es]) ...` | `kodi: (upstream patch) fix lock-up on start-up` |
| QA 问题 | `$PKGNAME: ... ($ISSUECODE)` | `psiconv: rebuild for imagemagick (E431)`，请阅读 [这个清单](@/developer/packaging/qa-issue-codes.md) 了解各个 `$ISSUECODE` 对应的含义 |
| 软件包改动（针对某个架构） | `$PKGNAME: ... ($ARCH)` | `google-chrome: new, 100.0.9999.999 (amd64)` |
| 软件包改动（不针对任何架构） | `$PKGNAME: ... (noarch)` | `mate-common: update to 1.22.0 (noarch)` |
| 软件包退休（不再维护） | `$PKGNAME: drop, orphaned` | `nano: drop, orphaned`[^1] |

[^1]: 这个包曾因疏忽惨遭[退休](https://github.com/AOSC-Dev/aosc-os-abbs/pull/4412)，后由 [f2060c05da3264c24f0b4e93f6eaa8d1b570d6dd](https://github.com/AOSC-Dev/aosc-os-abbs/commit/f2060c05da3264c24f0b4e93f6eaa8d1b570d6dd) 将其复原。

## 长消息

如果您的提交信息超过 50 个字符（包括空格和标点符号），或者在一个提交中进行了多处改动，则应该使用下面的格式撰写长消息：

```
syncthing: update to 2.0.3

- Use gomod template to build.
```
