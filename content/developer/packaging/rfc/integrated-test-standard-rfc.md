+++
title = "[WIP] Autobuild3 and ACBS Build-time Integrated Test Standard RFC"
description = "(To be filled)"
+++

## Some Questions

1. Should the manual introduce a new unprivileged user to perform tests?
  - Some unit tests is not able to be processed as root, and some do the contrary.
  - If introduced, whether AB3 or buildkit would provide the user?
2. Should enabling the test alternate the normal process of acbs?
  - E.g. , if test is enabled, QA check will not be performed, or the final `.deb` package will not be produced;
    - Maybe, if tests are enabled, QA error may not stop the autobuild, but make `build/{80-pm_pack,90-pm_install,99-pm_archive}.sh` not to be executed.
  - Tests may generate unnecessary executable files, and may be packaged to `$PKGDIR` if ABTYPE is set other than `self`;
  - Performing tests between `build/90-pm_install.sh` and `99-pm_archive.sh` might be a solution, but needs more discussion. (Assuming all tests are executed inside a container)
3. Should introduce a new QA issue code to indicate that test mode is not set?

## Introductions

(--- Snipped while being in WIP state ---)

## Details

### Environmental Variables

- `ABTEST_ENABLED(__${ARCH})=(0|1)`: 
  - 0: DEFAULT VALUE. Test will not be performed. All test related files and variables are ignored.
  - 1: Integrated tests is enabled. Setting this to 1 will alternate default behaviours of Autobuild3.
- `ABTEST_TESTONLY(__${ARCH})=(0|1)`: Applicable if `ABTEST_ENABLED` is set to 1, ignored otherwitse
  - 0: DEFAULT VALUE. Nothing will be altered.
  - 1: Unnecessary script like `80-pm_pack.sh`, `90-pm_install.sh` and `99-pm_archive.sh` will not be performed.

### Tree File Hierarchy 

#### `autobuild/defines`

Dependencies:
- `TESTDEP(__${ARCH})`: Representing the dependencies required by the process of testing.

Test Configurations:
- `ABTEST_ENABLED(__${ARCH})=(0|1)`: Same as environmental variables. Variable defined externally is prior to `autobuild/defines`
- `ABTEST_TYPE(__${ARCH})=(notest|self|(other ABTESTTYPE))`
  - `notest`: DEFAULT VALUE. Representing either automated test is not available for the package, or there is no need to perform tests. Tests for this package is always considered successful.
  - `self`:  Functions are provided by `autobuild/test`. See below for details.
  - `(ABTESTTYPE)`: Functions are provided by `autobuild3/tests/(ABTESTTYPE).sh`.
- ~~`ABTEST_PLACE` (Discussion needed)~~


#### `autobuild/{,"$ARCH"/}test`

Applicable if `ABTEST_TYPE` is set to `self`, ignored otherwise. (Different from `build` which will set `ABTYPE` to `self`)

This file should contain two functions: `abtest()` and `abtest_unprivileged()` . Test will be proceeded via calling these two functions. 

### Autobuild3

Introduce a new module `tests`. File hierarchy is similar to `build`.

#### `proc/xx-test.sh`

(To be filled.)

#### `tests/notest.sh`

Both `abtest()` and `abtest_unprivileged()` are dummy and will return 0;

#### `tests/self.sh`

Including two dummy function returning 254 to represent that test function is missing. Then redefine them by using function `arch_loadfile` to execute `autobuild/test`. Call `abtest()` and `abtest_unprivileged()` in the end.

### ACBS

The standard will introduce new options `--with-check`.

### Ciel-rs

`ciel` will not be affected by the standard. All test-related operations are expected to be executed via `ciel shell`.
