+++
title = "软件包元数据格式规范"
description = "用于描述软件包的简化版 Bash 语法"
date = 2020-05-04T03:35:18.729Z
[taxonomies]
tags = ["dev-automation"]
+++

# 软件包元数据格式规范（长期征求意见稿）

目前 `spec` 和 `defines` 文件都使用 Bash 语法定义软件包元数据。由于严格遵守 [Bash 手册](https://www.gnu.org/savannah-checkouts/gnu/bash/manual/bash.html) 解析配置实现起来非常麻烦，我们对允许使用的 Bash 语法进行了限定来减少解析和转换成本。

## 示例

```bash
PKGVER=8.2
PKGDEP="x11-lib libdrm expat systemd elfutils libvdpau nettle \
        libva wayland s2tc lm-sensors libglvnd llvm-runtime libclc"
MESON_AFTER="-Ddri-drivers-path=/usr/lib/xorg/modules/dri \
             -Db_ndebug=true" 
MESON_AFTER__AMD64=" \
             ${MESON_AFTER} \
             -Dlibunwind=true"
```

## 允许的 Bash 语法

* 变量声明，例如 `a=b`。
* [注释](https://www.gnu.org/software/bash/manual/bash.html#Comments)，例如 `# comment`。
* [引用](https://www.gnu.org/software/bash/manual/bash.html#Quoting)：
  * 转义符，通常在双引号中使用，例如 `\newline`、`\"`。
  * 单引号，括住的内容通常无特殊含义，例如 `'a'`。
  * 双引号，括住的内容通常包含变量，例如 `"a"`。
* [Shell 拓展](https://www.gnu.org/software/bash/manual/bash.html#Shell-Expansions)：
  * Shell 参数展开：
  	* `${parameter:offset}`：子串。
    * `${parameter:offset:length}`：子串。
    * `${parameter#word}`：匹配最短前缀并删除。
    * `${parameter##word}`：匹配最长前缀并删除。
    * `${parameter%word}`：匹配最短后缀并删除。
    * `${parameter%%word}`：匹配最长后缀并删除。
    * `${parameter/pattern/string}`：替换，单个。
    * `${parameter//pattern/string}`：替换，所有。


## 禁止的 Bash 语法

禁止以任何方式使用递归。

* [引用](https://www.gnu.org/software/bash/manual/bash.html#Quoting)：
	* ANSI-C 转义，例如 `$'a\nb'`。
	*	本地化翻译，例如 `$"a"`。
* [Shell 拓展](https://www.gnu.org/software/bash/manual/bash.html#Shell-Expansions)：
  * 大括号展开，例如 `a{d,c,b}e`。
  * 波浪号展开，例如 `~/.config`。
  * 命令替换，例如 `$(command)` 或者 \`command\` (zip, x264+32, xl2tpd, chibi-scheme, uemacs, llvm, qt-5)。
  * 算术展开，例如 `$(( expression ))`。
  * 过程替换，例如 `<(list)` 或者 `>(list)`。
  * 文件名展开。
  * Shell 参数展开：
      * `${parameter:-word}`：参数未设置时使用 `word`。
      * `${parameter:=word}`：参数未设置时将 `parameter` 设置为 `word`，并使用 `word`。
      * `${parameter:?word}`：参数未设置时打印 `word` 到标准错误。
      * `${parameter:+word}`：参数设置时使用 `word`。
      * `${!prefix*}`。
      * `${!prefix@}`。
      * `${!name[@]}`。
      * `${!name[*]}`。
      * `${#parameter}`：获取长度。
      * `${parameter^pattern}`：首个匹配的字符转大写。
      * `${parameter^^pattern}`：全部大写。
      * `${parameter,pattern}`：首个匹配的字符转小写。
      * `${parameter,,pattern}`：全部小写。
      * `${parameter@operator}`：特殊操作。
      * `${parameter/#pattern/string}`：替换，只匹配前缀。
      * `${parameter/%pattern/string}`：替换，只匹配后缀。


### 模式匹配

[模式匹配](https://www.gnu.org/software/bash/manual/bash.html#Pattern-Matching) 只可以在 `${parameter/pattern/string}` 使用。我们只为 `*` 和 `?` 提供支持。

