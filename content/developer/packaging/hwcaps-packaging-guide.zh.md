+++
title = "AOSC OS glibc HWCAPS 子架构构建指南"
description = "为特定的运行库启用 HWCAPS 子架构打包"
date = 2024-10-31T11:10:24.952Z
[taxonomies]
tags = ["packaing"]
+++

[x86-64-uarch-levels-wikipedia]: https://en.wikipedia.org/wiki/X86-64#Microarchitecture_levels
[ibm-z13]: https://en.wikipedia.org/wiki/IBM_z13
[ibm-z14]: https://en.wikipedia.org/wiki/IBM_z14
[ibm-z15]: https://en.wikipedia.org/wiki/IBM_z15
[ibm-telum]: https://en.wikipedia.org/wiki/IBM_Telum

# GNU glibc HWCAPS 子架构打包指南

HWCAPS (Hardware Capabilities)，在本文中指 GNU glibc 动态链接器 `ld.so` 根据处理器的指令集扩展支持情况（或微架构等级），自动加载为对应指令集优化过的共享库的行为。如，支持 x86-64-v3 (AVX2) 的处理器可以调用针对 x86-64-v3 优化过的库，而不是使用为基线编译的库，从而提升性能。HWCAPS 由 glibc 2.33 版引入，但目前鲜有发行版针对 HWCAPS 打包。

Autobuild4 目前已经初步实现 HWCAPS 打包支持。本指南将指引您利用 Autobuild4 的 HWCAPS 打包支持为各类基础库增添针对 HWCAPS 支持的微架构优化过的版本。

# HWCAPS 支持的处理器架构

目前 glibc HWCAPS 支持三种处理器架构：

- x86-64 架构（64 位 x86）
- IBM POWER 架构
- IBM Z (s390x)

在这三个架构中，安同 OS 支持 x86-64 及 POWER 架构，因此只有在安同 OS 中只有两个架构能够利用 HWCAPS 机制。您可以在 GNU glibc 的源码目录中寻找 `dl-hwcaps-subdirs.c` 来判断哪些架构支持 HWCAPS 子目录。本文主要以 x86-64 举例。

在 glibc 中，支持 HWCAPS 的处理器架构被分为数个子架构，以区分不同微架构等级（或指令集扩展）的处理器。处理器架构的基线指令集不包括其中。`ld.so` 会选择处理器支持的子架构中最高的子架构。如，第十一代 Intel Core i7-11700K 处理器支持 SSE4.2、AVX2 及 AVX-512 指令集，因此 `ld.so` 会尽量加载为 AVX-512 指令集优化的共享库；而第十二代 Intel Core 17-12700 不支持 AVX-512，因此 `ld.so` 会尝试加载为 AVX2 优化的共享库。

以下是各个处理器架构中支持的 HWCAPS 子架构：

## x86-64

x86-64 除基线本身之外有[三种微架构等级][x86-64-uarch-levels-wikipedia]，因此在 glibc 中有三个子架构。这三个子架构如下：

| 子架构名称 | 描述 | 编译器参数 |
| :--: | :--: | :--: |
| `x86-64-v2` | 对应 `x86-64-v2` 微架构等级，主要支持 SSE4.2 指令集扩展 | `-march=x86-64-v2 -mtune=sandybridge` |
| `x86-64-v3` | 对应 `x86-64-v3` 微架构等级，主要支持 AVX2 指令集扩展 | `-march=x86-64-v3 -mtune=haswell` |
| `x86-64-v4` | 对应 `x86-64-v4` 微架构等级，主要支持 AVX512 指令集扩展 | `-march=x86-64-v4 -mtune=generic` |

## IBM POWER

IBM POWER 以 POWER 8 为基线，支持两个子架构：

| 子架构名称 | 描述 | 编译器参数 |
| :--: | :--: | :--: |
| `power9` | 第九代 IBM POWER 架构 | `-march=power9` |
| `power10` | 第十代 IBM POWER 架构 | `-march=power10` |

## IBM Z (s390x)

