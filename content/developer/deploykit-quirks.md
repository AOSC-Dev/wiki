+++
title = "DeployKit: Device-specific Quirks"
description = ""
+++

# Format Description

A quirk configuration is written in TOML, in the following format:

```toml
[model]
# Two modes of operation:
#
# - dmi：Match by DMI (modalias, or model alias), useful for model matching.
# - path：Match by path, usually ones found in sysfs.
type = [dmi|path]

# path_pattern/dmi_pattern may not be specified at the same time.

# Match by path - does a path exist (usually in sysfs)? Wildcards are allowed.
#
# For example, to match an LEFI-based platform.
#
# The following must be specified if type = path.
path_pattern = "/sys/firmware/lefi"

# Match by DMI - taken from /sys/class/dmi/id/modalias, wildcards are allowed.
#
# For instance, the modalias for Loongson XA61200:
#
#   dmi:bvnLoongson:bvrLoongson-UDK2018-V4.0.05756-prestable202405:bd05/23/24145323:svnLoongson:pnLoongson-3A6000-HV-7A2000-1w-V0.1-EVB:pvrToBeFilledByO.E.M:rvnToBeFilledByO.E.M:rnLoongson-3A6000-HV-7A2000-1w-EVB-V1.21:rvrToBeFilledByO.E.M:cvnLoongson:ct3:cvrToBeFilledByO.E.M:skuToBeFilledByO.E.M:
#
# The following will match the motherboard/series:
#
#   dmi:*svnLoongson:*pnLoongson-3A6000-HV-7A2000-1w-V0.1-EVB:*
#
# And the following will match a specific motherboard revision:
#
#   dmi:*svnLoongson:*rnLoongson-3A6000-HV-7A2000-1w-EVB-V1.21:*
#
# The following must be specified if type = dmi
dmi_pattern = "dmi:*svnLoongson:*rnLoongson-3A6000-HV-7A2000-1w-EVB-V1.21:*"

[quirk]
# A command to execute for the quirk. The command to launch must have its
# executable bit set (and the correct shebang specified, if it is a script).
command = "/usr/share/deploykit-backend/quirks/loongson-xa61200/quirk.bash"

# Skip one or multiple stages, useful for platforms that may not be capable
# of runnning certain installation procedures.
#
# Refer to deploykit-backend, specifically the `enum InstallationStage' in
# install/src/lib.rs for a list of installation stages.
#
# Optional. The following example skips GRUB installation and SSH keygen.
skip_stages = ["InstallGrub", "GenerateSshKey"]

```

# File Placement

Quirks should be placed under `/usr/share/deploykit-backend/quirks` and organised by a single-level subdirectory:

```
- /usr/share/deploykit-backend/quirks
    - ./loongson-xa61200                    # Model
        - ./quirk.toml                      # Quirk Configuration
```