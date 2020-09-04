+++
title = "AOINB Builder"
description = "The WIP builder component of AOINB."
date = 2020-05-06T13:02:12.568Z
[taxonomies]
tags = ["dev-automation"]
+++


# Requirements

- `python3`, obviously.
- `python-tomlkit` for TOML parsing.

# Usage
The typical workflow is:
1. Compose config files.
2. Load BuildKit via `load-baseos` 
3. `update-baseos`
4. Build!

## Config
`aoinb-builder` requires a configuration folder to run. The folder should looks like this:

``` bash
aoinb-builder
├── config.toml
└── source_lists
    ├─── stable.list
    ├─── testing.list
    └─── ... and so on.
```

`config.toml` is the main configuration file. Here is an example.

``` toml
# work_dir: where all the work happens.
work_dir = "/var/cache/aoinb/work" 
# arch: the architecture of the build machine. only used to determine BuildKit download url for now.
arch = "amd64"
```

The `source_lists` folder contains the `sources.list` file used inside the instance overlay. You can change branch and use preferred mirror by editing the corresponding file inside this folder.

## Executable
`aoinb-builder` will automatically populate all the directory it need, so be careful when choosing the working directory in the config file as mentioned before.

Notice that since AOSC OS's building process involves mounting OverlayFS and using `systemd-nspawn`, root permission is required.

By default `/var/cache/aoinb/conf` is used to search for configs, but you can manually specify the path by offering `-c $PATH`.

Here are all the sub-commands:

### build
This is the main command we will be using. To use it, simply run:

``` bash
python3 aoinb-builder.py build $PATH_TO_BUILD_BUNDLE $BRANCH
```

The so-called "build bundle" is the folder that contains `spec` file and `autobuild/` folder.

The BRANCH used in the command is the destination branch to build upon. A corresponding `$BRANCH.list` must exists in the `source_lists` folder in the configuration folder, otherwise the program will give an error.

### load-baseos
This command installs the base OS (typically BuildKit) to the working directory for future operations.

By default, this command will automatically download the latest BuildKit from repo.aosc.io. But if that's too slow, or you already have a copy of BuildKit, you can just place it in `$work_dir/buildkit_amd64.tar.xz` and the builder will use that directly.

### update-baseos
This command updates the base OS. Note that by now it can only use repo.aosc.io as its repository site.

### cleanup
This command can destroy the specific instance or base OS. This can be useful when thing does not feel right. Options are:
* `all` will destroy all instances and base OS. Handy if you feel like a fresh start.
* `baseos` will destroy the base OS installation.
* Any other string will be interpreted as an instance name. If such instance exists, it will be destroyed. Otherwise, an error will be given.

# Internals
There are two layers of OverlayFS used.

```
workspace-dir
------------- -> workspace-overlay, workspace-workdir
instance-dir
------------- -> instance-overlay, instance-workdir
buildkit-dir
```

Workspace layer is the temporary place for each build. It will be cleaned up every time the build is finished (whether successful or not).

Instance layer is the layer for different branched. An `apt update && apt upgrade` will be made to this layer each time a build begins.

Base OS layer is, as the name implies, the base layer. It will never be changed unless a manual update command is used (`update-baseos`).

Before every build, the "build bundle" and the `toolbox` is copied to `/buildroot` inside the container. `build.sh` is called by `systemd-nspawn` for the build process. The script will call `download_source.sh` (and eventually call `downloader.tcl`) to download source code as `$VER.bin` and extract it to `/buildroot/build` (For packages that use SRCTBL). Finally, `build.sh` will execute `autobuild` to actually build the package.

After the build finishes successfully, `build.sh` will copy the output deb file to `/buildroot/output` and hand back control to Python. Then the builder will copy the result to `$work_dir/output/$branch/`. Eventually, the builder will delete everything in the workspace overlay (effectively rollback to the inital state of the instance) and exit.

# Proposed RESTful API
* GET /task
Get a JSON-formatted task list.
* POST /task
Create new task. Return task ID.
* PUT /task/$TASKID/build_bundle
Upload build bundle.
* PUT /task/$TASKID/branch
Define build branch.
* PUT /task/$TASKID/build
Initiate build
* GET /task/$TASKID/status
Get JSON-formatted status.
* GET /builder/status
Get JSON-formatted builder status.

# Goals
* ✓ Improve `build.sh` (Finished: 2020-05-07)
* ✓ Implement `update-buildkit` (Finished: 2020-05-07)
* ✓ Add support to GITSRC and other types of VCS (Finished: 2020-05-07)
Question: Still use bash scripts to prepare source codes in the future?
* ? Monitor system resource usage during build 
Plan: Use Python's [https://docs.python.org/3/library/resource.html#resource.getrusage](getrusage) to get process info and use `df` on build folder to get disk usage.
* ? Support group build
* ? Add HTTP REST interface for network building

# Discussions
* Move config folder to `/etc/aoinb-builder/`?
* Should we implement a way to change the sources.list of the base OS?
* How to implement monitoring system?
  * Take rusage data every 3 seconds?
