+++
title = "Raspberry Pi General Troubleshooting"
description = "FAQs and troubleshooting guides for Raspberry Pis"
date = 2021-04-14T04:37:11.499Z
[taxonomies]
tags = ["sys-installation"]

+++

Followings are some common questions and troubleshooting guides for Raspberry Pis.


# General troubleshooting

This secontion will show you how to work out of problems when your Pi does not working.

## No output in any of the HDMI ports

- Remove everything from your Pi, except the HDMI cable, then power it on. Make sure the HDMI port next to the USB-C port is plugged in.
- If you can see the Boot Diagnostic Screen, you can make further investigation in your OS install.
- If it does not, you need to [reflash the EEPROM](https://www.raspberrypi.org/documentation/hardware/raspberrypi/booteeprom.md).

## Pi stucks at the diagnostic screen

This means that the firmware `start.elf` does not exist or is corrupted. Reinstall `rpi-firmware-boot` package, and make sure these files are present in the boot partition.

## Pi stucks at the rainbow screen

This means your Pi can not boot a kernel or the kernel does not exist. Make sure you have kernel (`kernel8.img` by default) in the root directory of the boot partition. The kernel should be uncompressed.

Another possible solution is make sure the HDMI port next to the USB C port is plugged in. The second port is only available after OS is booted.

## There is four Pi logos and it got stuck

This means the kernel is crashed.

Check your `cmdline.txt` and remove the `quiet` option or you will not see the kernel log output during boot.

Another possible reason is that the kernel is waiting for the root filesystem to show up. Make sure the root device is correct in your `cmdline.txt`.

## Kernel panicked

The reason behind this varys. Here are some possible symptoms:

- `VFS: Unable to mount root fs on unknown-block(0,0)`:
  
  The kernel can not find the root partition. Check your cmdline.txt which is described above.

- `Attempted to kill init!`
  
  Your init program died or got killed. Reinstall OS may fix the problem.

## Low performance

This problem shoud not exist in AOSC distributed kernel as the configured default CPU governor is `ondemand`.

If you are using Raspberry Pi distributed kernel, you may fall on this problem, as the default CPU governor is `powersave` which always put your CPU in the lowest frequency.

To adjust CPU governor, run:

```
sudo cpupower frequency-set -g governor
```

`ondemand` and `conservative` are good enough for ARM processors. Or you can use `performance` if you have a good cooling system.

## Why not use mainline Linux kernel?

Some of the hardware parts will not work on mainline Linux because such drivers are not upstreamed yet, or will never upstreamed.

## Hardware accelerated video decoding

It is not supported in 64 bit OS, as Raspberry Pi said. The reason behind it is unclear.

See Also
------

- [Raspberry Pi Documentation](https://www.raspberrypi.org/documentation/)
- [Raspberry Pi GitHub](https://github.com/raspberrypi/)
- [eLinux.org Community Documentation](https://elinux.org/RPi_Hub)
- [LibreELEC source](https://github.com/LibreELEC/LibreELEC.tv)
- [Arch Linux ARM Wiki](https://archlinuxarm.org/wiki/Raspberry_Pi)
