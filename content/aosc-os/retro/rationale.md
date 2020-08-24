+++
title = "AOSC OS/Retro: A Rationale (RFC)"
description = "A Preliminary Survey of AOSC OS, and the World of Modern Computing"
date = 2020-05-04T03:37:49.082Z
[taxonomies]
tags = ["sys-retro"]
+++

Current State of Matters
====

AOSC OS supports plethora of devices - old and new, common and obscure. From your 1999 Apple PowerBook G3 to the latest 64-core workstations, from the business laptops flooding the second hand market to the still elusive PinePhones, AOSC OS will run on them.

AOSC OS is built with a unique set of [design principles](@/aosc-os/is-aosc-os-right-for-me.md) (and philosophies if you must), and each of these principles comes with each of their own consequences. Here we will talk about storage and adaptation of newest technologies.

With our current mainline distributions, as all packages are built with full features and comes with all extra files (documentations and example data, etc.), AOSC OS easily takes up more than 10GiB of space. This sacrifice is worthwhile in our book, as we tend to assume that storage will become increasingly affordable, while your time and energy will stay most valuable.

AOSC OS also takes pride in adapting to latest technologies. Here, you can find the latest Plasma Desktop, GNOME, Firefox, OpenGL support, and Kernels, etc. While newest technologies usually means better user experience and hardware support, it could also come at a cost. For instance, the Plasma Desktop, which many of our developers preferred, is practically unusable on devices with slow storage and GPUs. Our Linux Kernel is also getting larger and requires increasingly more RAM, as new driver support are being merged into the Kernel every few weeks.

With these two points, it should already be apparent that AOSC OS is quite unsuitable for older devices. Before we get into [how we plan to address these issues](@/aosc-os/retro/intro.md), let's take a look at some case studies and issues to get a better idea on the challenges at hand.

Case Study: x86
=========

Let's take for example a Dell Latitude CSx from late 1999...

- Intel Pentium III Mobile, 500MHz.
- 128MiB of RAM as standard.
- 15GiB HDD as standard.
- NeoMagic MagicGraph 256ZX video card with 4MiB of Video RAM and no
  OpenGL acceleration.

Technically, AOSC OS should run on this laptop as-is. However, users will quickly find that its 128MiB of RAM will be quickly filled up as an X11-based desktop environment is loaded, along with a modern Web browser. In fact, one may find itself buried deep in Swap - more Swap will be used than the RAM itself.

The next apparent issue comes from the processor, as a single-core processor from 1999, it will not be fast in current desktop workloads - in fact, a simple GTK+-based terminal emulator's about dialog could quite easily take up 100% processor time for a second or two. Another issue comes in the lack of modern x86 SIMD extensions, such as SSE2/3/4/4.1 and AVX. This means that modern Firefox and Chromium browsers simply won't run on this laptop.

Now, onto the video card - let's face it, 4MiB of Video RAM is simply laughable in this age where a cheap NVIDIA GeForce GT1030 graphics card comes with gigabytes
of Video RAM. This means that the laptop will be limited in both resolution and colour depth (16-bit colours, remember that?). Lacking OpenGL acceleration support also means that modern desktop environments (GL-accelerated GNOME and Plasma) and modern video players (LibVA and LibVDPAU as two main forms of video decoding acceleration) will simply not work.

Lastly, 15GiB of HDD seems like a lot for Linux, but not for AOSC OS. A standard MATE Desktop distribution could take up more than 8GiB of HDD space, and you simply
won't enjoy living with more than 50% of your drive space already taken up by the system - as you update it, and install more features to it, depleting the HDD space will only be a matter of time.

Now how about something even older (that we also plan to support), an Intel 80486-based PC with the following configuration...

- Intel i486DX4, 75MHz.
- 16MiB of RAM.
- 540MiB HDD.
- Tseng ET4600 video card with 4MiB of Video RAM.

Now the issues described above are *greatly* exacerbated. AOSC OS will need significant re-design to properly adapt to these devices. We will continue this discussion in [AOSC OS/Retro: An Introduction to Users and Maintainers](@/aosc-os/retro/intro.md)

