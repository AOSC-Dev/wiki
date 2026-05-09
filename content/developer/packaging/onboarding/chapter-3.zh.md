+++
title = "第三章：Ciel 打包环境"
weight = 3
[taxomonies]
tags = [ "onboarding" ]
+++

[ciel-git]: https://github.com/AOSC-Dev/ciel-rs
[aosc-os-abbs]: https://github.com/AOSC-Dev/aosc-os-abbs

[Ciel!](https://github.com/AOSC-Dev/ciel-rs) 是专为安同 OS 开发打造的容器管理器，负责管理容器并发起打包作业，使用起来极其方便。Ciel 使用单独的工作区存放开发环境、源码及 ABBS 树。每当您发起打包时，Ciel 会自动回滚容器，挂载所需目录，启动容器并执行 ACBS，发起打包作业。在本章内，您将学会如何使用 Ciel 工具打包及管理容器，并打出第一个软件包。

Ciel 容器的基本系统为安同 OS 构建环境 (BuildKit)。BuildKit 是专门用于构建软件包的标准环境，由基础版加上常用开发及构建工具（编译工具链、常用构建系统、ACBS、Autobuild 等）得到。您可以通过 Ciel 更新底层系统，避免每次打包前耗费时间更新系统。

# Ciel 的功能

Ciel 作为面向用户的顶层工具，是开发者手动发起打包的主要方式。Ciel 主要的功能如下：

- 工作区隔离：系统中可以存在多种 Ciel 工作区，每个工作区内的容器可以单独运行
- 容器化管理：Ciel 将打包环境容器化，可任意操作及回滚，轻松实现打包环境的维护，维持打包环境的一致性
- 源码及软件包缓存：打包时可缓存其源代码及依赖的 deb 包，节省网络流量
- 虚拟沙盒环境：Ciel 容器环境内可随意装卸软件及执行危险操作，出错后可直接利用回滚机制撤销操作
- 一键打包：使用 `ciel build` 命令即可自动启动打包环境发起打包，免去手动调用的烦恼
- 错误调试：打包出错时可进入打包环境检查错误原因并重试

{% card(type="tips") %}
由于 Ciel 需要调用系统的容器相关功能，因此需要使用 root 身份才能运行 Ciel 工具，或使用 sudo 命令运行。
{% end %}

# 安装 Ciel

### 安同 OS

如果您正在使用安同 OS 环境，可直接运行下列命令安装 Ciel 工具：

```
oma install ciel
```

### 其他系统

由于其他系统并没有打包 Ciel，您需要自行编译该工具。由于正文篇幅限制，针对其他系统的 Ciel 编译步骤请见附录 A。

# 初始化工作区

为了能在系统中同时存在多个开发环境，Ciel 使用专门的文件夹（“工作区”）单独存放开发环境、ABBS 树、工作区配置信息等内容。每个工作区相互独立，彼此不影响。初始化工作区时会下载并解压系统镜像，以及克隆 ABBS 仓库。请确保您可以正常连接 GitHub 和安同 OS 软件源服务器。

您可以创建一个专门存放 Ciel 工作区的文件夹：

```sh
~ $ mkdir ~/ciel
~ $ cd ~/ciel
```

新建一个 Ciel 工作区文件夹：

```sh
~/ciel $ mkdir amd64
~/ciel $ cd amd64
```

在本文件夹内初始化一个工作区：

```sh
~/ciel/amd64 $ sudo ciel new
```

此时 Ciel 会启动向导式的界面，该界面会询问您几个问题。

首先是架构选择。您可以安装其他架构的容器，默认高亮的选项是您机器的架构，如在 x64 机器上运行时默认就会指向 amd64：

![ciel new 最初界面](/img/onboarding-guide/ciel-new-init.webp)

使用上下方向键选择，回车键确认。您在这一步应直接敲回车键继续，然后 Ciel 会询问您维护者信息：

![ciel new 询问维护者信息](/img/onboarding-guide/ciel-new-name.webp)

以 `English Name or Nickname <email@example.com>` 的格式输入维护者信息，按回车确认。Ciel 接下来会询问是否启用 DNSSEC：

![ciel new 询问 DNSSEC](/img/onboarding-guide/ciel-new-dnssec.webp)

此类询问是与否的对话可以按下<kbd>Y</kbd>回答 “是”，按<kbd>N</kbd>回答 “否”，或者按回车以默认值继续。在这里您应该回答 “否”，或直接按回车继续。

接下来 Ciel 会询问是否编辑系统内的软件源信息：

![ciel new 询问是否修改软件源](/img/onboarding-guide/ciel-new-sources-list.webp)

默认选用的软件源信息是安同 OS 官方软件源。如果您想使用镜像源，您可以在这里回答 “是”，Ciel 会启动 Nano 编辑器供您编辑容器内系统的 `/etc/apt/sources.list`（图中已经将官方源改为[清华大学 TUNA 镜像站](https://mirrors.tuna.tsinghua.edu.cn/help/anthon/ "北京外国语大学镜像源")：

![ciel new 修改软件源](/img/onboarding-guide/ciel-new-edit-sources.webp)

{% card(type="tips") %}
- 如果您不能正常连接安同 OS 官方软件源，您必须在这里切换其他软件源。
- 编辑镜像源时需要注意，您应从下列**实时从官方源同步**的镜像源中选择一个，以保证手动打包时能获取到最新版本的依赖：
  - 安同 OS 官方源 `https://repo.aosc.io/debs`
  - 清华大学 TUNA 镜像站 `https://mirrors.tuna.tsinghua.edu.cn/anthon/debs`
  - 吉林大学开源镜像站 `https://mirrors.jlu.edu.cn/anthon/debs`
  - 兰州大学开源镜像站 `https://mirrors.lzu.edu.cn/anthon/debs`
  - 南阳理工学院开源镜像站 `https://mirror.nyist.edu.cn/anthon/debs`
  - 南京大学开源镜像站 `https://mirror.nju.edu.cn/anthon/debs`
{% end %}

依次按下 <kbd>Ctrl</kbd>+<kbd>O</kbd>、回车及<kbd>Ctrl</kbd> + <kbd>X</kbd>，保存退出。

如果您不想修改软件源，可以直接按回车继续。Ciel 接下来会询问是否在本地缓存软件源码：

![ciel new 询问是否缓存源码](/img/onboarding-guide/ciel-new-source-caching.webp)

源码缓存用于缓存软件源代码，避免每次打同一个包时频繁下载源码，从而在打包时节省网络流量。因此，除非您的硬盘空间非常紧张，否则应该保持启用。因此您应该在这里回答 “是”，或直接按回车继续。接下来 Ciel 会询问是否启用本地软件包缓存：

![ciel new 询问是否启用本地软件包缓存](/img/onboarding-guide/ciel-new-local-repo.webp)

同样地，本地软件包缓存用于缓存在打包时安装的依赖，同样有助于在打包时节省流量。启用与否取决于您与软件源连接速度的快慢。如果拿不准，请回答 “是”。接下来 Ciel 会询问是否针对 ABBS 树中的不同分支使用不同的输出目录：

![ciel new 询问是否为每个测试源单独创建输出目录](/img/onboarding-guide/ciel-new-dedicated-output.webp)

由于 ABBS 树中存在许多分支，这些分支中的开发几乎是同时进行的，因此为了避免相互影响，Ciel 默认区分不同分支的输出目录。您应回答 “是”，或者直接按回车继续。Ciel 接下来会询问是否启用一次性模式：

![ciel new 询问是否启用一次性模式](/img/onboarding-guide/ciel-new-volatile.webp)

Volatile Mode（一次性模式）是 Systemd nspawn 容器的功能，使用一次性模式启动的容器会在容器关机时丢失所有容器内的修改。由于兼容性原因以及与现有工作流冲突，您不应该启用一次性模式。请在这里回答 “否”，或直接按回车继续。Ciel 接下来会询问是否将 APT 作为默认的包管理器：

![ciel new 询问是否强制默认使用 APT](/img/onboarding-guide/ciel-new-force-apt.webp)

由于安同 OS 默认首选 oma 包管理器，同时 oma 相对于 APT 具有许多优点，因此建议您在这里回答 “否” 或直接按回车继续。Ciel 接下来会询问您是否需要立刻创建新容器：

![ciel new 询问是否要添加新实例](/img/onboarding-guide/ciel-new-add-instance.webp)

您可以回答 “是”，然后给新容器起一个名字。如果您现在不想创建新容器，请回答 “否”：

![ciel new 询问新实例的名称](/img/onboarding-guide/ciel-new-instance-name.webp)

容器名字应使用英文字母、数字和短横线 (`-`) 组合。起好名字后，按下回车确认。

此时容器初始化期间的问题已经收集完毕，Ciel 即开始下载安装 BuildKit：

![Ciel 正在下载标准构建环境](/img/onboarding-guide/ciel-new-settingup.webp)

系统安装完毕后，Ciel 会在工作区的 `TREE` 目录中克隆一份 ABBS 树：

![Ciel 正在检出 ABBS 树](/img/onboarding-guide/ciel-new-checkout.webp)

如果您看到如下图中的提示信息，则说明工作区已经初始化完毕了：

![ciel new 执行完毕](/img/onboarding-guide/ciel-new-finish.webp)

{% card(type="tips") %}
如果您在下载系统或克隆仓库期间遇到网络错误，请参考附录 A 中的相应步骤手动初始化 Ciel 工作区。
{% end %}

恭喜您，您成功迈出了安同 OS 开发的第一步！

## 工作区目录结构

完整的工作区目录结构如下：

`ciel-amd64/`: 工作区所属文件夹
- `.ciel/` - 隐藏的 Ciel 工作目录，存放基本系统、运行时状态及配置信息
- `CACHE/` - 源码缓存目录，存放打包时下载过的源码；内容均以 sha256 哈希值命名
- `SRCS/` - 软件包缓存目录，存放打包时下载的依赖软件包
- `OUTPUT-*/` - 根据 ABBS 分支命名的输出目录，用于存放针对对应 ABBS 分支构建输出的 `.deb` 软件包；如 `OUTPUT-stable/` 即为 stable 分支的输出目录
- `TREE/` - ABBS 树所在目录
- `main/` - 以容器名命名的容器系统文件夹，在容器启动时创建

# 更新容器的底层系统

Ciel 允许您更新容器的底层系统，以保证底层系统的软件包处于最新状态。由于每次发起打包前都会先运行一次系统更新，为了节省系统更新的时间，您必须定期更新容器的底层系统。

同时，由于初始化容器时下载的系统是预先打包好的，因此工作区内的系统会在一定程度上和当前最新的软件源脱节。您应该在初始化容器后更新一次系统。

您可以在任意 Ciel 工作区内运行如下命令更新底层系统：

```sh
~/ciel/amd64 $ sudo ciel update-os
```

![更新 Kiel 容器](/img/onboarding-guide/ciel-update-os.webp)

更新容器底层系统

![更新 Ciel 容器](/img/onboarding-guide/ciel-update-os-finish.webp)

底层系统更新完毕

{% card(type="tips", title="别忘了") %}
记得常回来看看，定期更新容器的系统！
{% end %}

# 构建第一个软件包

确保工作区的系统为最新状态后，就可以发起打包作业了！您可以前往工作区的 `TREE` 目录寻找感兴趣的软件包，然后运行如下命令发起打包作业：

```
~/ciel/amd64 $ sudo ciel build -i instance-name package1 package2 ...
```

假设容器名字叫 `main`，以大家经常会用的进程管理器 htop 为例，运行 `sudo ciel build -i main htop`：

![Ciel 容器构建开始](/img/onboarding-guide/ciel-build-start.webp)

经过些许高温炙烤，就会构建出 htop 的 `.deb` 软件包：

![Ciel 容器构建完成](/img/onboarding-guide/ciel-build-finish.webp)

由 Ciel 构建的软件包会存放在 `OUTPUT-分支名/debs` 目录中：

![Ciel 容器构建输出](/img/onboarding-guide/ciel-build-output.webp)

恭喜您，您已经成功构建出第一个软件包！快用 `oma` 安装一下试试看吧 (`oma install ./OUTPUT-stable/debs/h/htop_3.4.1-0_amd64.deb`)！

{% card(type="tips") %}
Ciel 会在编译成功后主动回滚容器，以保证每次打包时的容器系统清洁（无任何额外的软件包）。每次打包成功后，只会将产出的 `.deb` 包存放在 OUTPUT 目录中。

因此，您在打包成功后进入 Shell 环境时，无法进入打包时使用的构建目录。
{% end %}

# 进入容器的 Shell 环境

您可以利用 Ciel 提供的容器 + overlayfs 功能，在容器内执行任何毁灭性操作，并在这之后回滚容器。如您有需要，可以直接启动 Ciel 工作区内的实例并进入实例的 Shell 环境：

```
ciel shell -i 实例名称
```

![进入 Shell 环境](/img/onboarding-guide/ciel-shell.webp)

Ciel 所使用的容器环境叫做 BuildKit。BuildKit 集成了常用的构建工具链（类似于 Debian 的 `build-essential`），以及安同 OS 开发工具链（Autobuild 及 ACBS）。Ciel 在启动容器时会映射一些文件夹，便于与容器外界交互：

| 容器外 Ciel 工作区目录 | 容器内挂载点 | 描述 |
| :----: | :----: | :----: |
| `TREE` | `/tree` | ABBS 树 |
| `OUTPUT-分支名` | `debs` | ACBS 构建作业产生的 deb 包 |
| `SRCS` | `/var/cache/acbs/tarballs` | ACBS 源码缓存目录 |

# 回滚 Ciel 容器

在您使用完当前工作区的容器后，需要您将该容器还原至初始状态。还原容器可以使用 `ciel rollback` 命令：

```
ciel rollback [-i 实例名称 [...]]
```

![回滚 Ciel 容器](/img/onboarding-guide/ciel-rollback.webp)

# 添加或删除新的实例

您的 Ciel 工作区内可以存在多个实例，每个实例共享底层系统、`TREE`、`SRCS` 及 `OUTPUT` 目录，且每个实例可独立运行。

要添加新的实例，请使用 `ciel add` 命令。删除实例则需使用 `ciel del` 命令。

```sh
ciel add test # 添加名为 test 的实例
ciel del test # 删除名为 test 的实例
ciel list # 列出当前工作区内的实例
```

添加新的实例后，您就可以使用新的实例发起构建或使用新实例的 Shell 环境了：

![Ciel 实例](/img/onboarding-guide/ciel-instances.webp)

# 总结

Ciel 掌管工作区内的容器化开发环境，是安同 OS 开发工作流中的最外层。

- Ciel 负责启动、停止、回滚、更新容器内的开发环境 BuildKit。
- Ciel 可以快捷地发起编译，并且会将构建输出文件夹、ABBS 仓库等映射至容器内，方便容器内外交互。
- 手动编译时需要使用 `ciel build` 命令发起编译。
- 可以使用 `ciel add` 及 `ciel del` 命令在工作区内添加或删除实例。