安同 OS 没有 s390x 移植，但出于文档性质在此列出 s390x 的 HWCAPS 子架构：

| 子架构名称 | 描述 |
| :--: | :--: |
| `z13` | [IBM z13][ibm-z13] 处理器 |
| `z14` | [IBM z14][ibm-z14] 处理器 |
| `z15` | [IBM z15][ibm-z15] 处理器 |
| `z16` | [IBM Telum][ibm-telum] 处理器（为 IBM z16 大型机所用） |

# HWCAPS 打包对象

由于 HWCAPS 是动态加载共享库的机制，所以为应用程序包启用 HWCAPS 并无意义。HWCAPS 只能够为运行时共享库启用。

同时，不是所有共享库都需要打包 HWCAPS。集成 HWCAPS 库会耗费较大空间，因此能够启用的范围有限。我们规定如下类型的软件包可以启用 HWCAPS：

- 安同 OS 核心组件中的共享库（glibc, isl, gmp, mpc, mpfr, zlib, zstd 等）
- 编译器运行时（libgcc、libstdc++、LLVM libc++）
- TBD

# HWCAPS 子目录

HWCAPS 子目录是 glibc 的动态连接器寻找针对 HWCAPS 子架构优化过的共享库的路径。每个子目录中均存放针对对应微架构优化过的共享库 (`.so`)。HWCAPS 子目录遵循如下格式：

```bash
$LIBDIR/glibc-hwcaps/$SUBTARGET
```

其中，`LIBDIR` 是系统共享库的路径，在安同 OS 中为 `/usr/lib`。例如，在 x86-64 中就有三个 HWCAPS子目录： 

```shell
$ ls /usr/lib/glibc-hwcaps
x86-64-v2  x86-64-v3  x86-64-v4
```

不过 `ld.so` 同时会根据 `ld.so.conf` 中的路径及 `LD_LIBRARY_PATH` 环境变量中指定的路径扩展默认的寻找路径。例如，如果 `ld.so.conf` 中存在如下目录：

```
/usr/local/lib
/opt/32/lib
/opt/lib
```

那么 `ld.so` 同时会搜索以下路径：

```
/usr/local/lib/glibc-hwcaps/$SUBTARGET
/opt/32/lib/glibc-hwcaps/$SUBTARGET
/opt/lib/glibc-hwcaps/$SUBTARGET
```

> [!Caution]
> 除非有特殊需要，否则打包时软件的共享库不应该出现在 `/usr/lib` 以外的地方。

# Autobuild4 的 HWCAPS 打包流程

Autobuild4 实现为 HWCAPS 打包的方式是在软件包主体构建完毕后，按照预配置的构建参数，分别为支持的子架构构建一次。如，`amd64` 有三个 HWCAPS 子架构，因此软件包会被构建四次：第一次使用 `amd64` 基线的参数构建，然后使用 x86-64-v2 的参数、x86-64-v3 的参数和 x86-64-v4 的参数为支持的 HWCAPS 子架构构建。

Autobuild4 处理 HWCAPS 的流程如下：

1. 为源码打补丁 (patch)
2. 运行 prepare 步骤
3. 运行 build 步骤（构建模板或自定义脚本）
4. 运行 beyond 步骤
5. 如果启用了 HWCAPS，则开始为 HWCAPS 打包
    - 打包步骤根据软件包主体的打包方式决定
7. 打包后期处理步骤及 QA
8. 出包，打包结束

所有打包流程均在 `proc/51-build-hwcaps.sh` 文件中。

# HWCAPS 打包支持范围

如果软件包主体是用构建模板自动处理的，则在为 HWCAPS 子架构打包时也会复用构建模板自动处理。自动处理 HWCAPS 的行为支持的构建模板如下：

- Autotools
- CMake
- Meson
- Rust

如果软件包并未使用构建模板（以自定义构建脚本 `build` 构建），或者软件包并未使用上述构建模板，您就必须为其编写 HWCAPS 构建脚本。

