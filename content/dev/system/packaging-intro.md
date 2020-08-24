+++
title = "Intro to Package Maintenance"
description = "Introductory Guide to AOSC OS Packaging"
date = 2020-05-04T03:36:00.099Z
[taxonomies]
tags = ["dev-sys"]
+++

Welcome! If you are reading this, you are probably interested in contributing to the AOSC OS project. This guide will guide you through all the tools and techniques you need to create, update, and maintain AOSC OS packages.

# Table of contents
## Basics
- [Meet the tools](@/dev/system/basics.md#meet-the-tools)
- [Release model](@/dev/system/basics.md#release-model)
- [Setting up the environment](@/dev/system/basics.md#setting-up-the-environment)
- [Building our very first package!](@/dev/system/basics.md#building-our-very-first-package)
- [Adding a new package](@/dev/system/basics.md#adding-a-new-package)
- [A complete example: light](@/dev/system/basics.md#a-complete-example-light)

## Advanced Techniques
- [Advanced Operations in Autobuild3](@/dev/system/advanced-techniques.md#advanced-operations-in-autobuild3)
	- [Manually Select Different Build Systems](@/dev/system/advanced-techniques.md#manually-select-different-build-systems)
	- [Custom Build System/Compiler Parameters](@/dev/system/advanced-techniques.md#custom-build-system-compiler-parameters)
	- [Custom Build Scripts](@/dev/system/advanced-techniques.md#custom-build-scripts)
	- [Post-Build Tweaks](@/dev/system/advanced-techniques.md#post-build-tweaks)
	- [The autobuild/override Directory](@/dev/system/advanced-techniques.md#the-autobuild-override-directory)
	- [Advanced Patch Management](@/dev/system/advanced-techniques.md#advanced-patch-management)
- [Dealing with Package Groups](@/dev/system/advanced-techniques.md#dealing-with-package-groups)

## Appendix
Here are some useful documentations about the tools we use.
- [Autobuild3 Manual](@/dev/system/autobuild3-manual.md)
- [Ciel Manual](@/dev/system/ciel-manual.md)