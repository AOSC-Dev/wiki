+++
title = "Preparing A Build Environment"
description = "Getting BuildKit, or Go Ciel"
date = 2020-05-04T03:36:02.769Z
[taxonomies]
tags = ["dev-sys"]
+++

# Packaging Environments

You will need a clean environment for your packaging work. Packaging in a unclean, or even personally-used system environment demonstrates a lack of responsibility, and can result in packages with unrecorded dependencies, or other issues that could render a package unusable. A clean environment with *minimal* amount of libraries installed is the *key* to reproducible builds.

## Ciel (Recommended)

Ciel is an integrated, multi-instance, OverlayFS-based systemd container (nspawn) manager - providing functionalities for managing packaging environment(s). More importantly, Ciel can roll-back build environments to its original, clean state with a single command - this allows for an efficient way to ensure a minimal packaging environment.

- [(Broken link) Getting Started with Ciel](/developers/aosc-os-cadet-training/getting-started-with-ciel)

## BuildKit

Traditionally, packages are built in BuildKit, a base-installation of AOSC OS that provides additional development and packaging tools. Packagers will "spawn" package environments with `systemd-nspawn`. After each packaging session, they are trusted to roll-back their environment manually in an expensive routine  - that is, removing the whole system root, and extract a new one and configuring them again.

This method of packaging is now being phased out, and you are encouraged (and eventually required) to use Ciel instead.

- [(Broken link) Getting Started with BuildKit](/developers/aosc-os-cadet-training/getting-started-with-buildkit)