所有 HWCAPS 相关的文件（脚本）都必须存放于 `autobuild/hwcaps` 文件夹中。除非另行说明（或指定了绝对路径），否则本文中所有相对路径都是以 `autobuild` 文件夹为起点。

# 启用 HWCAPS 打包行为

HWCAPS 功能默认禁用，可选启用。您可以在 `defines` 文件中指定 `AB_HWCAPS` 变量控制 HWCAPS 打包行为：

```bash
# 设置为 1 即可启用 HWCAPS 打包
AB_HWCAPS=1
```

启用后，Autobuild4 会在构建完软件包主体后运行 HWCAPS 构建步骤。


# 自动处理 HWCAPS 打包

如果软件包使用 Autotools、CMake 或 Meson 构建模板，在启用 HWCAPS 构建后 Autobuild4 理应能够自动处理大多数包。不过自动处理过程可能无法满足您的需求，此时您可以编写在构建前后运行的脚本，灵活处理每一次构建。

您也许需要在每次构建前设置额外的编译参数，或者在每次构建完毕后额外链接共享库，或创建额外的符号链接。这些操作都可以通过编写构建前后运行的 `hwcaps/prepare` 及 `hwcaps/beyond` 来完成：

`hwcaps/prepare`:

```bash
abinfo "Adding extra optimizations..."
case "$CUR_SUBTGT" in
    x86-64-v2)
        export CFLAGS="$CFLAGS -mssse3"
        ;;
    x86-64-v3)
        # Add some optimizations
        ;;
    *)
        # do nothing
        ;;
esac
```

`hwcaps/beyond`:
```bash
abinfo "Installing additional symbolic links ..."
ln -s libfoo.so.1.2.3 $PKGDIR/usr/lib/libfoo.so
ln -s libbar.so.1.2.3 $PKGDIR/usr/lib/libbar.so.1
```

> [!Important]
> 每为一个子架构构建时，`hwcaps/prepare` 及 `hwcaps/beyond` 都会运行一次。您可以通过下文中提到的变量判断当前构建所面向的子架构。

在为 HWCAPS 打包期间，Autotools 构建模板会为 `configure` 脚本传递宿主 (`--host`) 参数，来避免在不支持的机器上运行等级更高（如在 x86-64-v2 的机器上编译针对 x86-64-v3 的共享库）的 HWCAPS 子架构的二进制的情况。此行为一般用于测试某段程序能否编译（或运行），作为配置项目时的参考。

有些时候只指定 `--host` 可能不足以避免上述情况。如果在微架构等级较低的机器上构建不兼容的库时 `configure` 脚本仍旧执行失败，您可以启用如下开关，让 Autotools 认为需要交叉编译，因此跳过尝试运行不兼容的二进制程序的情况：

```bash
# 设置为 1 即可启用交叉编译模式
AB_HWCAPS_CROSS=1
```

启用上述开关后，Autobuild4 会在执行 `configure` 脚本时添加一对不一样的宿主 (`--host`) 及构建宿主 (`--host`) 参数，因此 `configure` 脚本会认为目前处于交叉编译环境，但实则不然：

```
./configure --build=x86_64-pc-linux-gnu --host=x86_64-aosc-linux-gnu
```

# 脚本中可供使用的变量

Autobuild4 在运行 HWCAPS 脚本时会提供如下变量，方便您引用各种路径：

- `$PKG_BLDDIR`: 软件包主体的构建目录 (`$BLDDIR`)。
- `$PKG_PKGDIR`: 软件包主体的打包目录 (`$PKGDIR`)。包含优化后的共享库 HWCAPS 子目录需安装至此，以随软件包主体一起打包。
- `$HWCAPSDIR`: `$PKG_PKGDIR/usr/lib/glibc-hwcaps`，即软件包主体的打包目录中的 `glibc-hwcaps` 文件夹。
- `$CUR_SUBTGT`: （自动处理时）当前正在处理的 HWCAPS 子架构。可以使用 `$HWCAPSDIR/$CUR_SUBTGT` 拼接出完整的共享库安装路径。
- `${HWCAPS[@]}`: 存放当前架构所有支持的 HWCAPS 子架构的数组，如 `('power9' 'power10')`。

