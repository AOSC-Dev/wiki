+++
title = "Ciel Manual"
description = "(Almost) everything you need to know about ciel."
date = 2020-05-04T03:35:37.353Z
[taxonomies]
tags = ["dev-sys"]
+++

Ciel is a tool for controlling multi-layer file systems and containers, primarily designed for building and distributing Linux distributions based on the DPKG[1] package manager. Ciel also comes with features that allow fast roll-back and merge-down functions.

Ciel uses OverlayFS, whose layering concept is similar to that of Adobe Photoshop. In Ciel, all layers but the one on top are to be locked, while the top layer could be written.

[1] The `clean` command contains a routine to list all files managed by a package manager, which uses the `dpkg -L` command.

# Commands

Ciel contains the following built-in commands:

    init   <tarball>

    drop   [<layers>]
    mount  [--read-write] [<layers>]
    merge  [<upper>..]<lower> [--no-self] path
    clean  [--factory-reset]

    shell  [<cmdline>]
    rawcmd <cmd> <arg1> <arg2> ...

## Initialisation

The `init` command creates directory structures required by Ciel, and unpacks the specified `tarball` to the "bottom layer" of the current OverlayFS structure.

## File System Commands

The `drop` command clears all files and changes made to a specific layer. When no parameter was specified, this command clears changes made to the "upper", or top layer, effectively a roll-back function.  

The `mount` command is provided to **manually** mount a file system, and prints the mount point. This command should only be used where necessary. You would need to unmount and remove the mount point manually when done. File systems are mounted read-only unless `--read-write` is specified as a parameter.

The `merge` command merges file changes downwards. Its first parameter should appear similar to `upperdir..cache`, which specifies the "upper" and "lower" objective of this operation. The `upperdir` part could be omitted - where `upperdir` is specified by default - the first parameter could then be written as `..cache` or `cache`, both of which equivalent to `upperdir..cache`. The parameter `path` should be used to specify the directory in which layer to be merged, where `/` could be specified to merge the layer specified as a whole. Additionally, `--no-self` could be specified to exclude files and directories themselves when merging.  

The `clean` command could be used to clear all files not managed by `dpkg`, primarily designed for creating distributions. The command has a built-in whilelist to omit those files and directories not managed by the package manager, which happen to be essential for the resulting distribution to function properly. The `--factory-reset` parameter could be used to remove additionally automatically generated files such as system host keys (SSL) and systemd machine IDs.

## Container Commands

The `shell` command could carry two functions: to enter a contained/jailed shell and to execute shell commands from within such environments. When no extra parameter was specified, this command would enter the container shell; when commands were appended as parameters to the `shell` command, this command would execute the specified command following from within the container. Do note however that this command would only accept one parameter - command-line strings containing spaces for example, should be surrounded with quotation marks.  

The `rawcmd` command executes programmes from within the container(s). Please use `shell` unless necessary, as using the `rawcmd` for programme invokation would omit all configurations or environment variables defined in Shell configuration files. This command could take multiple parameters as needed, and is otherwise identical in usage as the `shell` command.

# Plugins
Other commands not discussed above, for example, `ciel build` - would be an executable stored in the `/usr/libexec/ciel-plugin` directory as `ciel-build` - Ciel searches this directory for executables named `ciel-*`.

# Additional Notes

Ciel exports the three standard pipes when executing Ciel `shell`, `rawcmd` or plugins, as well as the returned error code/status of that particular command(s).