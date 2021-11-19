+++
title = "Raspberry Pi 4B Configuration"
description = "Configurate your Raspberry Pi boards"
date = 2021-11-18
[taxonomies]
tags = ["rpi"]
+++

# Configuration

As we all know the low level part of Pi is configurable, through the `config.txt` and `cmdline.txt`, both in the boot partition.

`config.txt` stores hardware configuration, which controls the hardware interfaces e.g. SPI, UART, etc, and device trees which will be loaded during boot.

`cmdline.txt` stores the kernel command line parameters, which will be passed to the kernel.

These configuration has been enabled in our default configuration for better experience:

- Bring up Bluetooth automatically during boot (`dtparam=krnbt=on`)
- Enable VideoCore 4 driver (`dtoverlay=vc4-fkms-v3d`)
- Disable overscan to get rid of blank padding on the screen (`disable_overscan=1`)

`config.txt`
------

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

`cmdline.txt`
------

The kernel command line parameters is stored in `cmdline.txt` by default, you can alter this option in `config.txt`, which is described above. It should only contain one single line.

The following parameters must present in every single install:

- `rootwait`: Wait for root filesystem showing up. This is necessary even if you do not use an USB drive as OS drive. Removing this will crash the kernel, tells you unable to locate root filesystem.
- `fsck.repair=yes`: Always check the filesystem. Pi does not come with initramfs by default, so this should be enabled.

