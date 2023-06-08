+++
title = "Development on Autobuild3 Testing Framework"
description = "Document and implementation of a test script and the testing framework itself"
+++

This wiki page is for autobuild3 developers and packagers who wants to write their own test scripts. Make sure you have read the [package testing guide](@/developer/packaging/package-testing-guide.md) before reading this.

# The framework

The autobuild3 testing framework consists of these parts:

- Scanners, which reads `TESTS` variable and all of the test specification file for analysis.
- Anchors, scripts under `procs/` that calls the actual test.
- Executors, which are sets of script that provides the abstraction mentioned in the package testing guide.
- Test scripts, pre-defined scripts for reuse on well-known test suites.
- Collectors, which collects test result report and generates `X-AOSC-Autobuild-` prefixed dpkg metadata based on test results.

## Scanner

Autobuild3 reads the `TESTS` variable in `defines`. For each test name in `TESTS`, create a subshell that sources the test specification file. The subshell will output some global needed variables with its test name prefixed. The main process source the output, so that each test's executor and types will be known.

These variables should be named as `TEST_${TEST_NAME}_${VARIABLE_NAME}`.

Related files: 
- `proc/`
    - `11-test_scan.sh`

## Anchors

Tests may run at different stage of the building process. Most likely we'd run tests in post-build stage. In custom tests, we will use `TEST_AT` for specifying this. Anchor scripts are placed in the `ab3/proc/` directory like other build procedures, they invokes corresponding executors and test scripts accordingly.

Note: Do not be confused by the stage2 building flavor, which is just for minimum building environment setup.

Related files:
- `proc/`
    - `55-test_build.sh`
    - `55-test_package.sh`
    - `91-test_install.sh`
- `test/`
    - `testlib.sh`#`ab3_test_invoke`

## Executors

Executors are described in the package testing guide with detailed and precise definition. The technical details are dependent on which executor we are talking. Implementing this will involve many autobuild3 modification, so it is not recommended to implement a new executor. The qemu executor should be able to satisfy almost every possible requirement.

The autobuild3 running in executor (except the `plain` one, of course) is a partly functional one. Only basic ab3 libs and the `defines` are sourced. Not all of the variable are available to them. Users should always be aware that they are isolated by processes or even virtual machines and are running independently. The communication are limited to the defined test result reporting schemes and build directory reading.

Related files:
- `test/`
    - `testlib.sh`#`ab3_test_executor_*`&`ab3_test_invoke`
    - `executors/`
        - `10-plain.sh`
        - `20-systemd-run.sh`
        - `30-qemu.sh`
        - etc.

## Test scripts

Test scripts are the place where tests are actually ran. They looks and works just like a normal build script under `ab3/build/`.

But as described in the executors, the results are passed via pipes. So the communication will be handled in both sides, if you write custom test scripts, you should report correct test result in the schema described later.

Related files:
- `test/testlib.sh`
    - `test_emit_result`

Example test scripts:
- `test/`
    - `10-cmake.sh`
    - `10-python.sh`
- `<aosc-os-abbs>/app-devel/strace/`
    - `autobuild/`
        - `test/`
            - `strace`

## Collectors

Collectors are another end of the test scripts' pipe, where test result are sent to. Collectors also combines multiple tests' (if exists) result into a final result.

Note that the test result may be available later than the archive of deb file, so the package need to be rebuilt to include this kinds of information.

Related files:
- `proc/`
    - `98-test_updatemeta.sh`
- `test/`
    - `testlib.sh`

# Test scripts

In test scripts, you can assume most procedures in previous procedures are all executed, except for those functions can actually change the build directory.

When the test finishes, you'll be able to report test result via `ab3_test_emit_report`.

# Test result messaging

Currently, we use return value and stdout as messaging channel.

Return values are defined as:

| RetVal |     Meaning      |
| :----: | :--------------: |
|   0    |      Passed      |
|   1    |      Failed      |
|   2    | Partially passed |
|  255   |  CRITICAL ERROR  |

It is not allowed to directly output anything into stdout, one should use `ab3_test_emit_result` to report it, making API consistent if more fields was added.

<!-- TODO: ab3_test_emit_result API & Actual message passing format -->

# Executors

Executors provider should provide these functions:
- ab3_test_executor_EXECNAME_start
- ab3_test_executor_EXECNAME_stop
- ab3_test_executor_EXECNAME_peekfile
- ab3_test_executor_EXECNAME_run

Building the ab3 environment inside executors is done by the framework in `test/testlib.sh`#`ab3_test_executor_call`
