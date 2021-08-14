+++
title = "Is AOSC OS Right for Me?"
description = "Some important and not so important notes..."
date = 2020-05-04T03:37:21.732Z
[taxonomies]
tags = ["sys-info"]
+++

# What Is AOSC OS, Anyways?

Good question, we have been exploring this question for a long time now. But through the seven years of its development, it has become increasingly clear that we are building this Linux distribution with several subtle features that we find essential. Though first, let's return to the basics...

AOSC OS, in its recent years (since 2014), is an independently built and maintained distribution, meaning that in contrast to distributions like Ubuntu, which is built upon packages from Debian - AOSC OS developers source software provided in the distribution independently and build them with configurations maintained by the same developers. Not that it is an overtly noticeable feature, but it allows for our own, say, "creative freedom" when it comes to making the distribution into what we really wanted it to be - according to our philosophies and the suggestions from our community.

That said, AOSC OS is only one of the several thousand Linux distributions out there, it builds upon the powerful Linux Kernel and applications made by many around the world. We understand that it could be difficult to determine a Linux distribution to go with - whether it be the first time, or the 100th time - the goal of this Wiki page is to offer a multi-aspectual description of AOSC OS to help you in the decision process.

# What Are We Trying to Achieve?

AOSC OS is built in a multi-year effort by a collective of volunteers, who possess certain degrees of knowledge about the making of a Linux distribution. AOSC OS started its life as an independent distribution not since its first day of existence, but after three years of experimentation with AnthonOS as derivative distributions built on openSUSE and Debian. In 2014, we have determined to build AOSC OS independently to gain full control on the design and maintenance of packages and their updates.

Through the years following we have discovered that AOSC OS has been built upon the following goals and philosophies:

- There should be no package splitting (like `libsndfile` splitting into a runtime package `libsndfile` and a development package `libsndfile-devel`) unless absolutely necessary or reasonably justified.
- There should be minimal changes to the packages themselves unless it's a bug-fix unmerged at the upstream, or a necessary change to make it work properly in AOSC OS.
- There should be little variation between users of different languages, with particular attention to CJK (Chinese, Japanese, and Korean) users - specifically, in font rendering and application display/layouts.
- While open source and free software makes up the majority of the software repository, proprietary and commercial software should not be omitted unless their licensing suggests otherwise.
- The distribution should attain minimal branding or distribution specific information, regarding the distribution itself as a tool designed according to the users' needs, not to their "brand recognition".
- There is no point in providing an update if it breaks the user experience - specifically, when it renders basic functionalities unusable. However, software updates should be provided as soon as possible.
- AOSC OS should provide similar (but reasonably reduced or added) functionalities across various architectural ports, while regarding them as personal devices capable of desktop and/or server usage.

# How Is AOSC OS Like?

With all these philosophies above, AOSC OS has been built by large in accordance to them. To avoid long paragraphs, this discussion will be organised into a pro's-and-con's listing.

## Pros

- AOSC OS installs quickly, works out of the box, and comes with most tools necessary to begin working from the 0th minute, including utilities necessary for Internet connection in restrictive countries and regions.
- It's relatively simple, when it comes to software installation and removal.
- All "language packs" along with appropriate fonts are pre-installed, and a simple command or GUI (GNOME and Plasma Desktop) allows for quick language switching.
	- Some AOSC developers have been participating in L10n (localisation, or simply translation) work upstream, mainly for zh_CN (Simplified Chinese). Upstreams like WineHQ, FreeDesktop.org, GNOME, MATE, and LMMS, etc. benefit from our contribution, and these improvements benefit users of other Linux distributions or these specific applications on other operating systems.
- Adequate support for 32-bit x86 applications (natively on AMD64, and via Qemu user emulation on other architectures) and Windows applications via Wine, with adequate testing and adaptation for CJK languages.
- Apart from the installation process, you should feel no difference in appearance and usage with AOSC OS across our [supported architectures](@/aosc-os/information/arch-specs.md) - of course, depending on the performance of your devices, your mileage may vary.
- Proprietary software, like the closed-source NVIDIA Unix driver packages, Google Chrome, Opera, and device firmwares (`firmware-nonfree` necessary for many wireless cards and graphics cards) can be easily obtained via our main repository.
- A relatively strong software collection built upon user suggestions and active work of our developers.
	- Software addition and updates could be easily requested on our community IRC and Telegram groups via the `/pakreq` and `/updreq` bot commands; additionally, any optimisation suggestions could be similarly made via the `/optreq` command. Developers can be easily reached most of the time.
