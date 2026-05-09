+++
title = "第四章：为 ABBS 添砖加瓦"
weight = 4
[taxonomies]
tags = ["onboarding"]
+++

[aosc-os-abbs]: https://github.com/AOSC-Dev/aosc-os-abbs

每个发行版都需要管理并合理组织自己的打包信息和脚本。安同 OS 管理打包信息的机制主要分为两部分，一端是由 Git 管理的软件包信息树 ABBS，一端是负责下载源码并发起构建的 ACBS。在安同 OS 的构建流程中，Ciel 只用于负责启动构建容器并运行 `acbs-build`。

# 什么是 ABBS？

ABBS 是安同 OS 管理和组织打包脚本的 Git 仓库，利用 Git 来处理和记录安同 OS 中所有打包脚本的变动。由于 ABBS 采用树状的组织方式，因此经常称其为 “ABBS 树”。

![image](https://hackmd.io/_uploads/HynGhE42A.png)

<p style="text-align: center">
    <i>ABBS 树的 GitHub 页面</i>
</p>

您可以前往 [ABBS 树的 GitHub 页面][aosc-os-abbs]浏览 ABBS 树的内容。您也可以把 ABBS 树克隆到您的电脑上：

```sh
# 使用 HTTP 协议
git clone https://github.com/AOSC-Dev/aosc-os-abbs.git
# 或使用 SSH 协议
git clone git@github.com:AOSC-Dev/aosc-os-abbs.git
```

{% card(type="tips") %}
可前往附录 B 参考关于 ABBS 相关的 Git 使用技巧。
{% end %}

## 组织方式

ABBS 树内的软件包分两层组织：最上层为软件包类型及应用场景，接下来是软件包本身。其中，软件类型包括：

- `app`: 以应用程序为主的软件。
- `core`: 安同 OS 的核心组件（GCC 编译器、GNU glibc 运行库及其依赖）
- `runtime`: 以运行时的共享库为主的软件。
- `lang`: 编程语言相关的软件（编译器、包管理器等）
- `desktop`: 桌面环境相关的应用程序、运行库等。
- `meta`: 元包（Metapackages，只记录了依赖信息、没有实际内容的软件包）

除了一些顾名思义的分类外，ABBS 针对 `app` 和 `runtime` 细分了一些软件分类：

- `admin`: 系统管理工具
- `a11y` (Accessibility): 辅助性工具（针对视障、听障等人士使用电脑的软件，又叫可访问性工具）
- `benchmarks`: 评测工具
- `cryptography`: 加密相关的程序
- `database`: 数据库服务端
- `doc`: 文档生成工具
- `devel`: 开发工具（编译器、链接器等）
- `editors`: 文本编辑器
- `emulation`: 各类设备（游戏主机、其他硬件设备等）的模拟器
- `i18n` (Internationalization): 国际化相关的软件（翻译软件等）
- `productivity`: 生产力工具（办公套件等）
- `scientific`: 科学计算工具
- `utils`: 实用工具（文件管理工具、压缩解压缩工具等）

## 仓库的目录结构

所有软件包的打包脚本按照分类分别存放。下面将详细介绍软件包的组织方式。

```
+ aosc-os-abbs/ # 仓库根目录
  + 软件类型-软件分类/` # 一级分类文件夹，如 `app-admin`
    + 软件包名称/       # 存放软件包源码信息及 `autobuild` 文件夹，如 `shadow`
      - spec            # 软件包版本及源码信息
      + autobuild/      # 打包脚本所在文件夹
        - beyond
        - defines
        - prepare
```

大多数软件包只包含一套打包信息。但有时软件包文件夹下会存在不止一套 Autobuild 打包信息：这说明该软件项目被拆分为多个子软件包。

## 拆包时的目录结构

有些软件包既有日常使用期间一定会依赖到的运行库，也包含日常用不到的部分。即便安同 OS 奉行 “不拆包” 的概念，但此类软件包不拆包是不现实的。以 GCC 为例，GCC 包含平时一定会依赖的编译器运行时，但用户日常使用期间没有必要安装完整的 GCC 编译器套件。

在这种情况下，必须拆分 GCC，将其拆分为运行时和编译器两部分。被拆包的软件的目录结构一般如下：

```
+ aosc-os-abbs/         # 仓库根目录
  + core-devel/         # GCC 所属分类（核心组件—开发工具）
    + gcc/              # GCC 的打包信息所在文件夹
      - spec            # GCC 的源码及版本信息
      + 01-runtime/     # 拆分的第一个软件包的 `autobuild` 文件夹（GCC 运行时库）
        - beyond
        - build
        - defines
        - prepare
      + 02-compiler/    # 拆分的第二个软件包的 `autobuild` 文件夹（GCC 编译器本体）
        - build
        - defines
        - prepare
```

{% card(type="warning", title="注意细节") %}
GCC 身为编译器，在用户的日常使用场景中不会用到。但 GCC 的运行时库（`libgcc`、 `libstdc++` 等）却是几乎所有 C 和 C++ 语言编写的程序的依赖。

其他 C 和 C++ 语言的编译器也是如此，如 Clang 有一套自己的 C++ 运行时 `libc++`，但在大多数默认使用 GCC 的 Linux 发行版中，Clang 编译 C++ 程序时依旧会链接 `libstdc++`。
{% end %}

## ABBS 的提交准则

安同 OS 采用基于测试源维护机制，因此安同 OS 的开发极度依靠 Git 的分支管理机制。所有改动最终都会合并到 `stable` 分支，又称为 “稳定源” 及 “主线”。`stable` 分支记录着最终分发给广大用户的软件包的构建信息。

ABBS 不允许直接将软件包改动推送至 `stable` 分支。您必须先基于当前最新的 `stable` 分支派生出新的分支（测试源），并在测试源中提交相应改动。经过一系列测试及审阅后，测试源的修改才能进入 `stable` 分支。

ABBS 始终保持线性的提交历史，因此仓库中不允许使用 `git merge` 等会创建 Merge Commit 的形式合并分支。所有的测试源最终都会变基 (Rebase) 到 `stable` 分支，然后将 `stable` 分支快进，完成合并，同时保留分支内的提交历史。

不过，出于种种原因，测试源分支内的杂乱提交可能需要整理，此时您可以随意变基分支。变基分支会产生本地和远端仓库之间的分歧，因此所有的测试源分支均允许强制推送 (Force push)。

# ACBS 介绍

ACBS 全称 Autobuild CI Build System，是安同 OS 打包环节中的第二环，负责根据 ABBS 树记录的信息发起构建，即调用 Autobuild。具体地讲，ACBS 主要负责以下内容：

- 读取软件包的源码信息和依赖
- 根据依赖信息决定构建序列
- 下载并解压缩源码包
- 复制对应包的构建脚本目录 (`autobuild`) 到源码目录中
- 进入源码目录，调用 Autobuild4
- 等待 Autobuild4 执行完毕，将软件包复制到输出文件夹

# 使用 ACBS 发起构建

## 启动并进入 Ciel 容器环境

进入 Ciel 工作区目录，运行 `ciel shell` 命令进入容器实例的 Shell 环境：

```sh
cd ~/ciel/amd64
sudo ciel shell -i main
```

## 发起构建

```shell
# acbs-build 软件包名称
```

![acbs-build 构建完成](/img/onboarding/acbs-build-finish.webp)

<p style="text-align: center; font-style: italic">
    <code>acbs-build bash</code> 的执行结果
</p>

由上图可见，ACBS 会自动将产出的 `deb` 包复制到容器内的 `/debs` 文件夹中，也就是容器外的 `OUTPUT-<分支名称>` 文件夹。

# 添加软件包

安同 OS 的所有软件包打包脚本均位于 ABBS 树中。您需要在 ABBS 树中的合适位置添加软件包的定义。添加新软件包一般需要经过以下步骤：

1. 调查软件项目，获得软件的最新版本；
2. 调查软件项目，获得稳定的源码包下载链接及源码包校验信息；
3. 在 ABBS 中的合适位置新建文件夹；
4. 编写软件包源码信息 `spec`；
5. 编写 Autobuild 定义文件及打包脚本；
6. 打包测试，根据情况调整打包定义。

本节中仅介绍如何在 ABBS 树内新建文件夹及编写源码信息。

## 调查软件的源码获取途径

在您着手打新软件包前，您需要先了解获取软件源码的途径。一般情况下，您可以通过如下方式找到源码：

大部分知名软件都有自己的项目主页，且有自己的下载页面，发行的源代码通常也可以在站内直接下载到：
- 有些软件有自己的域名。如 86Box 注册了 86box.net
- 有些软件属于某个项目的一部分，因此可能没有自己的域名。如 GNU Emacs 是 GNU 项目的一部分，因此 Emacs 和其他 GNU 项目一样都在 gnu.org 下

托管项目代码的托管平台所对应的仓库页面。一些项目可能没有官网，取而代之的是项目在各大代码托管平台的仓库，可以直接使用对应的版本控制软件克隆到本地：
- GitHub：定位项目的链接一般遵循 `https://github.com/用户或组织/项目名称` 的格式。
- GitLab：定位项目的链接一般遵循 `https://gitlab.com/用户或组织/项目名称`、`gitlab.com/用户或组织/子项目/项目名称` 的格式。GitLab 允许在用户或组织的名下继续分类。
- cgit 或 gitweb：克隆仓库的链接会显示在仓库的主页（Summary）上。
- 有些软件有自己的官网，但其源码则托管在代码平台上。一般官网会给出源码的下载链接，但有些下载链接也会将您引导到代码托管平台的 Releasses 页面。

![image](/img/onboarding/cgit.webp)
<p style="text-align: center; font-style: italic">
    cgit 的使用场景之一就是 Linux 内核的 Git 网页前端
</p>

## 通过官网获得源码压缩包

绝大多数软件均会以压缩包（俗称 “tarball”，源码一般会以 tar 格式打包后压缩）的形式发布。Tarball 的获取途径一般是软件官网的下载页面。软件官网一般会将最新版本的发布说明或源码下载链接放置在首页或 “Downloads （下载）” 页面中。例如，qBittorrent 的官网 https://www.qbittorrent.org/ 就有提供源码包下载（如图所示）：

![image](/img/onboaring/qb-homepage.webp)

<p style="text-align: center; font-style: italic">
    qBittorrent 的官网主页，可见并没有源码链接的身影
</p>

由上图可见，qBittorrent 并未在首页放置下载链接，因此您需要点击 “Downloads” 前往下载页面，找到有关源码的一节：

![image](/img/onboarding/qb-download.webp)

<p style="text-align: center; font-style: italic">
    qBittorrent 下载页面中 “Source Tarball” 一节
</p>

由上例可见，在官网发布 tarball 的软件不仅提供源码链接，同时还提供源码包的校验信息（SHA-256、MD5 等算法的校验值）。源码包的校验信息尤为重要，成功比对校验值就意味着下载的源码包没有损坏，且没有被中途修改。

{% card(type="info", title="注意下载链接格式") %}
所有的源码包下载链接均为直链形式，也就是说，链接尾部必须为文件名，且链接中不能有问号、`&` 符号等 URL 参数。如，下面的例子就是符合要求的链接：

- `https://git.kernel.org/pub/scm/linux/kernel/git/stable/linux.git/snapshot/linux-6.10.10.tar.gz`
- `https://github.com/htop-dev/htop/releases/download/3.3.0/htop-3.3.0.tar.xz`
- `https://ftp.gnu.org/gnu/gcc/gcc-14.2.0/gcc-14.2.0.tar.xz`
{% end %}

{% card(type="tips") %}
有些软件会发行由多种压缩算法压缩的 tar 包：
- `.tar.gz`: Gzip
- `.tar.xz`: LZMA (xz)
- `.tar.bz2`: Bzip2

有时您可能也会见到 `.zip` 格式打包的源码。如果软件有发行多种格式的源码包，请采取如下顺序优先选择：
1. `.tar.xz`
2. `.tar.gz`
3. `.tar.bz2`
4. `.zip`

复制到源码包的链接后，请记下源码包的获取链接，以便后续在 ABBS 中添加。
{% end %}

## 通过代码托管平台获得源码包

<!-- 有些软件即便有官网，也可能不直接提供 tarball，而是指引开发者克隆软件的版本追踪系统仓库（Git、Mercurial、Subversion 等），然后检出期望的版本。直接在代码托管平台上安家的项目也采取这种获取源代码的形式。 -->

有些软件有自己的官网，但开发工作和代码托管却在代码托管平台上进行。也有软件在托管平台上安家，这类软件没有自己的官网，所有的开发工作、Bug 追踪工作都在代码托管平台上进行。

一般情况下，获取这些项目的源码最直接的方式是使用 Git 等版本控制软件克隆源码仓库。不过，为了方便发行版开发者，软件项目通常也会提供 tarball。有一部分此类项目会自行在代码托管平台的 Releases 页面上自行发布 tarball，有些则完全依赖代码托管平台生成 tarball。

对于 GitHub 和 GitLab，您可以直接前往项目主页（列出项目文件和 README 的页面），此时页面的链接一般就是仓库的 URL：

- 对于 GitHub，仓库 URL 的形式为 `https://github.com/用户名或组织名/项目名`，如
    - `https://github.com/nginx/nginx`
    - `https://github.com/felixonmars/fcitx5-pinyin-zhwiki`

- 对于 GitLab，大多数 URL 与 GitHub 保持一致，但有时仓库名与用户名之间会有子分类，如：
    - `https://gitlab.com/qemu-project/qemu` （没有子分类）
    - `https://gitlab.freedesktop.org/xorg/driver/xf86-input-libinput` （有 `driver` 子分类）

然后前往仓库的版本发行 (Release) 页面：

- GitHub 的版本发行页面入口在项目主页右侧。
- GitLab 的版本发行页面需要点击页面左侧 “部署 (Deploy)” ，然后点击 “发布 (Releases)”。

如果仓库的版本发行页面为空，则说明该项目不发行源码包。否则，找到页面中标记为最新的版本：

| ![image](/img/onboarding/github-releases.webp) | ![image](/img/onboarding/gitlab-releases.webp) |
|:---------------------:|:---------------------------------------------------:|
| GitHub 的版本发布页面 |                GitLab 的版本发布页面                |

上文提到代码平台会自动生成对应版本的 tarball，这些 tarball 一般会与项目自行打包的  tarball 一起在代码托管平台的 Release 页面提供，**您应该避免利用这些链接**：一般链接标记为 “Source Code” 的 tarball 均为代码托管平台自动生成。上面的例图中的链接均为自动生成的 tarball 的链接。

不过，有些 tarball 是由维护者自行上传的（如下图由绿色框出的链接就指向的是维护者自行上传到 Releases 页面的 tarball），此时您应该使用这类链接下载 tarball；红色框出的链接就是您不应该使用的自动生成 tarball 的链接：

![image](/img/onboarding/github-release-tarball.webp)

<p style="text-align: center; font-style: italic">
    绿色框的部分就是开发者自行打包上传的 Tarball，红色为代码平台自动生成的链接；可见自行上传的文件不仅有文件名，还有大小，可利用此特征区分
</p>

如果您拿不准，请直接前往下一节，使用项目的代码仓库。

{% card(type="info", title="不使用代码平台生成 tarball 链接的原因") %}
通常情况下，代码托管平台自动生成的 tarball 可能无法复现——这意味着每隔一段时间，由同一版源码生成的 tarball 会得出不同的校验值。

这种情况会令自动打包系统失效，因为自动打包系统同样需要确保源码包的完整性 (Integrity)，因此打包前必须记录每一个源码（包）文件的校验值。一旦上游的链接指向的源码（包）发生变动，校验值就会改变。

造成这种情况的原因较为复杂，但其中最明显的一个原因是每次代码平台生成 tarball 时会记录文件的时间戳信息，而文件的创建时间、修改时间及访问时间等信息可能会随着生成的时间而改变。

因此，如果项目在 GitHub、GitLab、SourceForge 等平台托管了代码，并且没有在 Releases 页面自行发布 tarball，强烈建议您利用版本控制系统获取源码。

如果托管在代码平台中的项目的确没有提供自己打包的 tarball，您就需要通过 VCS 获取其源码。
{% end %}

## 通过版本控制系统 (VCS) 获取项目源码

如果项目的官网、项目使用的代码托管平台上均没有能够利用的 tarball，您就需要找打项目托管在代码平台上的代码仓库，将其克隆到本地。克隆仓库一般需要找到仓库的 URL，然后前往终端使用对应的 VCS 软件克隆。下面将讲述如何获得仓库的 URL。

以下是几个常见的托管平台及其主要使用的版本控制系统：

| 代码托管平台 | 网址 | 使用的版本控制系统 |
| :---: | :---: | :---: |
| GitHub | https://github.com/ | Git |
| GitLab* | https://gitlab.com/ | Git |
| GNU Savannah | https://savannah.gnu.org/ | Git, Mercurial (hg), Subversion(SVN), CVS |
| Gitee （码云） | https://gitee.com/ | Git |
| Codeberg (Gitea, Forgejo)* | https://codeberg.org/ | Git |
| SourceForge** | https://sourceforge.net/ | Git, Mercurial (hg), Subversion (SVN) |
| BitBucket | https://bitbucket.org | Git |
| SourceHut | https://sr.ht/ | Git, Mecurial |

\*: 这些平台使用的服务端开源，因此会有许多开发者自行运行的实例。
\*\*: ABBS 树中鲜有直接克隆 SourceForge 源代码仓库的用例。您应该参考上节内容使用 SourceForge 打包的 tarball。

您应该可以直接透过搜索引擎或项目官网找到项目仓库所在地址，部分代码托管平台的项目 URL 的格式及其对应的仓库克隆 URL 使用方法如下：

| 代码托管平台 | URL 格式 | URL 示例 | 如何找到克隆用 URL |
| :----: | :-----: | :-----: | :----- |
| GitHub | `https://github.com/用户或组织名/项目名称` | https://github.com/systemd/systemd | 点击 “Code” 按钮，在弹框中选择 “HTTPS”，复制下面的链接 |
| GitLab 及其自建实例 | `https://gitlab.com/用户或组织名/项目名称` | https://gitlab.com/qemu-project/qemu | 点击 “Code（代码）” 按钮，复制 “Clone with HTTPS（使用 HTTPS 克隆）” 下的链接 |
| GitLab 及其自建实例* | `https://gitlab.com/用户或组织名/子分类/项目名称` | https://invent.kde.org/graphics/krita | 点击 “Code（代码）” 按钮，复制 “Clone with HTTPS（使用 HTTPS 克隆）” 下的链接 |
| Gitee | `https://gitee.com/用户或组织名/项目名称` | https://gitee.com/rtthread/rt-thread | 点击 “克隆/下载”，复制 “HTTPS” 下的第一个链接（切勿复制带 git clone 的链接） |
| GNU Savannah | `https://savannah.gnu.org/projects/项目名/` | https://savannah.gnu.org/projects/bash/ | 在页面下方点击 “Browse Git Repository” 后，复制新页面中的 HTTPS 链接 |
| Codeberg、自建 Forgejo 及 Gitea 实例 | `https://codeberg.org/用户或组织名/项目名` | https://codeberg.org/forgejo/forgejo | 在页面上半部分找到 “HTTPS”，复制其旁边的链接 |
| SourceHut | `https://VCS名称.sr.ht/~用户名/项目名` | https://git.sr.ht/~sbinet/sako | 复制右侧 “clone” 版块中 “read-only” 下面的链接 |

{% card(type="tips") %}
您访问托管平台的项目仓库主页时，地址栏应仅包含上述格式的链接。如果地址栏中包含任何其他内容（如多一级斜杠 “/”、存在问号及参数等），请将其删除。
- GitLab 的链接可能在用户/组织名及项目名之间存在多级的子分类，访问 GitLab 项目时尤其需要注意。
{% end %}

找到项目在代码托管平台上的仓库、并获取到仓库 URL 后，您就可以在终端中使用对应的 VCS 克隆了：

```shell
$ cd ~/clones
$ git clone https://github.com/systemd/systemd.git
$ svn co svn://svn.code.sf.net/p/sdcc/code/tags/sdcc-4.3.6
$ hg clone https://hg.sr.ht/~scoopta/wofi
```

由于 Mercurial、Subversion、CVS 等版本控制工具的用途并不广泛，本指南只介绍 Git 的使用方法。

克隆到本地后，您需要将源码检出 (Checkout) 到特定版本。您不能使用克隆下来的主分支！您可以前往托管平台的项目主页，点击 “Tags（标签）” 链接获得最新发布的版本。您需要记下最新版的 tag 名称（不能省略其中的 “v” 等前缀）。

如，截至编写之日 systemd 最新发布的版本是 `v256.7`。您就可以将源码检出到该标签上，获得该版本的源码：

```console
$ cd systemd
$ git checkout v256.7
Note: switching to 'v256.7'.

HEAD is now at 7635d01869 meson: bump version to 256.7
```

现在请记下该项目的仓库 URL、项目的最新版本及对应的 Tag 名称，以便后续添加至 ABBS 中。

# 将新的软件添加至 ABBS 中

了解软件源码获取的途径后，您就可以在 ABBS 树内合适的位置开始编写打包信息了。

## 准备分支



## 新建文件夹 (2)

按照 ABBS 的软件分类规则，您要打包的软件需要归类为应用程序 (`app-`) 或运行时库 (`runtime-`)，然后按照软件的用途寻找对应的子分类。以 htop 为例，htop 属于进程管理工具，因此需要落在 `app-admin` 下。

在对应的子分类文件夹下新建名称为包名的文件夹后，您就可以开始编写软件包源代码信息了。

{% card(type="tips") %}
包名和其所在文件夹的名称不应叫做 “新建文件夹 (2) ”。
{% end %}

## 编写软件包源码信息文件 `spec`

`spec` 文件位于 ABBS 树中软件包文件夹下，记录着软件包的源代码获取途径、版本及校验值。和 Autobuild 的 `defines` 文件一样，`spec` 同样遵循 APML 的约束。

`spec` 文件中必须存在的变量如下表所示。

| 变量名 | 描述 |
| :----: | :----: |
| `UPSTREAM_VER` | 上游项目发布的版本号，不能有变动 |
| `VER` | 符合 AOSC 版本号规范的版本号 |
| `SRCS` | 源码的下载途径 |
| `CHKSUMS` | 源码（包）的校验值 |
| `CHKUPDATE` | 用于检查更新的链接 |

### `UPSTREAM_VER`

`UPSTREAM_VER` 记录着上游发布版本的版本号，不能修改。您可以去掉版本前缀（如 `v1.2.3` 中需要去掉前缀 `v`）。该变量用于检查上游版本的更新。

### `VER`

`VER` 记录着经修改后符合 AOSC 版本规范的版本号。您需要将 `UPSTREAM_VER` 按如下规则修改后得到的字符串写入 `VER` 变量中。

| 情形 | 修改规则 | 版本号示例 | 修改后示例 |
| :----: | :----: | :----: | :----: |
| 版本号中只存在半角句点，如常见的 `x.y.z` 版本号 | 不做修改，保持原样 | oma `1.12.6` | `VER=1.12.6` |
| 版本号中存在字母 | 将字母改为小写，并删除字母周围的符号 | BIND `9.12.3-P4` | `VER=9.12.3p4` |
| 版本号中存在短横线 “`-`” | 将短横线替换为加号 “`+`” | ImageMagick `6.9.10-23` | `VER=6.9.10+23` |\
| 版本号中存在下划线 “\_” | 将下划线改为半角句点 “.” | Icarus Verilog `10_2` | `VER=10.2` |
| 版本号中存在发布阶段标记（“alpha”、“rc” 等） | 将字母改为小写并用半角波浪线 “~” 连接主版本和发布阶段标记 | GoldenDict `1.5.0-RC2` | `VER=1.5.0~rc2` |
| 版本号为未分隔开的日期 | 按照 `YYYYMMDD` 格式填入 | ACBS `20241103` | `VER=20241103` |
| 版本号为格式化后的日期 | 将分隔符改为半角句点，即 `yyyy.mm.dd` | QuickJS `2020-09-06` | `VER=2020.09.06` |
| 版本号基于版本控制系统的某提交的哈希值 | 取 VCS 简写、距离该提交最近的 Tag（如果没则为 `0`）、精简过的哈希值、对应的 Revision 号码及提交日期 | shadowsocks-libev `05e70d43176ae239ba54ffb1a0f80df5b8f3d4f1` | `VER=3.3.5+git20220626.r2372.05e70d4` |

> [!Note]
> 对于最后一种版本号，应填入的版本格式为：
> ```bash
> VER=${TAG}+${VCSNAME}.r${REVISION}.${SHORTHASH}
> ```
> 其中：
> - `TAG`: 距离采取的 commit 最近的 Tag（只能比当前 commit 旧，不能向后选择）
> - `VCSNAME`: 简写的版本控制系统名称，如 `git`、`hg`、`svn`。
> - `REVISION`: 顺序的修补版本号，通常为由第一个 commit 起到目前为止的计数。
> - `SHORTHASH`: 经过版本控制软件截短后的 commit 的哈希值。如果版本控制系统没有用哈希值，可以连带左边的句点一起不写，如 Subversion。
> 其中对于修补版本号，Git 可以通过以下方式获取：
> ```bash
> git rev-list -n COMMIT_HASH
> ```
> Mercurial 则可以通过如下方式获取：
> ```bash
> hg id -n -r REF
> ```

> [!Important]
> 除非真的有必要，否则您不应该直接选用 `master` 等主分支上的版本。

> [!Important]
> 除非真的必要，否则您不应该选用非发行版本的源码。

### `SRCS`

`SRCS` 记录着源码的获取途径。



