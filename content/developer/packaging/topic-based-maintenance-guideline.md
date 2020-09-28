+++
title = "AOSC OS Topic-Based Maintenance Guidelines (RFC)"
description = "General Procedural Guidlelines for AOSC OS Package Maintenance"
date = 2020-05-04T03:35:53.850Z
[taxonomies]
tags = ["dev-sys"]
+++

# Introduction

Effective Fall 2020, AOSC OS ends its use of seasonal iteration cycles, and
moves to a new iteration schedule based on "topics." A topic in this case
refers to "campaigns" in which one or more packges updated, rebuilt, or
changed.

## Rationale

This change is made in response to the increasing challenge for maintainers
to keep up with iteration cycles, and its various shortcomings. For instance,
although our Spring 2020 iteration cycle was completed on time, it came at a
cost of reduced work (or accomplishments, to put it bluntly). New packages are
also forced to go through `testing-proposed`, `testing`, and finally landing
in `stable` on a cyclic schedule, it takes at least three months to reach
`stable` users. Furthermore, our current system of [Exceptions](/developer/packaging/cycle-exceptions/),
updates are not sufficiently tested, as dependencies of Exceptions are also
allowed to be updated on the same exceptional basis.

## An Illustrated Comparison

Topic-based iterations deprecates the current six-branch architecture as
described in our old [AOSC OS Maintenance Guidelines](/developer/packaging/maintenance-guidelines/),
and instead considers each update (e.g. GNU Nano 5.4) or wave of updates
(KDE Applications 20.08) a "topic," each maintaining its own build-test-ship
pipeline.

For instance, to update KDE Applications 20.04 to 20.08, in the old iteration
cycle, it goes as follows:

| Procedure | Work                                                                              | Time Frame                      |
|-----------|---------------------------------------------------------------------------------- |---------------------------------|
| Survey    | Maintainer finds KDE Applications 20.08 update, reads changelog and announcement  | Non-Freezing Period (~2 Months) |
| Packaging | Maintainer packages KDE Applications 20.08, commits changes to `testing-proposed` | Non-Freezing Period (~2 Months) |
| Testing   | Maintainer pushes package to repository for testing                               | Until End of Cycle (~3 Months)  |
| Shipping  | Maintainer merges branches and moves packages to `stable` for general adoption    | End of Cycle (~3 Months)        |

In the new system, instead of a set three-month (or often times longer)
iteration, in which other packages are mixed in with KDE Applications 20.08,
the procedures goes as follows (with assumed time requirement):

| Procedure    | Work                                                                                                                                                          | Time Frame                       |
|--------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------|
| Survey       | Maintainer finds KDE Applications 20.08 update, reads changelog and announcement                                                                              | Day of Update Discovery (Day 1)  |
| Discussion   | Maintainer discusses the suitability of said updates with other maintainers                                                                                   | Day of Consensus Reached (Day 3) |
| Packaging    | Maintainer creates a topic branch `kde-applications-20.08` and packages updates                                                                               | Day of Build Completion (Day 7)  |
| Testing      | Maintainer pushes KDE Applications 20.08 to a `kde-applications-20.08` repository                                                                             | Day of Build Completion (Day 7)  |
| Notification | Maintainer notifies other maintainers and users of such repository, opens a Pull Request for audition                                                         | Until Approval (Day 14) |
| Shipping     | Mainatiner merges `kde-applications-20.08` into `stable`, rebuilds all packages against `stable`, uploading rebuilt packages to `stable` for general adoption | Day of Second Build Completion (Day 16) |

In this sense, KDE Applications 20.08 could be surveyed, discussed, packaged,
tested, and shipped according to its own time requirement. As KDE Applications
are (supposedly) used by many, testing could be done in a relatively short
period of time, massively shortening the old (up to) 3-month aging period.

This procedure will be discussed in detail in the subsequent sections.

# Definitions, Rules, and Procedures

