+++
title = "SYS-ERR-00008: CUPS \"Filter Failed\" with Printers Using the HPLIP Driver"
description = "HPLIP Proprietary Plugin Version Mismatch and Its Consequence"
date = 2020-05-04T03:37:41.607Z
[taxonomies]
tags = ["sys-errata"]
+++

# Summary

Some Hewlett-Packard (HP) printers may require using the drivers provided with the HP Linux Image and Printing (HPLIP, `hplip`) software package - and some even requires proprietary plugins to function (say, with the HP LaserJet P1102w where this issues was first discovered). Printers that require the proprietary plugins may fail to function when the `hplip` package is updated, with the CUPS daemon returning a "filter failed" error.

# Possible Cause

When the `hplip` package is updated, the proprietary plugins are not update automatically, resulting in a version mismatch which causes the issue described above.

# Solution

To resolve this issue, simply run the following command...

```
$ sudo hp-plugin
```

And follow the on-screen instructions.
