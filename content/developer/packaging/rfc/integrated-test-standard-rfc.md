+++
title = "[WIP, Rivision3] Autobuild3 and ACBS Build-time Integrated Test Standard RFC"
description = "(To be filled)"
+++

## Revision Notes

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

## Rational and Introductions

(--- Snipped while being in WIP state ---)

## Details

### Autobuild3

To ensure temporary files related to integrated test are not included in output package, test will be performed right after `proc/80_pm-pack.sh`.

#### Generic Configuration

- `ABTEST_ENABLED=(0|1)`: Toggle whether integrated test is on.
  - Defined in `ab3_defcfg.sh` and environmental variable.
  - 0: Test will not be performed. All test related files and variables are ignored.
  - 1: DEFAULT VALUE. Integrated tests is enabled.

#### Test Template

**Note: Should autobuild3 probe test type when there is no test specification file?**  

Test templates are located in `"$AB"/tests`. Similar to building template (defined by `ABTYPE`), a test template describes how a test is performed. Test templates is useful when `ABTYPE` is set other than `self`. A test template should contain the following functions:
- `abtest_"$TESTTYPE"_probe(){}`: Probing function;
- `abtest_"$TESTTYPE"_exec(){}`: Describing how a test should be performed.

Autobuild3 will include the following ABTYPE-independent templates:
- `00-self_files.sh`: Using test specification defined in `autobuild/tests/*`
- `01-self.sh`: Using test specification defined in `autobuild/test`
- `99-notest.sh`

#### QA

**Note: Should introduce new QA code relating to integrated tests?**

To be filled.

### ABBS Tree  

#### `defines`

- `TESTDEP={dependency string}`: Whitespace-split dependencies list.

#### Test Specification File

A test specification file describes how a test is performed. Test specification file(s) should be placed under `autobuild/tests/` with suffix `.abtest` (details can be found in package styling manual, not write yet. **Need further discussion**). In case of a single test specification file, it can also be placed under `autobuild/` with the name `test`;

A test specification file should contain the following fields:
- `TESTNAME`: Identifier of the test.
- `TESTTYPE`: Describes which template should be used.

A test specification file can also contain the following fields:
- `ABTEST_UNPRIVILEGED`: Boolean value; Indicating test should be performed using an unprivileged user if the variable is set to 1;
- `abtest()`: Packager-defined test function/script. Applicable when `TESTTYPE` is set to `self`; 
- `ABTEST_FAIL_ARCH`

### ACBS

The standard will introduce new options `--without-check`.

### Ciel-rs

`ciel` will not be affected by the standard. 

## Examples

To be filled
