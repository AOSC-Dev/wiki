+++
title = "ACBS Package Metadata Language"
description = "Reduced Bash syntax for describing packages"
+++

`apml` is a subset of the Bash command language used to describe the metadata of an AOSC OS package. 

Generally, it includes Bash's syntax of variable definition and shell expansion, but not command execution (i.e. command execution, pipes and work control). This is done in several reasons:

* To keep compatibility between tools (i.e, autobuild3 and acbs).
* To be easily parse-able.
* To encourage maintainers to write readable packaging scripts.

Note that apml is not stable yet. It may be subject to change in the future.


# Variable declarations
Variable declarations are allowed, eg. `a=b`.
* Only ASCII characters permitted in variable name.
* Unicode is allowed in field.


# Comments
[Comments in Bash reference](https://www.gnu.org/software/bash/manual/bash.html#Comments)

Single line comment and inline comment are supported.

```bash
# A comment line
a=b # inline comment
```

# Quoting
[Quoting in Bash reference](https://www.gnu.org/software/bash/manual/bash.html#Quoting)
* Escape Characters, used in double quotes: `\newline`, `\"`
* Single Quotes, no special meaning inside: `'a'`
* Double Quotes, containes substitutions: `"a"`


# Glob pattern
All bash glob patterns except Bash Extended Globbing are supported.

See more about glob patterns on [glob(7)](https://man7.org/linux/man-pages/man7/glob.7.html). Note that glob is NOT regular expression.


# Shell Expansion
[Shell Expansions in Bash reference](https://www.gnu.org/software/bash/manual/bash.html#Shell-Expansions)
## Substring
* `${parameter:offset}`: substring
* `${parameter:offset:length}`: substring

If `offset < 0`, then the offset must be inside parentheses and the starting point is `length - offset`.

If `length < 0`, the result would be an empty string.

## Match prefix/suffix and delete
Glob patterns can be used in `word`. 

* `${parameter#word}`: match shortest prefix and delete
* `${parameter##word}`: match longest prefix and delete
* `${parameter%word}`: match shortest suffix and delete
* `${parameter%%word}`: match longest suffix and delete
## Replace
Glob patterns can be used in `pattern`. 

* `${parameter/pattern/string}`: replace, once
* `${parameter//pattern/string}`: replace, all
* `${parameter/#pattern/string}`: replace, only match prefix
* `${parameter/%pattern/string}`: replace, only match suffix
## String manupulation
Glob patterns can be used in `pattern`. Characters matched in the pattern will be converted.

* `${parameter^pattern}`: UPPER ONCE
* `${parameter^^pattern}`: UPPER ALL
* `${parameter,pattern}`: lower once
* `${parameter,,pattern}`: lower all
## Miscellaneous
* `${parameter:?word}`: when unset, print `word` to stderr
* `${#parameter}`: get length of the parameter
* `${parameter:-word}`: when unset, use `word`
* `${parameter:+word}`: when set, use `word`
