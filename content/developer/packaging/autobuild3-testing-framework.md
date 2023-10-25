+++
title = "Autobuild3 Testing Framework"
description = "Advanced usage of Autobuild3 testing framework and its internal implementation details"
+++

# Rationale

Proper package testing is an important and necessary way to assure package quality. Testing, in this case, involves upstream-supplied tests (unit tests and/or integration tests) and distribution tests (which should be implemented by packagers or other AOSC maintainers).

Most of the tests can be done in the packaging building process, in this case, the Autobuild3. The audience of this article is packagers who want to use the package testing framework in Autobuild3. Before we continue, make sure you have read the brief introduction in [advanced techniques](@/developer/packaging/advanced-techniques.md#enable-tests).

# Specifications

A *test* in Autobuild3 testing framework refers to a set of operations that supplies a series of test results (passed or not, and why not) to help packagers determine the quality of a package. For a given package, multiple *test*s can be specified.

## Results

A test can be in these *states*:
- Pending
- Running
- Passed
- Failed (throws a QA Error, fails the build)
- Soft failed (throws a QA Warning)
- Critical (encountered unexpected failure in testing, the result cannot be collected, fails the build immediately)

A finished test must return its status by return value.

A non-critical test result can give *additional information*. This may include failed sub-tests, statistics and other machine readable information. 

*Logs* are directly printed to `stdout` and `stderr`. They're not part of the test result.

## Automatic detection

A package, depending on its `ABTYPE`, may leverage one of the pre-defined testing templates via automatic detection and generation.

For packages that may leverage a pre-defined testing templates, `autobuild/defines` can override some of its behavior. To disable the automatically generated test, use `ABTEST_AUTO_DETECT=no`. To override the anchor point where tests runs in the whole building process, use `ABTEST_AUTO_DETECT_ANCHOR`. For valid values of `ABTEST_AUTO_DETECT_ANCHOR`, see [anchors](#anchors).

## Execution environments

*Execution environment* are environments for running the tests. A such environement is an abstraction with:

- A working AOSC OS, with systemd running.
- A package of the native architecture.
- Same version of Autobuild3 as the one in the host environment.
- Ability to read the build directory (temporary writes can be implemented by overlay filesystem or simply a copy, so write is not a problem here).
- An interface for Autobuild3 to run and stop commands in the execution environment.
- Pipes connected to the Autobuild3's `stdout` and `stderr` for log output.
- A means to report results (via temporary file).

List of currently supported execution environments:
- `plain`: Default, runs in a subshell, sufficient for most packages
- `sdrun`: Runs via `systemd-run`, providing controls over resources, permissions and execution durations.
<!-- - `qemu`: for kernel related tests or other operation that requires privileges that may break the host environment (not implemented yet) -->

## Templates

`TESTTYPE` defines the testing template to use. 

A special one called "custom" can invoke your own test script. Execution of a `autobuild/check` script is done by this "custom" template.

## Multi-case testing

For more complex packages with multiple tests or other requirements, you may set up multi-case testing as follows.

These tests should be specified by [package metadata](@/developer/automation/packaging-metadata-syntax.md) file called *test specification file* under `tests/` directory. The metadata file name is the *test name*. Different tests in a same package must not share a *test name*.

Test data consist of self-written scripts, example file for the software to process, or standard outputs or screenshots for comparison. These data should be placed in `autobuild/testdata`. Large files, copyrighted assets, and other controversial files should be hosted elsewhere, keeping the aosc-os-abbs repository clean. Placing files by test name is recommended.

To enable these tests, put `ABTESTS="foo bar"` in the `defines` file. `ABTESTS` is a space separated string, packagers should enable needed tests by list them in this variable.

Example:

```
autobuild/
    defines
    tests/
        foo
        bar
    testdata/
        foo/
            screenshot.png
```

## Test Metadata

Except for the automatically generated test, tests should have their properties placed in the test specification file.

### `TESTDES`

A human readable short description of the test. Optional but strongly recommended.

### `TESTDEP`

A space separated list of dependencies for running the test. Its function and syntax is the same as `PKGDEP`, except that these packages only get installed if the test it belongs to is enabled. Defaults to `""`.

### `TESTEXEC`

The execution environment name. Defaults to `"plain"`.

### `TESTTYPE`

The test type. Required.

<!-- TODO: Not Implemented YET
### Execution wrapper metadata

- qemu
    - QEMUEXEC_MEMORY
    - QEMUEXEC_SMP
    - QEMUEXEC_CMDLINE
- systemd-run
    - SDRUNEXEC_PROPERTY
-->

### Test type dependent metadata

- custom
    - CUSTOM_IS_BASHSCRIPT  # controls source or fork-then-exec
    - CUSTOM_SCRIPT         # absolute location of the script, prefixes it with $SRCDIR is recommended
    - CUSTOM_ARGS           # extra arguments for the script
    - CUSTOM_ANCHOR         # anchors to be used

# Internal Implementation

The Autobuild3 testing framework consists of these parts:

- Scanners, which reads `TESTS` variable and all of the test specification file for the main Autobuild3 process.
- Anchors, scripts under `procs/` that calls the actual test.
- Execution wrappers, which are sets of script that provides the abstraction mentioned above.
- Test scripts, pre-defined scripts for reuse on well-known test suites, also known as testing templates.
- Collectors, which collects test result report and generates `X-AOSC-Autobuild-` prefixed dpkg metadata based on the test results.

## Scanner

Autobuild3 reads the `ABTESTS` variable in `defines`. For each test name in `ABTESTS`, create a bash sub-shell that sources the test specification file. The sub-shell will output needed variables to its stdout. Then the main process can read the output, so that each test's main properties will be known by the main process. These variables should be named as `ABTEST_${TEST_NAME}_${VARIABLE_NAME}`.

Involves `proc/10-tests_scan.sh` and `lib/tests.sh`.

## Anchors

Tests may run at different stage of the build process. Most likely we'd run tests after compilation. To specify when to run the test, we inserted some anchor scripts in `proc/` directory. In custom tests, we will use `CUSTOM_ANCHOR` for specifying this. Anchor scripts are placed in the `proc/` directory like other build procedures, they invokes corresponding execution environment and test scripts accordingly.

Involves `proc/51-tests_post-build.sh`, `proc/92-tests_post_install.sh` and `lib/tests.sh#abtest_run`.

## Execution wrappers

Autobuild3 runs test as a new process, in `contrib/autobuild-test`. This design provides the ability to run tests in other environments and even hosts or run tests without rebuilding the whole project. You can also manually run `autobuild test <testname>` if you know what you are doing.

Autobuild3's testing implementation leverages only parts of Autobuild3's functionalities. Only basic `proc/` scripts and essential libs are loaded. Not all of the variable are available. Users should always be aware that they are isolated by processes or even virtual machines. The communication are limited to the defined test result reporting mechanism and build directory reading.

## Test scripts

Test scripts defines the actual test procedures. They looks and works just like a normal build script under `ab3/build/`.

As described in the execution wrappers, the results are passed via temporary files and return values. If you're writing custom test scripts, keep an eye on `abtest_result` function for additional and always return a meaningful exit code.

Involves `lib/tests.sh`, `tests/` and `contrib/autobuild-test`.

## Collectors

Collectors copies test result to dpkg control file and generates a machine-readable result for future use such as quality assurance.

Involves `pm/dpkg/pack`.
