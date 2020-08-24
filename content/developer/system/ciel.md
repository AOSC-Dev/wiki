+++
title = "Using Ciel for AOSC OS Packaging"
description = "Using standardised and containerised environments for AOSC OS packaging."
date = 2020-05-04T03:35:40.655Z
[taxonomies]
tags = ["dev-sys"]
+++

# What is Ciel?

Ciel is a multi-instance management frontend for [BuildKit](@/developer/system/preparing-a-build-environment.md#buildkit) containers based on [systemd-nspawn](https://www.freedesktop.org/software/systemd/man/systemd-nspawn.html) and [OverlayFS](https://www.kernel.org/doc/Documentation/filesystems/overlayfs.txt). Ciel also manages Autobuild3/ACBS configurations, ABBS trees, APT repositories, network behaviours, and various other aspects that affect the build environments.

Thanks to the utilisation of OverlayFS, Ciel also provides mechanism for quickly rolling back build environments to their minimal "clean" state, while retaining a "base" layer for persisting system updates.

# Using Ciel

## Deploying Ciel

If your host machine runs AOSC OS, Ciel is available from the [community repository](https://repo.aosc.io/):

```
# apt install ciel
```

Otherwise, you will have to build Ciel yourself, and take note of the following system requirements:

- The system runs on [systemd](https://www.freedesktop.org/wiki/Software/systemd/), and `systemd-nspawn` is available (found in `systemd-container` for Debian and derivatives, for instance).
- OverlayFS support (the `overlayfs` Kernel module).
- A working Go toolchain (Google or GNU; >= 1.8 tested).

And now, build Ciel:

```
$ git clone https://github.com/AOSC-Dev/ciel
$ make
# make install
```

Finally, find a good place to initialise Ciel:

```
$ cd /path/to/your/future/workspace
# ciel init
```

## Deploying a Container

By default, Ciel downloads and extracts the newest BuildKit tarball found in the repository - simply execute the command below:

```
# ciel load-os
```

*You may also choose to download any other system tarballs from the [system release site](https://releases.aosc.io/), or any other system tarballs that uses the systemd init system (for the purpose of systemd-nspawn).*

## Deploying an ABBS Tree

By default, Ciel clones the `aosc-os-abbs` tree on the `testing` branch - simply execute the command below:

```
# ciel load-tree
```

Otherwise, you may clone your own tree to the `TREE` directory at your Ciel workspace directory:

```
$ cd /path/to/your/future/workspace
# git clone https://git/random-repository.git TREE
```

## Global Configuration

The following step configures the "base" layer of the Ciel environment, or the "global configuration":

```
# ciel config -g
```

And follow the instructions on your console:

```
             detect autobuild3 OK
                   detect acbs OK
                 set tree path OK

                           === Maintainer Info of UNDERLYING OS ===
                           >>> (Foo Bar <myname@example.com>): Dear Maintainer <maintainer@aosc.io>

                set maintainer OK

                           === Would you like to disable DNSSEC feature of UNDERLYING OS? ===
                           >>> (yes/no): yes

                disable DNSSEC OK

                           === Would you like to edit sources.list of UNDERLYING OS? ===
                           >>> (yes/no): yes
```

Inputting `yes` at the last question will launch GNU nano for you to edit `/etc/apt/sources.list` (the APT repository configuration file) in the container.

## Managing Instances

To create a Ciel instance:

```
# ciel add $INSTANCE_NAME
```

And configure the instance that you've just created:

```
# ciel config -i $INSTANCE_NAME
```

The instructions on the console will be the same when you perform a [global configuration](#global-configuration), just note that any configuration that deviates from its global counterpart will be *overridden*. This step also registers the ABBS tree with the instance.

To list the statuses all instances found in the workspace, simply execute:

```
# ciel
```

To execute a shell in a particular instance:

```
# ciel shell -i $INSTANCE_NAME
```

To shutdown a particular instance:

```
# ciel down -i $INSTANCE_NAME
```

To shutdown *all* instances:

```
# ciel down
```

To delete a particular instance:

```
# ciel del $INSTANCE_NAME
```

## Building and Rolling Back

As mentioned above, Ciel's advantage lies in the fact that it allows for containerised build environments that can be easily rolled back to their "clean" state (or the "base" layer without overlayed changes). As specified in the [AOSC OS Maintenance Guildelines](@/developer/system/maintenance-guidelines.md#the-builds):

*While building packages, the build environments must be controlled, updated, and minimal, where packages are only installed as required by the build-and-run-time dependencies.*

Ciel can help you achieve just that. In a standard packaging routine, maintainer will first ensure that their Ciel workspace is up-to-date:

```
# ciel update-os
```

Then, a package is built from the ABBS tree, for instance, `extra-editors/vim`:

```
# ciel build -i $INSTANCE_NAME extra-editors/vim
```

Or in a short form:

```
# ciel build -i $INSTANCE_NAME vim
```

Vim would be built successfully, hopefully - and the maintainer will see the resulting package(s) in `OUTPUT/`. The maintainer then must rollback the instance before re-using it for the next package:

```
# ciel rollback -i $INSTANCE_NAME
```

## The Lazy-n-Dirty Way

Ciel also allows for building a series of packages in the same instance. This is useful for larger package groups, like the `groups/kde-applications` sequence, containing 200+ packages. Ciel does not yet support generating a local repository, so for now, sequentially built packages cannot be built in a clean environment. While this is by no means encouraged, this is unfortunately still a necessity in a manual package routine.

To build a series of packages in one session:

```
# ciel build -i $INSTANCE_NAME nano vim emacs
```

# Known Issues and Workarounds

Ciel's own implementation, as well as `systemd-nspawn`'s container management routines are by no means perfect, and sometimes issue may arise. Here are a list of issue-and-solutions that we have found during our maintenance workflow.

## Instances Takes a Long Time to Shutdown

Sometimes when `ciel down` was executed, the instance(s) may take 90 seconds (or any amount specified by the systemd configuration) to shutdown - or fail to shut down at all (while Ciel shows an "OK" regardless).

In this case, you may wait for a minute or two and retry. However, executing `ciel doctor` may help you investigate the current state of the instance(s), and [report it to us](https://github.com/AOSC-Dev/ciel/issues/new).

## Failed .scope for Instance(s)

Sometimes, when attempting to launch an instance (and this happens sometimes after repeated use), you may see an error message similar to the one below:

```
2018/07/06 01:12:27 build.go:107: cancelled: Failed to register machine: Unit machine-amd64_40001.scope already exists.
```

Or simply:

```
instances.go:184: session was accidentally terminated
```

In this case, refer to the `.scope` name above, and execute the following command:

```
# systemctl reset-failed machine-amd64_40001.scope
```

Executing `ciel doctor` may help you investigate the current state of the instance(s), and [report it to us](https://github.com/AOSC-Dev/ciel/issues/new).