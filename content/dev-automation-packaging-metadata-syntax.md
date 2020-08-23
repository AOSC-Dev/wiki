+++
title = "Packaging Metadata Syntax"
description = "Reduced Bash syntax for describing packages"
date = 2020-05-04T03:35:18.729Z
[taxonomies]
tags = ["dev-automation"]
+++

# RFC: Packaging Metadata Syntax

The `spec` and `defines` files currently use Bash syntax to define package metadata, which is not easy to parse strictly according to the [Bash Reference Manual](https://www.gnu.org/savannah-checkouts/gnu/bash/manual/bash.html). Therefore, we propose the use of a reduce set of Bash syntax to reduce parsing and transition cost, as packaging tools will be refactored in languages other than Bash.

## Example

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


## Permitted Bash Syntax

* Variable declarations are allowed, eg. `a=b`.
* [Comments](https://www.gnu.org/software/bash/manual/bash.html#Comments): `# comment`
* [Quoting](https://www.gnu.org/software/bash/manual/bash.html#Quoting)
  * Escape Characters, used in double quotes: `\newline`, `\"`
  * Single Quotes, no special meaning inside: `'a'`
  * Double Quotes, containes substitutions: `"a"`
* [Shell Expansions](https://www.gnu.org/software/bash/manual/bash.html#Shell-Expansions)
  * Shell Parameter Expansion:
  	* `${parameter:offset}`: substring
    * `${parameter:offset:length}`: substring
    * `${parameter#word}`: match shortest prefix and delete
    * `${parameter##word}`: match longest prefix and delete
    * `${parameter%word}`: match shortest suffix and delete
    * `${parameter%%word}`: match longest suffix and delete
    * `${parameter/pattern/string}`: replace, once
    * `${parameter//pattern/string}`: replace, all


## Prohibited Bash Syntax

All recursion is not allowed.

* [Quoting](https://www.gnu.org/software/bash/manual/bash.html#Quoting)
	* ANSI-C Quoting: `$'a\nb'`
	*	Locale-Specific Translation: `$"a"`
* [Shell Expansions](https://www.gnu.org/software/bash/manual/bash.html#Shell-Expansions)
   Brace Expansion: `a{d,c,b}e`
  * Tilde Expansion: `~/.config`, for home directory
  * Command Substitution: `$(command)` or \`command\` (zip, x264+32, xl2tpd, chibi-scheme, uemacs, llvm, qt-5)
  * Arithmetic Expansion: `$(( expression ))`
  * Process Substitution: `<(list)` or `>(list)`
  * Filename Expansion: must scan directory
  * Shell Parameter Expansion:
      * `${parameter:-word}`: when unset, use `word`
      * `${parameter:=word}`: when unset, set `word` to `parameter`, and use `word`
      * `${parameter:?word}`: when unset, print `word` to stderr
      * `${parameter:+word}`: when set, use `word`
      * `${!prefix*}`
      * `${!prefix@}`
      * `${!name[@]}`
      * `${!name[*]}`
      * `${#parameter}`: get length
      * `${parameter^pattern}`: UPPER ONCE
      * `${parameter^^pattern}`: UPPE ALL
      * `${parameter,pattern}`: lower once
      * `${parameter,,pattern}`: lower all
      * `${parameter@operator}`: special operations
      * `${parameter/#pattern/string}`: replace, only match prefix
      * `${parameter/%pattern/string}`: replace, only match suffix


### Patterns

[Pattern Matching](https://www.gnu.org/software/bash/manual/bash.html#Pattern-Matching) is only used in `${parameter/pattern/string}`. Only `*` and `?` is supported.

