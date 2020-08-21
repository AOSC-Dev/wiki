+++
title = "AOSC OS Maintenance Guidelines"
description = "General Procedural Guidlelines for AOSC OS Package Maintenance"
date = 2020-05-05T05:13:40.866Z
tags = "dev-sys"
+++

# Introduction

AOSC OS is a multi-branch, seasonal rolling Linux distribution available with over 5,000 packages for multiple microprocessor architectures. As such, maintaining AOSC OS is not a trivial task, and all maintainers should work in accordance to a written guideline to avoid confusion and (the resulting) inconsistent quality.

# The Branches, Cycles, and Ports

The concepts of branches, cycles, and ports are three main aspects that maintenance work revolves around. In this section, we will defines these concepts in the scope of AOSC OS.

## The Branches

AOSC OS is maintained *concurrently* across four branches:

- Stable (`stable`): Main maintenance branch which most users should be using, updates include security updates, bug fixes, [exceptional updates](/dev-sys-cycle-exceptions) and [patch-level updates](/dev-sys-known-patch-release-rules).
	- Stable, Proposed Updates (`stable-proposed`): Feeds said updates into `stable`, unless the current `stable` already requires bug fixes (for instance, a currently available `stable` package has broken dependency). 
- Testing (`testing`): Main feature branch which users with particular interest in following the latest development and changes should be using, security updates, feature/major updates, and new packages are introduced from the `explosive` branch and tested *minimally* before shipping. Updates made available through this branch will be available for `stable` by the end of each update cycle.
	- Testing, Proposed Updates (`testing-proposed`): Feeds said updates into `testing`, packages are introduced and *build-time tested*.
- Explosive (`explosive`): Accepts *any* new packages and updates *outside of the release cycles*. No one should be using this branch, no matter what.
  - This branch is also used for major updates that requires a large amount of rebuilds and/or fixes (e.g. Python 3.7 => 3.8). This is done so that if said update won't fit within the timeframe of a single cycle, and since Explosive is never frozen, it will not affect cycle merging.
- Release Candidate Kernels and Tools (`rckernel`): Complements `stable-proposed` to ship Linux Kernels currently in RC stage, and feeds into `stable-proposed` as the new mainline kernel branch as the final release is made on the upstream.

## The Cycles

AOSC OS is maintained on an seasonal cycle, and thus revolves around a three-month schedule:

- The first two months - or the development period:
	- Iteration Plans (e.g. the *[Iteration Plan for Summer 2019](https://github.com/AOSC-Dev/aosc-os-abbs/issues/1896)*)are drafted and published on GitHub as a milestone issue, and updated frequently by maintainers as new updates are made available and built.
	- Updates are built on all branches and for all ports when applicable.
- The last month - or the freezing period:
	- The `stable`, `stable-proposed`, `explosive`, and `rckernel` branches continues to receive updates as usual.
	- The `testing` branch will no longer accept updates unless they are intended for security or bug fixes.
	- `testing` branch updates will be tested in preparation to become the new basis of `stable`.

## The Ports

AOSC OS is available for many different microprocessor architectures (and thus many different kinds of devices). While some ports will received full-feature packages, there are distinctions based on the nature of the ports. Here below is a brief description:

- AMD64, or x86_64 (`amd64`), the *de facto* main port.
	- All packages will be build-time tested for this architecture.
	- This is the only architecture to build `explosive` updates as a preliminary procedure.
- AArch64 (`arm64`), ARMv7 (`armel`), Little Endian POWER (`ppc64el`), and RISC-V (`riscv64`).
	- All packages should be built for these architectures unless non-applicable or unbuildable.
	- These architectures do not track the `explosive` branch.
- Big Endian PowerPC 32/64-bit (`powerpc` and `ppc64`, respectively), and i586 (`i586`).
	- These architectures are considered part of the "AOSC OS/Retro" project, and do not follow all the rules specified so far.
	- These architectures only track the `stable` branch, with a limited selection of packages deemed usable on older hardware.

# In Practice

This section describes the detailed procedures, which AOSC OS maintainers should adhere to.

## The Tools

The standard set of tools should be used by all maintainers. While we are unable to track the tools you've used (yet), these set of tools are known to generate the cleanest and most reproducible packages so far.

- [Autobuild3](https://github.com/AOSC-Dev/autobuild3), the package generation tool which abstracts building procedures and package metadata into Autobuild3 manifests.
- [ACBS](https://github.com/AOSC-Dev/acbs), organises and manages multiple Autobuild3 manifests in a tree-like fashion, see [aosc-os-abbs](https://github.com/AOSC-Dev/aosc-os-abbs).
- [Ciel](https://github.com/AOSC-Dev/ciel), manages `systemd-nspawn` containers where packaging work are done, with tools for Autobuild3/ACBS configuration, basic containerised environment management (updates and some configuration), and environment rollbacks.
- [pushpkg](https://github.com/AOSC-Dev/scriptlets/tree/master/pushpkg), a simple wrapper script for uploading packages to the [Community Repository](https://repo.aosc.io).

You will also need a LDAP identity to upload packages and to gain access to our relay servers, or [Buildbots](/infra-buildbots).

For the detailed packaging procedures, please refer to the [AOSC OS Cadet Training (Work In Progress)](#) and the [AOSC OS Package Styling Manual](/dev-sys-package-styling-manual).

## The Buildbots

While you are welcome to use your own devices for packaging (given that you are using the tools above), there are fast machines provided by community members, and made available for maintainers.

For more details on gaining access and the various protocols, please refer to the [AOSC Buildbot Information](/infra-buildbots).

## Package Introduction and Maintenance

In principle, AOSC OS accepts and maintains all packages, unless one of the following applies:

- The vendor or upstream does not permit redistribution, or file manipulation (if required or mandated by the [Styling Manual](/dev-sys-package-styling-manual)).
- The vendor or upstream refuses or failed to provide fixes for security vulnerability(ies).
- The package is deprecated by the vendor or upstream.
- The maintainers have voted against the introduction or continued maintenance of a specific (set of) package(s).

## The Builds

While building packages, the build environments *must* be controlled, updated, and minimal, where packages are only installed as required by the build-and-run-time dependencies.

- For instance, when building for `stable`, make sure that *only* the `stable` branch is enabled in your repository configuration; `explosive`, `testing-proposed`, `testing`, `stable-proposed`, and `stable` are enabled when building for `explosive`; ...
- There is an exception when building for `stable-proposed` and `rckernel`, *only* the `stable` branch should be enabled.

## Branch Merging

In the AOSC OS maintenance procedures, branch mergings are bi-directional.

### Merging

With the branch and cycle descriptions specified above - as branch merging serves as the main mean of update introduction for the non-Proposal branches, there are certain limitations applied to the merging procedures.

- During the active phase of an interation cycle, the branch merging follows the direction of: `explosive`; `testing-proposed` → `testing`; `rckernel` → `stable-proposed` → `stable`.
- At the end of each iteration cycle, a full merge would be made: `explosive` → `testing-proposed` → `testing` → `stable-proposed` → `stable`.
- During the one-month freezing periods: the `rckernel` → `stable-proposed` → `stable` merges are permitted, while all other mergings are *not permitted*.

### Reversed Merging

Reversed merges, or `stable` → `stable-proposed` → `testing` → `explosive` merges should be done periodically regardless of the cycle periods. However, during major merges, notifications will be made to prevent inconsistent merging.

The `rckernel` branch should also receive periodic reverse merging: `stable` → `stable-proposed` → `rckernel`.

## Stable Update Testing

Updates for the `stable` branch, unless known to be involved with one or more 0-day security vulnerability(ies) or already broken in `stable`, are committed, built, and tested through the `stable-proposed` branches. `stable-proposed` updates are merged in the following procedure/schedule:

- Every Saturday at midnight, UTC: An issue is generated with a *comprehensive* list of updates committed and bulit on the `stable-proposed` branch.
	- Package names, version deltas (e.g. 1.0.2 → 1.0.3), and changelogs (linked to specific [AOSC OS Packages](https://packages.aosc.io) pages).
	- Checkboxes by each entry.
- Testing procedures are defined case-by-case.
	- TODO: Autobuild3/ACBS automatic quality assurance and reports.
	- Basic functionalities (Launches? Comes with necessary files? Documentation readable and complete?).
	- Styling checked against the [Styling Manual](/dev-sys-package-styling-manual).
- Packages, when tested, will have their respective entry(s) ticked, and packages moved on the repository from the `stable-proposed` pool to the `stable` pool on the package unit (one package "ticked", one moved).
- The weekly issues will remain open for tracking testing work, and closed upon *full completion* (all checkboxes ticked).