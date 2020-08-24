+++
title = "AOSC OS Maintenance Automation: Design RFCs and Progression"
description = "Current Design Goals and Progression, Also Serves as an Index for AOINB-related Documentation"
date = 2020-05-04T03:49:43.051Z
[taxonomies]
tags = ["dev-automation"]
+++

# Current Design Documents and RFCs

## In Effect

- [Exceptions to the Update Cycles](@/dev/system/cycle-exceptions.md)
- [Known Patch Release Rules](@/dev/system/known-patch-release-rules.md)
- [Intro To Package Maintenance](@/dev/system/packaging-intro.md)
- [AOSC OS Package Styling Manual](@/dev/system/package-styling-manual.md)
- [AOSC OS Maintenance Guildelines (RFC)](@/dev/system/maintenance-guidelines.md)

## In-Progress or Early RFC

- [RFC: AOSC Open Infrastructure forNetwork Building (Graphical Presentation)](https://raw.githubusercontent.com/AOSC-Dev/aoinb/master/docs/aoinb.dot.svg)
- [RFC: Packaging Metadata Syntax](@/dev/automation/packaging-metadata-syntax.md)

# Automation for Metadata Updates

Automated updates to the ABBS Git repo.

## Requirements

- Automatically detect updates from the upstreams.
- Commit, or propose, updates to the Git trees...
	- Changing version number, removing `REL=`, etc (what if updates were only provided as patch? e.g. Bash, Readline, …).
	- Updating checksums.
	- Source link migration (The GnuTLS project changed their release server topology and they must be changed - without 301/302 from the server side - to ensure correct building)?
- Notifying packagers with potential changes with a given update...
	- Send along a copy of changelog so dependencies and build parameters may be changed with manual intervention?

## Current Implementations
  
- Information sources...
	- [PISS](https://github.com/AOSC-Dev/piss): Uspstream version checker.
	- [Anitya](https://release-monitoring.org): Fedora's upstream version checker.
	- [Repology](https://repology.org/): Compares package versions between distributions.
- Automatic metadata editors...
	- [Findupd](https://github.com/AOSC-Dev/scriptlets/blob/master/findupd): Lists and modifies packages' to the latest version.
	- [Bump-rel](https://github.com/AOSC-Dev/scriptlets/tree/master/bump-rel): Bumps revision number.
  - [Increaserel](https://github.com/AOSC-Dev/abbs-meta/blob/master/tools/increaserel.py): Also bumps revision number.
  - [Addchksum](https://github.com/AOSC-Dev/abbs-meta/blob/master/tools/addchksum.sh): Download sources and add checksums to the `spec` files.
  - [Commit-o-Matic](https://github.com/AOSC-Dev/scriptlets/tree/master/commit-o-matic): Automatically generate Git commits.
- Libraries
  - [Bashvar](https://github.com/AOSC-Dev/abbs-meta/blob/master/bashvar.py): Parse spec/defines.
- AOINB components
  - [abbs-meta](https://github.com/AOSC-Dev/abbs-meta): Get package catalog from abbs trees.
  - [dpkgrepo-meta](https://github.com/AOSC-Dev/dpkgrepo-meta): Get package catalog from dpkg/apt sources.list.
  - [Downloader](https://github.com/AOSC-Dev/aoinb/blob/master/worker/downloader.tcl): Download sources.
  - [abbs-dep](https://github.com/AOSC-Dev/abbs-dep): Resolve dependencies.


## To-Do List

Legends: **\!** To-Do, **✓** Completed.

- **\!** ACBS/AOINB: `spec` should include more information about upstream.
- **\!** ACBS/AOINB: `spec` should contain enough information about how to get the latest version numbers.
- **\!** AOSC Packages (site): Current packages.aosc.io JSON does not detect version bumps when its parent link changes (for instance, `https://.../gnome-shell/3.24` versus `https://.../gnome-shell/3.30`).
    - **\!** JSON is also unreliable with `foo-n`, where `n` is a number, package names, as it cuts off at the last `-`.
- **✓** Addchksum: needs a wrapper script - so packagers wouldn’t have to write a for loop just to update checksums (automatic patching would also be appreciated).
  - **\!** FTP handling (although these source links are currently being deprecated, some are here to stay).

# Automation for Building

Build task distribution and collection.

## Requirements

- Reliable build tools (Autobuild3, ACBS) and dispatchers (AOINB, Ciel).
- Improvements to current metadata file formats (`autobuild/defines` and `specs`).
- Build result feedback implementations (Autobuild3, ACBS, Ciel, AOINB).
- Quality assurance integration (Autobuild3, AOINB).
- Automatic rebuild dispatching (Autobuild3, ACBS, AOINB).

## Current Implementations

- Autobuild3: Automatic packaging from specifications (`autobuild/defines`) and scripts (everything else).
- ACBS: Build process and package tree management.
- Ciel: Build environment (container) management.
- `p-vector`: apt source generation, and QA analysis.
- AOSC OS Packages (site, abbs-meta): metadata collection and presentation.

## To-Do List

Legends: **\!** To-Do, **✓** Completed.

### Tasks Assigned to (or Mentioned by) [Gumblex](https://github.com/gumblex)

- **✓** Autobuild3: Reliability issues with build scripts.
- **\!** Better spec format and downloader.
   - **\!** ACBS/AOINB: Multiple sources.
   - **\!** ACBS/AOINB: Parallel download for many packages (aria2c, multiple wget, etc.).
- **\!** ACBS/AOINB/Ciel: Proxy support for build tools.
- **\!** ACBS: Better dependency resolution ([abbs-meta](https://github.com/AOSC-Dev/abbs-meta) integration?).
- **\!** Autobuild3: Limit Bash syntaxes in autobuild/defines (see [RFC: Packaging Metadata Syntax](@/dev/automation/packaging-metadata-syntax.md)).
- **✓** Build result feedback.
   - **✓** Autobuild3/ACBS/AOINB/Ciel: Package builds failed/succeeded (Since Autobuild3 `v20200320` and Ciel `v2.4.4`).
   - **\!** AOINB: Package build time/memory/disk requirement stats.
   - **\!** AOINB: Build time benchmark (per core).
   - **\!** AOINB: Parallel utilization (average CPU% / core number)
   - **\!** AOINB: Max memory/disk requirements
   - **\!** AOINB: Build logs.
- **\!** QA (Quality Assurance).
   - **\!** ACBS/AOINB: Post-build testing.
   - **\!** ACBS/AOINB: Run-time testing (in a container/virtual environment).
        - Other specified tests.
   - **\!** Autobuild3: Package installation test (may be separated from the building process).
   - **\!** Autobuild3: QA throughout the build process (before and after checks).
   - **\!** Autobuild3: Package relationship checks (4xx issues, dependencies, etc.).
   - **\!** AOSC OS Packages (site): Unified QA feedback.
- **\!** Build distribution.
   - **\!** AOINB: BOINC-like, out-of-the-box compiling.
   - **\!** AOINB: Distribute tasks based on resources available.
   - **\!** AOINB: Machine and package statistics.
   - **\!** AOINB: Provide a path for manual packaging.
   - **\!** AOINB: E-mail reports.
- **\!** Auto-rebuild.
   - **\!** ACBS/AOINB: Rebuild all reverse sodeps on sover/soname changes.
   - **\!** ACBS/AOINB: Rebuild for Python, Perl, ... language packages which also require vendor path changes.
   - **\!** Autobuild3/ACBS/AOINB: Implemented by editing spec/define files accordingly.
- **\!** Improvements to the `spec` files...
    - **\!** `VERCHECK`: Method to check for updates.
        - **\!** `github:org/repo` (matching https://github.com/\$org/\$repo).
        - **\!** `gitlab:org/repo` (matching https://gitlab.com/\$org/\$repo).
        - **\!** `gnu:bash` (matching https://git.savannah.gnu.org/cgit/\$PKGNAME).
        - **\!** `gnu:coreutils` (matching https://ftp.gnu.org/gnu/\$PKGNAME).
        - **\!** `freedesktop:dbus/dbus`.
        - **\!** `freedesktop:libreoffice/core`.
        - **\!** `dirlist` (matching https://\$URL/\$PKGNAME/).
    - **\!** `CHKPARAM`: Other parameters for `VERCHECK`.
    - **\!** `VERFMT`: Package version formats.
        - **\!** Which is major, minor, patch / which break things.
        - **\!** Discussion needed.
    - **\!** `WEBSITE`: Upstream homepage (metadata information only).
- **\!** ACBS/AOINB: Modularized solution. One tool for one function.
    - **✓** Metadata: `abbs-meta`, `packages-site/dpkgrepo.py.`
    - **✓** Move dpkgrepo.py to an independent repo: [dpkgrepo-meta](https://github.com/AOSC-Dev/dpkgrepo-meta)
    - **✓** Source downloader: `aoinb/worker/downloader.tcl`.
    - **✓** Dependency resolver and topology sorting: [abbs-dep](https://github.com/AOSC-Dev/abbs-dep).
        - **✓** Dependency search stops when the same package name and version (`abbs=repository`) exists.
        - **✓** Topology sorting, without checking repository version.
    - **\!** Build environment manager(s).
          - **✓** Container: [Ciel](https://github.com/AOSC-Dev/ciel).
            - **\!** Use `systemd-run --scope` for more control and stats.
          - **\!** Process tree (group): Reimplement [ACBS](https://github.com/AOSC-Dev/acbs).
          - **\!** Install dependencies via APT.
- **\!** Quality Assurance.
    - **\!** Independent installation tester running in containers (package content, run-time).
    - **✓** Check for problems on library-level: `bigcat-dbg`.
- **\!** Build process manager: The central server
    - **\!** Use PostgreSQL for implementation?
    - **\!** Buildbot management.
        - **\!** Parsing and storing uploaded logs and statistics.
        - **\!** Processing statistics (in database).
        - **\!** Move p-vector's QA functionalities here.
- **\!** APT software repository manager.
    - **\!** p-vector.
        - **✓** Generate apt metadata files.
        - **\!** Manage incoming `.deb` files in a staging are).
        - **\!** Manage `.deb` pools (stacked repositories).

### Tasks Assigned to (or Mentioned by) [Mingcong Bai](https://github.com/mingcongbai)

- **\!** QA in Autobuild3 as a standardised component (or enhancing the current implementation).
    - **\!** Testing templates defined in Autobuild3.
    - **✓** Custom/non-standard DPKG sections, dangling files, incorrect paths (`/usr/local` in distribution packages, etc.).
    - **\!** Source tree permissions (DPKG refuses to package files found in a SUID’d directory, so fix that automatically).
    - **\!** DOS line ending, non-unicode content, ..., in document files (detect the usual suspects, NEWS, CHANGELOG, LICENSE, \*.txt, …).
    - **\!** Package naming, versioning, ...., according to the [Styling Manual](@/dev/system/package-styling-manual.md).
    - **\!** Unquoted `$SRCDIR` and `$PKGDIR`.
    - **\!** Warn packagers if hardening is disabled via `AB_FLAGS_SPECS=0`, also with other platform-specific optimisations (LTO for AMD64 and AArch64, for instance).
    - **\!** Warn pacakgers if build flags were reset or altered in accordance to standard Autobuild3 definition (cache an initial variable set).
- **\!** QA in Autobuild3 with custom scripts (`autobuild/tests/` containing custom test scripts).
    - **\!** `autobuild/tests/pre` inspects source trees and fixes potential problems before build.
    - **\!** `autobuild/tests/post` inspects build results before files are installed in `$PKGDIR`.
    - **\!** `autobuild/test/install` inspects installed files in `$PKGDIR` (expected files, expected file attributes/permissions/ownership/...).
- **\!** QA in ACBS.
    - **\!** Files downloaded from non-encrypted/secure links (http://, ftp://).
    - **\!** Files downloaded without checksum verification (may introduce a standardised format to carry out this task... if multiple source files are to be supported in ACBS, then this and the one above will be non-issues).

### Remarks from [Junde Yhi](https://github.com/lmy441900)

- **\!** A complete re-implementation of all the components we are using
    - **\!** "Ciel 3?"
        - **\!** Distribution-agnostic design.
        - **\!** Assume Ciel 3 can be used in any Linux distribution workflows so the building process is abstracted.
        - **\!** Integrate AOSC OS specific building methods into Ciel 3.
            - **\!** "Provider" scripts that hook to various stages of package building defined by Ciel 3.
            - **\!** "Provider" scripts parses and executes distribution-specific files (in our case, Autobuild3 scripts).
        - **\!** `cield`: A central controller node. All information gathering and task scheduling are done on this node.
            - *This is not covered in this document; I haven't had a clear view of it so far.*
        - **\!** `ciel`: When run as a daemon, ciel accepts command from cield and perform building (while keeping information uploaded back to cield).
- ![Ciel 3 incomplete mock-up](!AOSC%20Automation%20RFC_Talk_Discussion_html_255b1143aeeaab78.png).
    - ![Alternative version](AOSC%20Automation%20RFC_Talk_Discussion_html_606e0b300d25dd80.png)
    - Explanation:
        - The abstracted building process is defined in Ciel 3; Ciel 3 executes all procedures in sequence (from top to bottom).
        - Distribution provider scripts *hook* to different stages of the process, so that when Ciel 3 is executing a stage, they will be instead invoked...
            - Multiple methods can be hooked onto one stage.
            - Each stage has `before` and `after` sub-stages for extra work (they can be treated as general stages too, though).
        - There is (almost definitely) a set of API between provider scripts and Ciel for information passing (if you know Lua, imagine it).
        - In theory any distribution can use this model, and AOSC OS is only one of Ciel's supported supported distributions.
- Command examples...
    - `ciel build linux-kernel -C`: Builds package `linux-kernel` defined in the default tree in the current environment (not using a container).
    - `ciel tree add aosc /home/foo/aosc-os-abbs`: Registers `/home/foo/aosc-os-abbs/` as a Ciel-managed definition tree, naming it as `aosc`.
    - `ciel container instance list`: Lists running Ciel containers.
    - `ciel config packager.identity "Foo Bar <fbar@aosc.xyz>`: Sets packager/maintainer ID (which will be used by Ciel when necessary).
- Command plugins (as is done in Ciel 2).
- Algorithms? There are two sets of problems we need to think about.
    - Algorithms running on the build host/buildbot.
        - Package dependency calculation (whether the current packing environment satisfies dependencies).
        - ...
    - Algorithms running on (or can be split to) the controller machine.
        - New packages availability.
        - Package dependency calculation (build sequence).
        - ...
- I personally am against a completely distributed solution.