其中，`CUR_SUBTGT` 仅在自动处理 HWCAPS 打包期间运行 `prepare`、`beyond` 及 `install` 脚本时才能够使用。

# 自动处理 HWCAPS 打包的流程

如果目标软件包使用了构建模板，在您启用 HWCAPS 打包后，Autobuild4 会自动在软件包本体构建完毕后运行 HWCAPS 打包步骤。目前自动处理 HWCAPS 的行为已经在下列构建模板中测试：

- GNU Autotools
- CMake

同时，您也可以使用自定义脚本 `hwcaps/prepare` 及 `hwcaps/beyond` 脚本，在构建前后运行自定义命令。在自动处理 HWCAPS 构建的情况下，Autobuild4 会为每一个定义的子架构运行如下步骤：

- 设置构建参数（`CFLAGS`、`CXXFLAGS`、`RUSTFLAGS` 等）
- 保存并设置新的构建目录 `$BLDDIR` 和安装目录 `$PKGDIR`
- 运行 `hwcaps/prepare`
- 运行构建模板，构建面向该子架构的库
- 运行 `hwcaps/beyond`
- 自动复制 `$PKGDIR/usr/lib` 目录下的所有共享库及其符号链接到原始的 `$PKGDIR/usr/lib/glibc-hwcaps/$SUBTARGET`
    - 或者运行自定义安装脚本 `hwcaps/install` (TBD)
- QA 检查：确保对应的 HWCAPS 子文件夹下存在可执行的 .so 文件或软链接

自动处理 HWCAPS 时，所有自定义脚本（`prepare`、`beyond` 及 `install`）都会执行多次，即有多少个子架构，就需要构建多少次，也就会运行多少次脚本。您可以在脚本内利用 stamp 机制避免重复执行部分逻辑。

<!-- # 指定需要安装的共享库文件名（TBD）

> [!Caution]
> 该功能尚未在 Autobuild4 中实现。

您也可以使用 `hwcaps/files` 列表文件来指定需要安装的库及符号链接的文件名，从而避免安装不必要的共享库。

`hwcaps/files` 文件内容是按行分隔的文件名，同时支持立即以 `#` 开头的注释。如下例是 `glibc` 中指定的共享库列表：

```
libc.so.6
libm.so.6
libutil.so.1
```

此时 `ld-linux-x86-64.so.2` 等动链接器相关的库就会被省略。

> [!Important]
> 您也需要指定所有指向这些共享库的符号链接的名称。

如果出现不同 HWCAPS 子架构编译出的共享库有出入，或者特定子架构的部分库运行时会出错的情况，可以加上子架构名称的前缀，为特定子架构规避有问题或不存在的库。假设 x86-64-v3 及 x86-64-v4 子架构不会产出 `libm.so.6`：

```
x86-64-v2 libc.so.6
x86-64-v2 libm.so.6
x86-64-v2  libutil.so.1
# x86-64-v3 and onwards do not have libm.so.6 compiled
x86-64-v3 libc.so.6
x86-64-v3 libutil.so.1
x86-64-v4 libc.so.6
x86-64-v4 libutil.so.1
``` -->

# 自定义安装逻辑（TBD）

> [!Caution]
> 如需手动处理 HWCAPS 构建，强烈建议您在 `hwcaps/install` 脚本中完成安装步骤，而不是在 `hwcaps/build` 脚本中一气呵成。

在自动处理 HWCAPS 构建的情况下，Autobuild4 会将每个子架构对应的 `$PKGDIR/usr/lib` （不包含子文件夹）中所有共享库及符号链接安装至软件包主体。您可以自行编写安装共享库的逻辑。共享库安装的逻辑需编写在 `hwcaps/install` 文件中。

`install` 脚本运行在 `beyond` 脚本之后、QA 过程之前，且需要将这些库安装到 `$HWCAPSDIR/$CUR_SUBTGT` 中。您可以通过逻辑自行判断要安装的共享库。

