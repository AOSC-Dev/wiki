+++
title = "Installation/ARM*/RaspberryPi/Troubleshooting"
description = "FAQs and troubleshooting guides for Raspberry Pi"
date = 2021-04-14T04:37:11.499Z
[taxonomies]
tags = ["sys-installation"]

+++

Followings are some common questions and troubleshooting guides for Raspberry Pis.

Configuration
------

As we all know the low level part of Pi is configurable, through the `config.txt` and `cmdline.txt`, both in the boot partition.

`config.txt` stores hardware configuration, which controls the hardware interfaces e.g. SPI, UART, etc, and device trees which will be loaded during boot.

`cmdline.txt` stores the kernel command line parameters, which will be passed to the kernel.

These configuration has been enabled in our default configuration for better experience:

- Bring up Bluetooth automatically during boot (`dtparam=krnbt=on`)
- Enable VideoCore 4 driver (`dtoverlay=vc4-fkms-v3d`)
- Disable overscan to get rid of blank padding on the screen (`disable_overscan=1`)

### Common configurations

One line can only contain one parameters. For most configuration parameters, the syntax is `key=value`, with a few exceptions.

#### Use different kernel

The parameter is `kernel=filename` while `filename` is the filename of the kernel. Kernels can only be placed in the root of boot partition!

#### Load initrd image

The Pi supports initial ramdisk by default, so you can boot a root filesystem in LVM and etc.

The syntax of this parameter is slightly different, e.g. to load it in a fixed address:

```
initramfs filename 0x80000000
```

Or load it after the kernel:

```
initramfs filename followkernel
```

Where `filename` is the filename of the image.

- Do not use the equal sign in this or it will be ignored.

#### Adjust GPU memory size

The parameter is `gpumem=X` where X is an positive integer greater than 16, the default is 64.

#### Enable sound

The parameter is `dtparam=sound=on` which you can turn it on and off. Default is on, and it is also explicitly enabled on our default configuration.

#### Enable auto load of Bluetooth

The parameter is `dtparam=krnbt=on` which you can turn it on and off. Default is on, and it is also explicitly enabled on our default configuration.

The interface Bluetooth module uses is UART so it is reasonably hard to make it work, enabling this should make it a lot easier.

#### Use different cmdline.txt

To alter the command line file, use this parameter:

```
cmdline=filename
```

#### Include custom configurations

There is a `include` parameter which loads configurations in another file and merge with current configuration. The syntax is:

```
include filename
```

For other parameters please check out [Raspberry Pi Device Tree Documentation](https://github.com/raspberrypi/firmware/blob/master/boot/overlays/README) and [config.txt Documentation](https://www.raspberrypi.com/documentation/computers/config_txt.html).

### Kernel cmdline parameters

The kernel command line parameters is stored in `cmdline.txt` by default, you can alter this option in `config.txt`, which is described above. It should only contain one single line.

The following parameters must present in every single install:

- `rootwait`: Wait for root filesystem showing up. This is necessary even if you do not use an USB drive as OS drive. Removing this will crash the kernel, tells you unable to locate root filesystem.
- `fsck.repair=yes`: Always check the filesystem. Pi does not come with initramfs by default, so this should be enabled.

General troubleshooting
------

This secontion will show you how to work out of problems when your Pi does not working.

#### No output in any of the HDMI ports

- Remove everything from your Pi, except the HDMI cable, then power it on. Make sure the HDMI port next to the USB-C port is plugged in.
- If you can see the Boot Diagnostic Screen, you can make further investigation in your OS install.
- If it does not, you need to (reflash the EEPROM)[https://www.raspberrypi.org/documentation/hardware/raspberrypi/booteeprom.md].

#### Pi stucks at the diagnostic screen

This means that the firmware `start.elf` does not exist or is corrupted. Reinstall `rpi-firmware-boot` package, and make sure these files are present in the boot partition.

#### Pi stucks at the rainbow screen

This means your Pi can not boot a kernel or the kernel does not exist. Make sure you have kernel (`kernel8.img` by default) in the root directory of the boot partition. The kernel should be uncompressed.

Another possible solution is make sure the HDMI port next to the USB C port is plugged in. The second port is only available after OS is booted.

#### There is four Pi logos and it got stuck

This means the kernel is crashed.

Check your `cmdline.txt` and remove the `quiet` option or you will not see the kernel log output during boot.

Another possible reason is that the kernel is waiting for the root filesystem to show up. Make sure the root device is correct in your `cmdline.txt`.

#### Kernel paniked

The reason behind this varys. Here are some possible symptoms:

- `VFS: Unable to mount root fs on unknown-block(0,0)`:
  
  The kernel can not find the root partition. Check your cmdline.txt which is described above.

- `Attempted to kill init!`
  
  Your init program died or got killed. Reinstall OS may fix the problem.

#### Low performance

This problem shoud not exist in AOSC distributed kernel as the configured default CPU governor is `ondemand`.

If you are using Raspberry Pi distributed kernel, you may fall on this problem, as the default CPU governor is `powersave` which always put your CPU in the lowest frequency.

To adjust CPU governor, run:

```
sudo cpupower frequency-set -g governor
```

`ondemand` and `conservative` are good enough for ARM processors. Or you can use `performance` if you have a good cooling system.

#### Why not use mainline Linux kernel?

Some of the hardware parts will not work on mainline Linux because such drivers are not upstreamed yet, or will never upstreamed.

#### Hardware accelerated video decoding

It is not supported in 64 bit OS, as Raspberry Pi said. The reason behind it is unclear.

See Also
------

- [Raspberry Pi Documentation](https://www.raspberrypi.org/documentation/)
- [Raspberry Pi GitHub](https://github.com/raspberrypi/)
- [eLinux.org Community Documentation](https://elinux.org/RPi_Hub)
- [LibreELEC source](https://github.com/LibreELEC/LibreELEC.tv)
- [Arch Linux ARM Wiki](https://archlinuxarm.org/wiki/Raspberry_Pi)