- According to user feedback, AOSC OS has satisfactory out-of-the-box energy conservation policies, and it runs relatively cool on laptop computers.
- AOSC OS optimises its binary according to a "maximised set" of instructions and SIMDs available to particular architectures.
- You'd barely feel the existence of AOSC OS, no logo, no branding, no in-your-face banners.


## Cons

- As it currently stands, AOSC OS does not provide an automatic (or even better, graphical) installation wizard, and requires manual input to install - which would most likely be daunting for first-timers. It also lacks a Live medium for user try-outs.
- It's **heavy**, as packages and software are installed on a larger unit, it requires more available storage than most Linux distributions with similar amount of applications installed.
	- This issue is further exacerbated with pre-installed language data and fonts, especially CJK fonts, which could take up to a gigabyte of space in most default configurations.
	- AOSC OS's modularity is noticeably hampered by this feature.
- No `multilib` or `multiarch`, making cross-architecture development more difficult than "universal" distributions like Fedora and Debian.
- AOSC OS will not make it into the Free Software Foundation's [List of Free GNU/Linux Distributions](https://www.gnu.org/distros/free-distros.en.html) in the foreseeable future, for it provides non-free software, and is (probably?) illegal to re-distribute in countries like the United States.
- Compared to more mature Linux distributions, AOSC OS should still grow its software repository.
- Limited human resource, which means package updates and additions (actively or requested) could be delayed.
	- Bugs may exist and come unnoticed, and they can also take time to be fixed.
- You'd barely feel the existence of AOSC OS, or for others to realise what you are running - no show-off for you, by default.
	- Also, let's face it, we are not particularly well-known.

# Should I Try AOSC OS?

Now that you have read through all those boring marketing material, time to make your call. So, here's a subjective but justified (?) guide to your decision making...

## Give it a shot, if...

- You have a computer of the [AMD64](@/aosc-os/installation/sysreq/amd64-notes-sysreq.md), [ARMv7](@/aosc-os/installation/sysreq/arm-notes-sysreq.md), [AArch64](@/aosc-os/installation/sysreq/arm-notes-sysreq.md), [Big-Endian PowerPC 32-bit 64-bit Macintosh](@/aosc-os/installation/sysreq/powermac-notes-sysreq.md) architectures.
	- And they come with adequate storage availability for the present and the future, by your judgement.
	- Stable Internet connection for updates and security advisories (subscription optional at [security@lists.aosc.io](mailto:security@lists.aosc.io).
- You don't particularly like configuring your system and expect a functional system without much tweaking.
- You are a speaker of the CJK languages.
- You expect to find software that you use daily, and are ready to ask for them otherwise.
- You are ready to wait for certain updates and do not expect software updates to come on Day One.
- You are security conscious and expect quick security updates.
- You are energy conscious (say, you go out a lot with your laptop) and hate excess heat when running Linux.
- You don't care much for distribution branding.
- You would like to get into AOSC OS development or to know about its internals and details, as it is dead simple to find a developer willing to guide you in the process.

## Ask us for advice or leave it, if...

- You have never installed Linux before or do not know basic Linux/\*nix commands, or really, you can't be bothered to read the documentation and follow the steps.
- You are expecting a light-weight and modular Linux distribution, this is **not** why AOSC OS is here.
- You either hate frequent system updates, or are impatient for cutting-edge features.
- You expect the system to work out-of-the-box 100% of the time and your use case could not in any way allow for instability and breakage - we are sorry but it happens with AOSC OS, at least for now.
- You find the principles of using free software necessary, and could not allow any non-free software to be installed on your computer.
- You want to make it known that you are using AOSC OS, or make the distribution remind you of the fact - thanks for loving our logo by the way!