This section denotes conceptual definitions, rules, and procedures for
maintainers.

## Definitions

A "topic" is an act of updating, rebuilding, and changing one or more packages.
In each topic, only a minimal set of package(s) affected is included. Each
topic is a self-contained (and thus independent \[from other topics\]) cycle of
surveying, discussion, packaging, testing, notification, and shipping.

## Rules

1. A topic is to be as specific as possible, only including the exact package
   intended for update, rebuild, or change.
    - The only exception to this is when multiple packages "naturally belong"
      or "could be reasonably bundled together." Generally, a wave of updates
      to a desktop environment (GNOME 3.38; Plasma 5.20), similar packages
      (various RIME data packages), or packages whose updates trigger rebuilds
      (Boost 1.73) falls under this exception.
2. A topic, once complete, is never to be re-used.
3. A topic should never conflict or cast influence on another in such a way
   that requires a rebase.
    - Prior to creating a topic, maintainers should discuss with others during
      daily communication or weekly meetings to work out possible inter-topic
      conflicts.
    - Once potential conflict(s) is found, maintainers should discuss among
      themselves to delay one or more topics as necessary.
    - If a conflict were accidentally created, then maintainers should work out
      a plan to rebase one branch against another.
4. A topic should be named in the format of `$PKGNAME-$PKGVER`
   (e.g., `nano-5.4`). Repository branch naming follows topic name (e.g.,
   `nano-5.4`).
    - Non-update topics should be named by purpose, in the format of
      `$PKGNAME-$PURPOSE` (e.g. `gnome-shell-build-fix`,
      `gnome-shell-ppc64el-adaptation`.
    - In case of multi-package topics, topics takes name from the "main player"
      along with its general version, e.g. `gnome-3.38`, `boost-1.73`.
    - In multi-package, multi-version topics, use main package name and date
      of update survey, e.g. `rime-data-20200928`.
5. When building packages for a topic, a clean environment is required for each
   package. This means rolling back each environment to a bare BuildKit, before
   building the next.
    - There is no exception to this rule.
6. When a topic's work is complete, open a Pull Request for audition.
   Maintainers are directed to test affected packages, users are also notified
   via a topic manager installed on their AOSC OS deployment.
    - When testing is done, merge pull request.
    - A tag is then created, and the working branch deleted.
    - Rebuild all affected package(s) against a stable environment before
      uploading to the `stable` repository. Old scratch builds are archived.
7. Testing cycles are indefinitely long, but a package, once tested in each
   respective architecture, they are green-lit and a topic is then marked
   "done."
    - Stale cycles are great evidence for unmaintainable package, drop them.
    - Never merge package due to staleness.

## Topic Cycles

A topic-based iteration cycle follows these general steps:

- Survey: Maintainers are notified or finds out about a new update, or change
  required to one or more packages.
- Discussion: Maintainers check with others to ensure that there is no
  inter-topic conflict, where packages changed in one topic could hinder upon
  those found in another.
    - An example would be during a Boost version update, all of Boost's
      reverse dependencies (or dependees) would generally need to rebuilt. In
      this case, maintainers beside those working on the Boost topic should
      check if any of their package(s) updated or changed falls under the list
      of rebuilds required by said Boost update. If such update or change falls
      under this list, delay the non-Boost topic, otherwise, proceed as normal.
- Packaging: Maintainers create their topic.
    - Apart from committing and building all updates or changes necessary
      according to each topic's own schedule, maintainers will also register
      their topic on the [TODO: Iteration Editor](#) along with each topic's
      description, list of packages affected, etc.
    - Built packages are then uploaded to its respective repository.
- Testing: Once packaging is complete, maintainers create Pull Requests against
  the `stable` branch.
    - At this point, maintainers are directed to audit Git changes, as well as
      test packages from topic repositories.
- Notification: Maintainers may also encourage users to join the testing cycle
  using their locally installed topic manager. They are free to withdraw.
- Shipping: Once testing is complete, Pull Requests are then green-lit and
  merged into the `stable` branch.
    - At this point, all packages affected in a topic must be rebuilt against a
      clean `stable` environment, before they are pushed to the `stable`
      branch for general adoption.

## Stable Branch Protection

The `stable` branch is protected and no direct commit would be allowed. All
commits should only be merged into this branch following the rules and
procedures described above.

# Special Topics and Exceptions

There are a few topics that requires further clarification, or exceptions
applied to their procedures. This section describes such cases.

## Release Candidate Kernels

Traditionally, AOSC OS packages Release Candidate kernels to give maintainers
a head start on configuration and patch adaptation. However, such maintenance
is a longer process than most topics, usually spanning the whole RC phase
(2 - 3 months).

Thankfully, there is no package conflict possible with other topics, since
this topic should only affect these two packages:

- `linux-kernel-rc`: The Kernel package itself.
- `linux+kernel+rc`: The Kernel metapackage, which tracks and helps
  facilitate Kernel updates.

The following rules and procedures apply for this case:

- One topic per Kernel branch (e.g. one for 5.9, and another for 5.10).
- Merge at end of RC phase, following the testing/notification procedures
  introduced above.
    - RC Kernels are never pushed to the `stable` repository.
    - After the merger, procure Autobuild manifests from linux-kernel-rc
      to linux-kernel, and linux+kernel+rc to linux+kernel.

## New Port Bring-Ups

In case a new port is being brought up (building packages for the first time
for a new port), all rules above still applies (one package per topic for
port adoption). However, to make porters' and other maintainers' lives
easier, the following exceptions are granted:

- Architectural-specific topics do not need to be pushed to the repository.
  However, topic branches should still be created and merged every time,
  although you could do it offline - just for the record.
- Other architectures affected by these build-fixing changes may synchronise
  versions and push packages directly to `stable`.
    - This is based on the assumption that these changes should not affect
      how package functions, and only bears on the fact that
      versions/revisions are different.

## Planned Rebuilds

In case of planned rebuilds, which are done in order to refresh stale
packages. During these planned rebuilds, it is anticipated that a large set
of packages will be built at once. The following exceptions are therefore
granted to this scenario:

- An unlimited amount of packages (up to what is planned) could be included
  within planned rebuild topics.
- Other topics should give way to this topic, all other topics that contains
  package(s) affected by planned rebuild topics should halt until planned
  rebuild is completed.

Planned rebuild topics should be named `planned-rebuild-$DATE`, e.g.
`planned-rebuild-20201225`.

# AOSC OS/Retro

The topic-based procedures and rules does not apply to AOSC OS/Retro.
Updates are synchronised from the `stable` branch annually, and all security
and bugfix changes are committed directly to the `retro` branch.

## Inter-Operability with Mainline

After each synchronisation (or merge) from the `stable` branch, a Pull
Request is created against the `stable` branch as a `retro-tracking-$YEAR`
topic. Follow all procedures and rules above.

# Documentation 

## Changes Required Following This Change

With the transition to topic-based iterations, changes are required in the
following documents:

- [Intro to Package Maintenance: Advanced Techniques](/developer/packaging/advanced-techniques/)
    - Description of branches, the use of `findupd-stable` is deprecated.
- [Intro to Package Maintenance: Basics](/developer/packaging/basics/)
    - Description of branches.
- [.NET Lifecycle Policy](/developer/packaging/dotnet/)
    - Description of branches.

## Deprecated By This Change

With the transition to topic-based iterations, the following documents will be
deprecated:

- [AOSC OS Maintenance Guidelines](/developer/packaging/maintenance-guidelines/)
- [Exceptions to the Update Cycles](/developer/packaging/cycle-exceptions/)
- [Known Patch Release Rules](/developer/packaging/known-patch-release-rules/)
