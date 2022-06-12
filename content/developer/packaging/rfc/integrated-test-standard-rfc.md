+++
title = "[WIP, Rivision4] Autobuild3 and ACBS Build-time Integrated Test Standard RFC"
description = "(To be filled)"
+++

## Revision Notes

Changes and new contents are marked in italics, comments are marked in bold, and deletion are in strikethrough;

### TO-DO

- Wants a pretty output for test results, like: (Even when there is only one test)
```
$TESTNAME: $STATUS 
...
------------------
Total: PASS: $PASS_COUNT, FAIL: $FAIL_COUNT(, SKIP, PASS(yellow))
```

### Revision 3 | Jun 11th, 2022

- Adapted some suggestions from Mingcong Bai about test file format.

### Revision 4+pre1

- Revised in accordance to the last weekly meeting.
  - See [Developer minutes]()

## Rational and Introductions

(--- Snipped while being in WIP state ---)

## Details

### Autobuild3

*Process for test will be executed between `beyond` and `pm_packUp`. A backup of `abdist` may be created during testing.*

#### Generic Configuration

- `ABTEST_ENABLED=(0|1)`: Toggle whether integrated test is on.
  - Defined in `ab3_defcfg.sh`. Also usable as an override in `defines`
  - 0: Test will not be performed. All test related files and variables are ignored.
  - 1: DEFAULT VALUE. Integrated tests is enabled.

**Note: In this case, how will acbs pass `--without-check`?**
#### Test Template

Test templates are located in `"$AB"/tests`. Similar to building template (defined by `ABTYPE`), a test template describes how a test is performed. Test templates is useful when `ABTYPE` is set other than `self`. A test template should contain the following functions:
- ~~`abtest_"$TESTTYPE"_probe(){}`: Probing function;~~ **Autobuild3 should not automatically probe test types**
- `abtest_"$TESTTYPE"_exec(){}`: Describing how a test should be performed.

Autobuild3 will include the following ABTYPE-independent templates:
- ~~`00-self_files.sh`: Using test specification defined in `autobuild/tests/*`~~
- `00-self.sh`: *Execute `$TESTCMD` defined in test specification file.*
- `??-cargo.sh`:
- ~~`99-notest.sh`~~

#### QA

**Note: Should introduce new QA code relating to integrated tests?**

To be filled.

### ABBS Tree  

#### `defines`

- `TESTDEP={dependency string}`: Whitespace-split dependencies list for running build-time tests. **Bai: Consider using BUILDDEP to define extra dependencies needed.**

#### Test Specification File

A test specification file describes how a test is performed. Test specification file(s) should be placed under `autobuild/tests/` with suffix `.abtest` (details can be found in package styling manual, not write yet. **Need further discussion**). 

A test specification file should contain the following fields:
- **The identifier will be the filename itself;**
- `TESTDES`: Description of the test; Example: `[Info] Running chromium-exec.abtest: Test if the chromium executable could be launched without errors`
- `TESTTYPE`: Describes which template should be used. *Can be omitted if `TESTCMD` is provided.* **(Maybe? Requires further discussion)**

A test specification file can also contain the following fields:
- `ABTEST_UNPRIVILEGED`: Boolean value; Indicating test should be performed using an unprivileged user if the variable is set to 1;
- ~~`abtest()`: Packager-defined test function/script. Applicable when `TESTTYPE` is set to `self`; ~~
- *`TESTCMD`: Command to perform tests (if `TESTTYPE` is set to `self`(Discussion in progress)). Can invoke other scripts.*
- `ABTEST_FAIL_ARCH`: Same as FAIL_ARCH

### ACBS

The standard will introduce new options `--without-check`.

### Ciel-rs

*The standard will introduce new options `--without-check`.*

## Examples

To be filled
