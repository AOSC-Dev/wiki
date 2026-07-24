+++
title = "AOSC OS System Requirements"
insert_anchor_links = "right"
[extra]
list_section = true
+++
AOSC OS is a desktop‑oriented operating system with a relatively complete set of features. The pre‑installed software and basic management facilities impose certain requirements on the device’s processor, graphics card, storage, and Internet connectivity. Based on our testing, we have compiled the following system requirements table, with a *good out‑of‑box experience* as the baseline criterion.

| Component | Requirement |
|-----------|-------------|
| Processor | Any processor compatible with AOSC OS |
| Memory    | At least 2 GiB |
| Graphics  | Graphics card supporting OpenGL 2.1 / OpenGL ES 3.1 or newer |
| Storage   | At least 64 GiB |
| Network   | Internet connection |

## Additional Notes

- For details on processors compatible with AOSC OS, please refer to the [AOSC OS Architecture Support Specification](https://aosc.io/aosc-os/isa).
- When browsing the web, system memory and processor usage will increase significantly. For heavy web browsing and HD streaming, it is recommended to use a device with at least 4 processor cores and 4 GiB of memory.
- Generally, a 4K display requires a graphics card with at least 2 GiB of VRAM for a smooth desktop experience.
- The storage recommendation is based on having enough free space after installation for daily work and system updates. If your device has a large amount of memory, the default swap space (swap file) created by the installer will also be larger, so please take this into account when partitioning.
- If possible, using a solid‑state drive (SSD) as the primary system storage is highly recommended. The random read/write performance advantage of SSDs will noticeably improve system responsiveness, software installation, and multitasking experience.
- AOSC OS receives updates via the Internet. Please ensure a stable Internet connection to receive timely system updates.

## Related Documentation

- [AOSC OS Architecture Support Specification](https://aosc.io/aosc-os/isa)