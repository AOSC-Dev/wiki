+++
title = "Revision Marking Guidelines for Topic Packages"
description = "Automatically Mark Revision Updates for Pre-release Packages"
+++

It has been a long-running issue when packages in testing (topic) repositories were revised and when they were rebuilt for the stable repository, the version and revision numbers never changed. This issue had caused considerable annoyance for users enrolled in topic repositories as well as the maintainers: as the version and revision numbers did not change, the package would get repeatedly overwritten. This means that both the user and the maintainer may not be able to receive package updates (as APT only checks for package sizes and versions as means to identify a version update and, in this case, neither is guaranteed).

In our current workflow, there are two potential scenarios where packages may be overwritten:

- Revising and pushing topic packages
- Stable version updates

This guideline offers a solution to the aforementioned issues by designing a system of revision marking for topic packages, making all revisions visible in the resulting packages.

Pre-release Package Revision Markers
===

This guideline dictates that the revision (`REL`) be marked with the following suffix:

```
${VER}-${REL}~pre${ISO_8601-1_2019_TIMESTAMP}
```

In practice, it would look something like this:

```
5.2.21-0~pre20240731T142407Z
```

The revision marker contains the following components:

- `${REL}`: The main revision number, all packages travelling through the topic-to-stable pipeline should only exhibit 1 revision bump; when the package version gets updated, it should be reset to 0 (or in conventional practice, not specified).
- `~pre`: Pre-release marker, marking the package as a pre-release version (from a topic repository).
- `${ISO_8601-1_2019_TIMESTAMP}`: The corresponding Git commit (not author) timestamp on the ABBS tree, which iterates naturally with time.

Building from Uncommitted (Dirty) Changes
---

If the ABBS tree contains uncommitted changes (Git repository is now put in a "dirty" state), then we should fallback to the build timestamp with an additional `-dirty` suffix:

```sh
vim core-libs/glibc/build
# ABBS Tree is now "dirty"
ciel build -i main glibc # ACBS was launched on 2024-08-05 10:40:15 +0800
# ACBS marks the package with version `2.40-0~pre20240805T024015Z-dirty`
``` 

Mechanics
---

This guideline follows two very simple mechanics:

- When pushing a merged topic package to stable, utilize dpkg's pre-release marker (`~`) to make topic-suffixed `REL` consistently smaller than the final `REL` defined in `spec`.
- When revising a topic package, by using the `${ISO_8601-1_2019_TIMESTAMP}` timestamp, it would always increment with Git commits, making the revised package consistently considered an update by the package manager.

Toolchain Changes
===

Changes to ACBS and Autobuild are required to implement this guideline.

In AOSC OS's maintenance workflow, ACBS calls the `generate_metadata()` function to record the Git commit ID in the `X-AOSC-Commit` metadata. We use a similar method to record and mark Git commit and build timestamps and append it to `REL` in the `spec` file.