+++
title = "Making Use of the Automated Maintenance Infrastructure"
description = "BuildIt! at your service."
+++

# Preface

This page provides instructions on how to complete a simple automated [topic maintenance routine](@/developer/packaging/topic-based-maintenance-guideline.md) with [BuildIt!](https://github.com/AOSC-Dev/buildit). At present, BuildIt! can complete the following tasks:

- Opening a pull request (topic).
- Automatically building topic packages.
- Automatically upload topic packages.
- Report build status.

You will still need to complete the following tasks yourself:

- Opening a branch, make changes to the branch, and committing the changes.
- Editing the pull request body to reflect detailed changes in the branch, helping other maintainers and users understand the changes committed.
- Communicating with other maintainers for review and make changes accordingly.
- Testing relevant packages and reporting test results.

# Routine

This section describes a simple BuildIt! routine.

## Commencing topic routine

Referencing [AOSC OS Topic-Based Maintenance Guidelines](@/developer/packaging/topic-based-maintenance-guideline.md) and [AOSC OS Package Styling Manual](@/developer/packaging/package-styling-manual.md), open the branch, make and commit changes.

Upon completion, you will complete the rest of the maintenance routine using @aosc_buildit_bot on Telegram.

## Authenticating as a maintainer

Input the following command:

```
/login
```

And follow the on-screen instruction to complete GitHub authentication. After granting AOSC's [Minzhengbu](https://github.com/AOSC-Dev/minzhengbu) infrastructure all necessary authentication, please follow the instructions on your Web browser to re-launch a chat session with @aosc_buildit_bot, and **click on the "Start" button on the Bot's chat interface.**

You should then be greeted with the following response:

```
Login successful!
```

At this point, you would have completed your maintainer authentication.

## Opening a pull request

For an example `editors-survey-20231231` topic branch with `nano` and `ed` updates, input the following comamnd to open a pull request:

```
/openpr Editors Survey December 2023;editors-survey-20231231;nano,ed
```

**Note: You must manually specify the build order, delimited by a comma (,)!**

BuildIt! will automatically detect all necessary labels and a list of architecture for which the binaries need to be built.

If you would like to manually specify these information, for instance, to specify `enhancement` as the label:

```
/openpr Editors Survey December 2023;editors-survey-20231231;nano,ed;enhancement
```

To specify that the packages will only need to be built for `amd64`:

```
/openpr Editors Survey December 2023;editors-survey-20231231;nano,ed;;amd64
```

To specify both at the same time:

```
/openpr nano: update to 7.2;editors-survey-20231231;nano,ed;enhancement;amd64
```

**Note: Please use `git rebase stable` to sync changes with the `stable` branch before opening a pull request!**

## Test building

Input the following command to build packages for the topic, using the same example with #9999 as its pull request ID:

```
/pr 9999
```

If you would like to build the `nano` package for `amd64` on this branch:

```
/build editors-survey-20231231 nano amd64
```

BuildIt! will report build progress, results, and logs by posting comments on the pull request; upon build completion, it will also upload the packages to their relevant topic repositories.

## Pushing stable updates

Using the same example, upon completion of review, testing, and merging, simply repeat the command above to build and upload packages to the Stable repository:

```
/pr 9999
```

This marks the completion of a topic maintenance routine.

# Other commands

BuildIt! also provides the following commands:

- `/status` shows queue and server status.
- `/help` displays usage.