> [!Note]
> 您也可以像 `build` 脚本那样单独为特定架构编写 `install` 脚本：
> - `hwcaps/install-amd64`
> - `hwcaps/install-ppc64el`

# 手动处理 HWCAPS 构建

对于通过自定义脚本编译软件包主体的包，您需要为 HWCAPS 子架构单独编写构建脚本。您可以单独为支持的架构编写脚本 (`hwcaps/build-$ARCH`)，也可以选择将它们集成进一个文件中 (`hwcaps/build`)。您在编写自定义构建脚本时，需要注意以下几个问题：

- 自行处理 HWCAPS 构建时，编译过程只会执行一次。您需要在该脚本内为每个子架构运行一次构建。
- `BLDDIR` 及 `PKGDIR` 的使用：如果可以独立构建 (Shadow build)，则请尽量使用单独的 `BLDDIR` 及 `PKGDIR`，并且不能删除软件包主体及已经构建的子架构的 `BLDDIR` 及 `PKGDIR`。
- 自行处理构建过程时，您不应该在 `build` 及 `beyond` 阶段将任何共享库及符号链接安装至 `$HWCAPSDIR/$SUBTGT`。您可以不采取任何措施，让 Autobuild4 自行收集共享库及符号链接，或者使用自定义安装脚本 `hwcaps/install`。
- 自行处理 HWCAPS 构建时，您需要自行设置对应的编译器参数。
- 自行处理 HWCAPS 构建时，`$CUR_SUBTGT` 变量不存在。

Autobuild4 会分别导出所有子架构的 C、C++ 及 Rust 编译器参数和 C 预处理器及链接器参数，供您在构建期间参考引用：

```bash
# 以 amd64 为例。amd64 有三个子架构，将各种存放参数的变量
# 与三个子架构名称组合起来，总共有 15 个变量。
# 由于变量名中不允许使用短横，因此以下划线代替之：
# CFLAGS_HWCAPS_x86_64_v2	CFLAGS_HWCAPS_x86_64_v3	CFLAGS_HWCAPS_x86_64_v4
# CXXFLAGS_HWCAPS_x86_64_v2	CXXFLAGS_HWCAPS_x86_64_v3	CXXFLAGS_HWCAPS_x86_64_v4
# RUSTFLAGS_HWCAPS_x86_64_v2	RUSTFLAGS_HWCAPS_x86_64_v3	RUSTFLAGS_HWCAPS_x86_64_v4
# CPPFLAGS_HWCAPS_x86_64_v2	CPPFLAGS_HWCAPS_x86_64_v3	CPPFLAGS_HWCAPS_x86_64_v4
# LDFLAGS_HWCAPS_x87_64_v2	LDFLAGS_HWCAPS_x86_64_v3	LDFLAGS_HWCAPS_x86_64_v4

# 每次更换子架构时，可以使用如下逻辑快速替换对应变量（假设 $cap 存放当前子架构的名称）：
for comp in C CXX RUST CPP LD ; do
    # _vname = "CFLAGS_HWCAPS_x86_64_v2"
    _vname="${comp}FLAGS_HWCAPS_${cap//[.-+]/_}"
    # $_val expands to the value of "${CFLAGS_HWCAPS_x86_64_v2}"
    # Quotes must be present!
    _val="${!_vname}"
    # export CFLAGS="-march=x86-64-v2 ..."
    export "${comp}FLAGS=$_val"
done
```

以 `build-amd64` 为例，自动构建脚本的总体逻辑如下：

