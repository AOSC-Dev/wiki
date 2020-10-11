+++
title = "ACBS - 安装"
+++

安装
====

开始
----

ACBS 可以被部署到任何您认为合适的目录中，只需执行 `acbs-build.py` 即可开始安装。在此之前，您需要先安装下文提到的 [依赖项](@/developer/packaging/acbs/install.zh.md#yi-lai-xiang)。您可能还需要为 ACBS 创建一个配置文件，虽然这不是必须的，但我们强烈建议您这么做。

如果您在使用 AOSC OS，可以使用软件包管理器安装 ACBS：

    sudo apt install acbs

你也可以在 GitHub 取得 ACBS 的源码：<https://github.com/AOSC-Dev/acbs/>。如果您不希望使用 `git` 拉取代码，您可以通过 <https://github.com/AOSC-Dev/acbs/archive/staging.zip> 直接下载。

依赖项
-----

<div id="Mandatory dependencies">

强制依赖项：

</div>

-   Python 3 (\>= 3.6)：程序运行的基石。
-   GNU File (libmagic)：文件类型侦测。
-   LibArchive (bsdtar)：压缩文件管理。
-   GNU Wget or Aria2：源码包获取。
-   [Autobuild3](https://github.com/AOSC-Dev/autobuild3)：软件包构建。

<div id="Optional dependencies">

可选依赖项[1]：

</div>

-   libmagic：侦测文件类型的 Python 模组。
-   pycryptodome：检查校验和的 Python 模组。
-   pexpect: 模拟 PTY 会话并将输出记录到文件中的 Python 模组。 

初始化配置
--------

ACBS 使用了类 INI 配置文件以定义需要使用到的树，配置文件储存在 `/etc/acbs/forest.conf`。

下面是一个最简单的配置示例：

    [default]
    location = /usr/lib/acbs/repo

您可以在配置文件中使用变量：

    [vars]
    base = /mnt

    [default]
    location = ${vars:base}/aosc-os-abbs

默认情况下，ACBS 会构建 `[default]` 所定义软件包树中的软件包。您可以通过使用 `-t <tree name>` 参数覆盖默认行为。

[1] 安装可选依赖项可以增强 ACB 的功能，您可以在 PyPI 获取这些依赖。