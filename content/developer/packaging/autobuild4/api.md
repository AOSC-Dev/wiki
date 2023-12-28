+++
title = "Autobuild4 - API"
[taxonomies]
tags = ["dev-sys"]
+++

# Autobuild4 API Documentation

This page describes the convenience functions provided by Autobuild4.
These functions are implemented as Bash builtins, so they are not unsettable via `unset -f`.

## `bool`

- Usage: `bool <value>`
- Example: `bool "$VARIABLE"`
- Description: This function returns whether the `value` supplied is truthy or falsy.

Truthy value includes:

- `yes`
- `y`
- `true`
- `1`
- `t`

Falsy value includes:

- `no`
- `n`
- `false`
- `0`
- `f`

When used in a conditional expression:

```bash
if bool "$VAR"; then
  echo "true"
else
  echo "false"
fi
```

## `abisarray`

- Usage: `abisarray <variable_name>`
- Example: `abisarray VARIABLE`
- Description: This function returns whether the variable with the given `variable_name` is a normal array.
This function returns false if the variable is not a normal array
(this function does not consider associated array as normal array).

When used in a conditional expression:

```bash
if abisarray ARRAY_NAME; then
  echo "is normal array"
else
  echo "is something else"
fi
```

## `abisdefined`

- Usage: `abisdefined <variable_name>`
- Example: `abisdefined VARIABLE`
- Description: This function returns whether the variable with the given `variable_name` is defined,
even if its value may be empty.

When used in a conditional expression:

```bash
EMPTY=
if abisdefined EMPTY; then
  echo "is defined"
else
  echo "is undefined"
fi
# expected result: is defined
```

## `load_strict`

- Usage: `load_strict <file_name>`
- Example: `load_strict script.sh`
- Description: This function `source` the given script with strict mode enabled.
Any syntax errors or runtime errors in the script will be caught and re-thrown.

## `diag_print_backtrace`

- Usage: `diag_print_backtrace`
- Description: This function prints the stack trace of the current running environment.
Useful for debugging complex scripts.

## `abinfo` `abwarn` `aberr` `abdbg`

- Usage: `abinfo <... values>`
- Description: These functions are your average logging functions.
Any print-outs using these functions will be formatted by Autobuild4 via configured logging format.

## `abdie`

- Usage: `abdie [error_message] [exit_code]`
- Example: `abdie "Error" 127`
- Description: This function prints the stack trace and optionally provided `error_message`.
It will also cause the current shell to exit with optionally provided `exit_code`.
If an `exit_code` is not provided, it will exit with `1`.

## `arch_loadvar`
## `arch_loaddefines`
## `arch_loadfile`
## `arch_loadfile_strict`
## `arch_findfile`
## `abcopyvar`

- Usage: `abcopyvar <variable_name_1> <variable_name_2>`
- Example: `abcopyvar IN_VAR OUT_VAR`
- Description: This function duplicates the variable `<variable_name_1>` to another variable `<variable_name_2>`.
The detailed behavior is dependent of the variable type as shown below:

| Original Type | Operation |
|---------------|-----------|
| Normal String | The duplicated variable will be a reference to the original, meaning if the original variable changes the value, it will change too |
| Normal Array  | The duplicated variable will be created by copying all the elements from the original variable. The duplicated variable will be independent from the original variable. |
| Associated Array | The duplicated variable will be created by copying all the key-value pairs from the original variable. The duplicated variable will be independent from the original variable. |
| Integer       | An error will be thrown |
| Function      | An error will be thrown |

## `ab_concatarray`

- Usage: `ab_concatarray <variable_name_1> <variable_name_2>`
- Example: `ab_concatarray DST_ARGS SRC_ARGS`
- Description: This function copies all the elements from the array variable `<variable_name_2>` and append them
to `<variable_name_1>`.

```bash
A=(1 2 3)
B=(4 5 6)
ab_concatarray A B
echo "${A[@]}"
echo "${B[@]}"
# expected result:
# 1 2 3 4 5 6
# 4 5 6
```

## `elf_install_symfile`
## `elf_copydbg`
## `ab_filter_args`

- Usage: `ab_filter_args <variable_name> <...values>`
- Example: `ab_filter_args ARGS -flto -O3`
- Description: This function removes the specified `values` from the array variable `<variable_name>`.
The removal is done in-place.

```bash
ARGS=(-fno-integrated-as -mcmodel=large -flto -O3 -mxgot -fuse-ld=gold)
ab_filter_args ARGS '-flto' '-O3'
echo "${ARGS[@]}"
# expected result: -fno-integrated-as -mcmodel=large -mxgot -fuse-ld=gold
```

## `ab_read_listing_file`

- Usage: `ab_read_listing_file <file_name> <variable_name>`
- Example: `ab_read_listing_file series OUT_VAR`
- Description: This function reads the specified file `<file_name>` line-by-line and skipping all the lines beginning with `#` (comments).
The result will be converted to an array (each element represents a line) and put to a variable with the name `<variable_name>`.

Given a file named `list.txt`:
```bash
1
2
3
# 4
5
6
```
When reading with:

```bash
ab_read_listing_file list.txt OUT_VAR
echo "${OUT_VAR[@]}"
```

The result will be:

```bash
# expected result: 1 2 3 5 6
```

## `ab_tostringarray`

- Usage: `ab_tostringarray <variable_name>`
- Example: `ab_tostringarray STRING_ARRAY`
- Description: This function converts the variable to an array variable in-place.
Please see the chart below for what changes will be done to the variable.

| Original Type | Operation |
|---------------|-----------|
| Normal String | The variable will be splitted using `IFS` and converted to an array |
| Normal Array  | No change |
| Integer       | The variable will be converted to a string and then converted to an array with only one element |
| Associated Array | The variable will be converted to an array containing all the key names of the original associated array |
| Function      | An error will be thrown |

## `ab_typecheck`

- Usage: `ab_typecheck -ahsif <variable_name>`
- Example: `ab_typecheck -as STRING_ARRAY`
- Description: This function returns whether the variable with the given `variable_name` is of the specified type.
Please see the chart below for what the option means.

| Option | Type |
|--------|------|
| `-a`   | Normal Array |
| `-h`   | Associated Array |
| `-s`   | Normal String |
| `-i`   | Integer |
| `-f`   | Function |

The options can be combined to form an OR-ed type-checking.
E.g. `ab_typecheck -as` will check if the variable is either an array or a string, and will return false if the variable is neither.

```bash
VALUE=()
if ab_typecheck -as; then
  echo "is an array or string"
fi
VALUE2=""
if ab_typecheck -as; then
  echo "is also an array or string"
fi
# expected result:
# is an array or string
# is also an array or string
```

## `abelf_copy_dbg_parallel`
## `abpm_debver`
## `abpm_dump_builddep_req`