```bash
abinfo "Building foo for HWCAPS targets ..."
# BLDDIR and PKGDIR are saved before this script runs.
for cap in "${HWCAPS[@]}" ; do
    abinfo "Preparing to build for $cap ..."
    export BLDDIR="$SRCDIR/"build-"$cap"
    export PKGDIR="$SRCDIR"/dist-"$cap"
    abinfo "$cap: Setting corresponding compiler and linker flags ..."
    for comp in C CXX RUST CPP LD ; do
        _varname="${comp}FLAGS_HWCAPS_${cap//[.-+]/_}"
        _val=${!_varname}
        export "${comp}FLAGS"="${_val}"
    done
    # more preparation setps
    abinfo "$cap: Building ..."
    mkdir "$BLDDIR"
    pushd "$BLDDIR"
    $SRCDIR/configure "${AUTOTOOLS_DEF[@]}" ...
    make ...
    abinfo "$cap: Installing into a separate PKGDIR ..."
    make install DESTDIR=$PKGDIR
done
```

# 附录 A 为 Autobuild4 增加新的 HWCAPS 架构

一旦 glibc 中有新的处理器架构引入了 HWCAPS 子目录功能，您就需要及时为 Autobuild4 实现对应架构的 HWCAPS 构建支持。

以 AArch64 为例。假设 AArch64 引入了 HWCAPS 子目录支持，且 AArch64 的子架构定义如下（以 ARMv8 为基线）：

- `armv8_2a-sve`: 带有 SVE 向量指令集扩展的 ARMv8.2-A 及以上版本指令集（并非所有处理器都有该扩展）。
- `armv9a`: ARMv9-A 指令集，主要包含 SVE、SVE2 指令集扩展（SVE 及 SVE2 是 ARMv9 的一部分）。

## 1. 添加 HWCAPS 定义

首先我们需要为 AArch64 标记 HWCAPS 支持情况。编辑 `arch/arm64.sh`，加入 HWCAPS
 子架构定义：

```bash
# Yay, AArch64 now supports HWCAPS subdirectories!
HAS_HWCAPS=1
HWCAPS=('armv8.2a-sve' 'armv9a')
```

## 2. 检查 `*FLAGS_COMMON_ARCH`

如果 `CFLAGS_COMMON_ARCH` 中存在与微架构无关的参数，需要将其分离，加入 `CFLAGS_COMMON_ARCH_BASE` 中。这里以 amd64 举例：

```
CFLAGS_COMMON_ARCH_BASE=('-fomit-frame-pointer')
CFLAGS_COMMON_ARCH=('-march=x86-64' '-mtune=sandybridge' '-msse2')
```

## 3. 分别指定编译器参数

您需要分别为两个子架构分别指定 C 编译器及 Rust 编译器的编译参数（C++ 编译器参数会复用 C 编译器的参数）：

```bash
CFLAGS_HWCAPS_armv8_2a_sve=('-march=armv8.2-a' '-mtune=cortex-a76' '-msve')
CFLAGS_HWCAPS_armv9a=('-march=armv9-a' '-mtune=cortex-a710' '-msve' '-msve2')
RUSTFLAGS_HWCAPS_armv8_2a_sve=('-Ctarget-cpu=generic')
RUSTFLAGS_HWCAPS_armv9a=('-Ctarget-cpu=generic')
```