Case Study: PowerPC 32-Bit, Big Endian
================

Let's take for example an Apple PowerBook G4 (12-inch, Early 2005)...

- PowerPC 7447A (G4), 1.5GHz.
- 256MiB of RAM as standard.
- 40GiB HDD as standard.
- NVIDIA GeForce FX Go5200, 64MiB of Video RAM, OpenGL 2.1.

Here things are a little better, as we are practially good on both the storage and graphics front: 40GiB of HDD is sufficient for light usage, and the GeForce Fx Go5200 video card supports OpenGL 2.1. This means that the laptop could *technically* support a GL-accelerated desktop environment, as well as basic video decoding acceleration via LibVDPAU.

But hold your horses! The G4 processor, even at 1.5GHz, is only as fast as an early Pentium 4 processor - not to mention that it's only single-core. This means that modern desktop applications are likely not very responsive either. Coupled with only 256MiB of RAM, you are also likely to be heavily relying on Swap. Even though you can easily upgrade to a maximum of 1.25GiB of RAM, a modern browser will eat it up in a matter of seconds.

The biggest issues with big endian PowerPC devices however is application support. AOSC OS has been maintaining PowerPC ports (32- and 64-bit) for over three years now, and we are still struggling to reach a stable distribution. Applications fail to build or crashes, a lot. This is because both x86 and ARM devices are primarily little endian, and big endian codes are often unreliable or flat out broken.

Other Challenges, and the Purgatory of Modern Computing
==================

Hoping that the case studies above have provided enough vivid details, for simplicity's sake, below is a *non-exhaustive list* of other challenges with running modern Linux distributions on legacy devices...

1. **The Age of Thrifty Computing is Dead.** Remember when Bill Gates claimed that we couldn't possibly need more than 640KiB of RAM, and the time when a gaming PC only came with 32MiB of RAM? As applications gained more features, code bases tend to become more bloated. This is not helped by modern development frameworks and libraries either. One glaring example would be Electron-based "native" Web applications. While Electron is useful for building cross-platform applications with consistent user experience, each Electron application is essentially a customised Chromium browser, taking large shares of RAM at a time, not to mention CPU time.
2. **Multithreaded Everything.** For modern devices with multiple processor cores/threads, multithreaded applications help better utilising the devices' processing power and responsiveness on the user side. However, when multiple threads are crammed into a single processor core, as it so often happens with desktop environments, graphical applications, and Web browsers, this brings much detriment to system usability on single-core devices.
3. **Graphical Acceleration Everywhere.** This by itself is not a challenge but in fact a blessing, as graphics cards or GPUs are often under-utilised in desktop workloads. But older video cards are simply not up to scratch to properly support these advanced features, and these workload are then pushed back to the already (badly) hogged processors.
4. **Solid-State Assumptions.** It's increasingly clear that new applications and Kernel schedulers are built with solid-state storage in mind. One simple example would be [systemd](https://www.freedesktop.org/wiki/Software/systemd/) with its concurrent service startup, greatly improving boot times. However, on a mechanical hard drive, concurrent I/O requests could severely impact I/O latencies and thus responsiveness.

Why Bother?
=====

*Just for fun.* — Linus Benedict Torvalds

One major pasttime shared by many of our community members and developers is playing with retro computer hardware and devices. We love them for their simplicity and cool features gradually lost with technical advancements. Do you like waking up to the noise of a seeking floppy disk drive?

Now, since we are maintaining a Linux distribution, what better way to make the best out of our hobby by making it run on our retro computers?

The Take-Away
=====

AOSC OS will need significant amounts of changes and tweaks in order to become a viable choice for legacy devices with various constraints. However, we should make clear that we *do not* intend to achieve this by creating another distribution, adding to our already heavy maintenance workload.

We intend to maintain AOSC OS for legacy devices in what is called a [Retro](http://github.com) branch, with longer update cycles and a limited set of packages available from the repository. The Linux distribution built from this branch will be known as ["AOSC OS/Retro"](@/aosc-os/retro/intro.md).
