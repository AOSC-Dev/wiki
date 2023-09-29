+++
title = "Autobuild3 Testing Framework: Design and Implementation Internals"
description = "Advanced usage of autobuild3 testing framework and its internal implementation details"
+++

# Rationale

Proper package testing is an important and necessary way to assure the package quality. Testing, in this case, involves upstream provided tests (includes unit tests and integration tests) and the system tests (which should be implemented by packagers or other AOSC maintainers).

Most of the tests can be done in the packaging building process, in this case, the Autobuild3. The audience of this article is packagers who want to use the package testing framework in Autobuild3.

# Specifications

A *test* in Autobuild3 testing framework refers to a set of operations that gives no extra effect on the build directory and gives a result (passed or not, and why not). For a given package, multiple *test*s can be specified.

A test must do NO extra side-effects on the build directory. Overwriting compiled binaries is not allowed, except that the upstream gives an elegant way to ensure this.

## Results

A test can be in these *states*:
- Pending
- Running
- Passed
- Failed (throws a QA Error)
- Soft failed (throws a QA Warning)
- Critical (encountered unexpected failure in testing, the result cannot be collected, fails the build immediately)

A finished test must return its status by return value, either be 0 (Passed), 1 (Failed), 255 (Critical).

A non-critical test result can give *additional information*. This may include failed sub-tests, statistics and other machine readable information. 

*Logs* are directly printed to stdout and stderr. They're not part of the test result.

## Automatic detection

A special default test is automatically generated for packages which have a `autobuild/build` file (or arch-specific ones) or matches ABTYPE in some testing templates.

For packages that leverages the automatically generated one, only `defines` and `check` (or other name and location that autobuild3 recognizes) is involved.

Packagers can specify some basic properties in `defines`. To disable the automatically generated test, use `ABTEST_AUTO_DETECT=no`. To disable all test features in autobuild3, use `NOTEST=yes`. To override the anchor point where tests runs in the whole building process, use `ABTEST_AUTO_DETECT_STAGE`, for valid values, see anchors.

## Executors

*Executors* are environments for running the tests. A executor is an abstraction with:

- A working AOSC OS, with systemd and dbus running
- Same architecture with the package
- autobuild3 with same version installed
- read ability of the build directory (temporary writes can be implemented by overlay filesystem or simply a copy, so write is not a problem here)
- an interface for autobuild3 to run commands in it and stop it
- pipes connected to the autobuild3's stdout and stderr for log output
- a result report method

Some example executors are:
- `plain`: the default one, just run it in a subshell, enough for most packages
- `sd-run`: systemd-run in current environment, that provides resource controls, permission limitations and time limits
- `qemu`: for kernel related tests or other operation that requires privileges that may break the host environment

## Templates

TESTTYPE defines the testing template to use. A special one called "custom" can invoke your own test script, and in most case, the `autobuild/check` script.

## Multi-case testing

For a complex package with multiple tests or other requirements, set an explicit multi-case testing as below.

These tests should be specified by [package metadata](@/developer/automation/packaging-metadata-syntax.md) file called *test specification file* under `tests/` directory. The metadata file name is the *test name*. Different tests in a same package must not share a *test name*.

Test data including self-written scripts, example file for the software to process, or standard outputs or screenshots for comparison should be placed in `autobuild/testdata`. Large files, copyrighted assets, and other controversial files should be hosted elsewhere, keeping the aosc-os-abbs repository clean. Placing files by test name is recommended.

To enable these tests, put `ABTESTS="foo bar"` in the `defines` file. `ABTESTS` is a space separated string, packagers should enable needed tests by list them in this variable.

Example:

```
autobuild/
    defines
    tests/
        screenshot
        ctest
    testdata/
        screenshot/
            startup.png
```

## Test Metadata

Except for the automatically generated test, tests should have their properties placed in the test specification file.

### `TESTDESC`

A human readable short description of the test. Required.

### `TESTDEPS`

A space separated list of dependencies for running the test. Defaults to `""`.

### `TESTEXEC`

The executor name. Defaults to `"plain"`.

### `TESTTYPE`

The test type. Required.

### Executor dependent metadata

- qemu
    - QEMUEXEC_MEMORY
    - QEMUEXEC_SMP
    - QEMUEXEC_CMDLINE
- systemd-run
    - SDRUNEXEC_PROPERTY

### Test type dependent metadata

- custom
    - CUSTOM_IS_BASHSCRIPT  # controls source or fork-then-exec
    - CUSTOM_SCRIPT         # absolute location of the script, prefixes such as $SRCDIR should be used
    - CUSTOM_ARGS           # extra arguments for the script
    - CUSTOM_STAGE          # anchors to be used

# Internal Implementation

The autobuild3 testing framework consists of these parts:

- Scanners, which reads `TESTS` variable and all of the test specification file for the main autobuild3 process.
- Anchors, scripts under `procs/` that calls the actual test.
- Executors, which are sets of script that provides the abstraction mentioned in the package testing guide.
- Test scripts, pre-defined scripts for reuse on well-known test suites.
- Collectors, which collects test result report and generates `X-AOSC-Autobuild-` prefixed dpkg metadata based on test results.

## Scanner

Autobuild3 will read the `ABTESTS` variable in `defines`. For each test name in `ABTESTS`, create a bash sub-shell that sources the test specification file. The sub-shell will output needed variables to its stdout. Then the main process can read the output, so that each test's main properties will be known by the main process. These variables should be named as `TEST_${TEST_NAME}_${VARIABLE_NAME}`.

Note: A source operation is required to correctly expand variable names.

Involves `proc/10-tests_scan.sh` and `lib/tests.sh`.

## Anchors

Tests may run at different stage of the building process. Most likely we'd run tests in post-build stage. In custom tests, we will use `CUSTOM_STAGE` for specifying this. Anchor scripts are placed in the `proc/` directory like other build procedures, they invokes corresponding executors and test scripts accordingly.

Note: Do not be confused by the stage2 building flavor, which is just for minimum building environment setup.

Involves `proc/51-tests_post-build.sh`, `proc/92-tests_post_install.sh` and `lib/tests.sh#abtest_run`

## Executors

Autobuild3 runs test in a new process, defined in `contrib/autobuild-test`. This design provides the ability to run tests in other environments and even hosts or run tests without rebuilding the whole project.

The autobuild3 running in executor is a partly functional one. Only basic `proc/` scripts and libs are sourced. Not all of the variable are available to them. Users should always be aware that they are isolated by processes or even virtual machines and are running independently. The communication are limited to the defined test result reporting schemes and build directory reading.

## Test scripts

Test scripts are the place where tests are actually ran. They looks and works just like a normal build script under `ab3/build/`.

But as described in the executors, the results are passed via pipes. So the communication will be handled in both sides, if you write custom test scripts, you should report correct test result in the schema described later.

Related files:
- `test/testlib.sh`
    - `test_emit_result`

Example test scripts:
- `<aosc-os-abbs>/app-devel/strace/`
    - `autobuild/`
        - `test/`
            - `strace`

## Collectors

Collectors are another end of the test scripts' pipe, where test result are sent to. Collectors also combines multiple tests' (if exists) result into a final result.

Note that the test result may be available later than the archive of deb file, so the package need to be rebuilt to include this kinds of information.

Related files:
- `proc/`
    - `98-tests_meta.sh`
- `test/`
    - `testlib.sh`