> [!Important]
> AArch64 等没有规定微架构等级的处理器架构中，Rust 编译器目前需要通过 `-C target-feature` 参数指定对应的指令集扩展，但 `-C target-feature` 选项[不安全](https://doc.rust-lang.org/rustc/targets/known-issues.html#target-features)，因此 Rust 程序无法在 AArch64 上参与 HWCAPS 优化。
> 您仍需为每个子架构指定 `RUSTFLAGS`，因此上面的例子中为两个子架构制定了同样的编译器参数。

至此，AArch64 的 HWCAPS 架构支持就添加好了。接下来，您就可以将修改提交至 Autrobuild4 仓库的新分支上。同时您需要尝试构建一些包，以确保 HWCAPS 打包在 AArch64 上是工作的。

## 4. 构建测试

前往您的 AArch64 Ciel 工作区，进入 ABBS 树开设新主题（如 `autobuild4-hwcaps-arm64`）来测试新的 Autobuild4。在新建的分支上，将 Autobuild4 的版本更新至任意高版本（如 `999`），并且将源码指向 Autobuild4 Git 仓库的新分支：

```bash
VER=999
SRCS="git::commit=hwcaps-arm64::https://github.com/AOSC-Dev/autobuild4"
CHKSUMS="SKIP"
```

> [!NOTE]
> 请及时 Rebase 您的 HWCAPS 分支，保证您的分支比 `master` 分支新。

接下来就可以构建 Autobuild4 和任意已经启用 HWCAPS 构建的库：

```shell
# ciel build -i INSTANCE autobuild4 glibc
```

如果构建成功，即可开始大范围测试，待稳定后即可为 Autobuild4 发版。

# 附录 B 测试指南

一旦为新的软件包启用了 HWCAPS 构建，您就需要大范围测试 HWCAPS 兼容情况。以 x86-64 为例（POWER 很难找到全面的硬件），您应该能够访问到能够运行桌面版的如下硬件环境（每个子架构各取一种即可）：

- Intel Nehalem 至 Ivy Bridge 的处理器 (x86-64-v2)
- Intel Haswell、Broadwell 及 Skylake、Kaby Lake、Coffee Lake 及 Alder Lake 以上的消费级处理器 (x86-64-v3)
- Intel Skylake 以上 (Xeon Scalable) 或 Ice Lake、Rocket Lake 及 Tiger Lake（消费级）处理器 (x86-64-v4)
- AMD Zen 一代至三代处理器 (x86-64-v3)
- AMD Zen4/Zen 5 处理器 (x86-64-v4)

> [!Note]
> 支持 AVX-512 的产品并不常见，如无条件可以省略 x86-64-v4 测试。

## 测试维度

### `ld.so` 动态链接器的 HWCAPS 识别情况

执行 `/lib/ld-linux-x86-64.so.2 --help`，动态链接器就会输出 HWCAPS 识别情况：

```
$ /lib/ld-linux-x86-64.so.2 --help
...
Subdirectories of glibc-hwcaps directories, in priority order:
  x86-64-v4
  x86-64-v3 (supported, searched)
  x86-64-v2 (supported, searched)
```

查看输出尾部的 “Subdirectories of glibc-hwcaps directories” 一节，检查对应子架构是否被标记为 “supported, searched”。

### `ld.so` 加载的库中是否包含 HWCAPS 子目录中的库

用 `ldd` 命令查看程序需要加载的库。其中启用了 HWCAPS 构建的库应该由对应的 HWCAPS 子目录加载：

```
$ ldd /usr/lib/gcc/x86_64-aosc-linux-gnu/14.1.0/cc1
        linux-vdso.so.1 (0x00007f4947fc9000)
        libisl.so.23 => /usr/lib/glibc-hwcaps/x86-64-v3/libisl.so.23.3.0 (0x00007f4947c00000)
        libmpc.so.3 => /usr/lib/glibc-hwcaps/x86-64-v3/libmpc.so.3.3.1 (0x00007f4947f51000)
        libmpfr.so.6 => /usr/lib/glibc-hwcaps/x86-64-v3/libmpfr.so.6.2.1 (0x00007f4947800000)
        libgmp.so.10 => /usr/lib/glibc-hwcaps/x86-64-v3/libgmp.so.10.5.0 (0x00007f4947ea1000)
        libz.so.1 => /usr/lib/libz.so.1 (0x00007f4947e82000)
        libzstD.so.1 => /usr/lib/libzstd.so.1 (0x00007f4947b17000)
        libm.so.6 => /usr/lib/glibc-hwcaps/x86-64-v3/libm.so.6 (0x00007f4947753000)
        libc.so.6 => /usr/lib/glibc-hwcaps/x86-64-v3/libc.so.6 (0x00007f4947598000)
        /lib64/ld-linux-x86-64.so.2 => /usr/lib64/ld-linux-x86-64.so.2 (0x00007f4947fcb000)
```

### 依赖测试目标库的程序能否正常运行

运行任意依赖测试目标的程序，检查是否出现程序因非法指令而异常退出的情况。如果程序执行期间出现非法指令错误，请通过 `ldd` 检查加载的运行库是否符合该处理器指令集支持情况（如下例，处理器仅支持到 x86-64-v3，因此不应该加载针对 x86-64-v4 的库）：

```shell
$ python3
Illegal instruction (core dumped)
```

```shell
$ ldd /usr/bin/python3
	linux-vdso.so.1 (0x00007f11741c0000)
	libpython3.10.so.1.0 => /usr/lib/libpython3.10.so.1.0 (0x00007f1173c00000)
	libc.so.6 => /usr/lib/glibc-hwcaps/x86-64-v3/libc.so.6 (0x00007f1173fac000)
	libm.so.6 => /usr/lib/glibc-hwcaps/x86-64-v3/libm.so.6 (0x00007f1173b53000)
	/lib64/ld-linux-x86-64.so.2 => /usr/lib64/ld-linux-x86-64.so.2 (0x00007f11741c2000)
```

有关定位错误的详细信息，请参考 “故障排除” 一节。

有些程序可能起初运行正常，但执行到某个功能时可能会调用到包含不支持的指令的库。您在测试时需要尽可能全面地执行程序。

# 附录 C 故障排除

一旦在测试时遇到 SIGILL 错误，您就需要执行故障排除步骤。以下是一些通用步骤：

## 确定当前测试用环境的支持情况

您可以执行 `/lib/ld-linux-x86-64.so.2 --help` 并查看当前环境的 HWCAPS 支持情况。

> [!NOTE]
> ppc64el 架构下的动态链接器名称是 `/lib64/ld64.so.1`。

## 移除 HWCAPS 子目录

您可以移除 HWCAPS 子目录，然后更新链接器缓存，测试程序是否运行正常：

```shell
$ mv /usr/lib/glibc-hwcaps /usr/lib/glibc-hwcaps.bak
$ sudo ldconfig
$ ldd /usr/bin/python3
	linux-vdso.so.1 (0x00007fe30feaa000)
	libpython3.13.so.1.0 => /usr/local/lib/libpython3.13.so.1.0 (0x00007fe30f800000)
	libm.so.6 => /usr/lib/libm.so.6 (0x00007fe30fddd000)
	libc.so.6 => /usr/lib/libc.so.6 (0x00007fe30f400000)
	/lib64/ld-linux-x86-64.so.2 => /usr/lib64/ld-linux-x86-64.so.2 (0x00007fe30feac000)
$ python3
Python 3.13.0 (main, Oct 22 2024, 11:20:27) [GCC 13.2.0 20230727 (AOSC OS, Core)] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>>
```

### 如果程序运行正常

如果程序运行正常，则说明程序加载的库中包含错误优化的库。您现在可以恢复 HWCAPS 子目录，逐个移除加载的 HWCAPS 子目录中的库、刷新动态链接器缓存并测试程序，直到找出问题库。

找到出问题的库后，请向开发者报告出问题的库。

### 如果程序运行不正常

如果移除了 HWCAPS 子目录后程序依旧无法运行，请检查程序所依赖运行库的构建步骤。构建 HWCAPS 时不应该将库直接安装在 `/usr/lib` 下，并且 HWCAPS 构建步骤期间不应该安装可执行程序。

# 附录 D 可能出现的负面情况

HWCAPS 打包需要大范围测试。一旦出现负面情况，您应该立即为对应的软件包禁用 HWCAPS 打包，并将问题报告至安同 OS 开发者。主要的负面情况如下：

## ABI Break

由于 HWCAPS 会导致程序加载的库所面向的微架构参差不齐，因此极有可能会出现 ABI Break。一旦出现 ABI Break，您需要找到出现问题的库，并将其从 HWCAPS 子目录中删除，然后再次尝试运行。面对 ABI Break 有如下解决方案：

1. 为出现问题的软件包禁用 HWCAPS 构建。
2. 有些情况下可能是程序（或依赖该库的共享库）过时，需要重构。尝试重构一次，然后再次尝试运行。

