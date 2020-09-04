+++
title = "SYS-ERR-00003: Errors when Running the \"sensors\" Command on a HP MicroServer Gen8"
description = "ACPI-related Dmesg Outputs Triggered by Reading of Power Metre Values"
date = 2020-05-04T03:36:42.563Z
[taxonomies]
tags = ["sys-errata"]
+++

# Summary

When running the `sensors` command from the `lm-sensors` package to review system sensor readings, you may encounter error outputs from the framebuffer terminal ("TTY"), or within the `dmesg` log - similar to the example below:

```
[...] ACPI Error: SMBus/IPMI/GenericSerialBus write requires Buffer of length 66, found length 32 (20170728/exfield-427)
[...] ACPI Error: Method parse/execution failed \_SB.PMI0._PMM, AE_AML_BUFFER_LIMIT (20170728/psparse-550)
[...] ACPI Exception: AE_AML_BUFFER_LIMIT, Evaluating _PMM (20170728/power_meter-338)
```

Along with the error above, you may see this seemingly erroneous reading for the `power_meter-acpi-0` device:

```
power_meter-acpi-0
Adapter: ACPI interface
power1:        0.00 W  (interval = 300.00 s)
```

# Possible Cause

Not yet identified. Upstream bug report pending.

# Workaround

To workaround this issue before an upstream fix (possibly from the Kernel) is available, to resolve this issue, one would have to blacklist the offending `power_meter-acpi-0` device from the `sensors` reading. With your text editor of choice...

```
sudo nano /etc/sensors3.conf
```

And append the following to the end of the file...

```
chip "power_meter-acpi-0"
    ignore power1
```

# References

- Launchpad Bug #606999, from July of 2010 - [Link](https://bugs.launchpad.net/ubuntu/+source/acpi/+bug/606999).
