+++
title = "Package Testing: Specifications and Guidelines"
description = "Package testing tools and suggested workflows for packagers"
+++

# Rationale

Proper package testing is an important and necessary way to assure the package quality. Testing, in this case, involves upstream provided tests (includes unit tests and integration tests) and the system tests (which should be implemented by packagers or other AOSC maintainers).

Most of the tests can be done in the Autobuild3 building process. The audience of this article is packagers who want to use the package testing framework in Autobuild3 (which is not implemented yet).

# Specifications

## Terminology

A *test* in Autobuild3 testing framework refers to a set of operations that gives no effect on current build directory and gives a result (passed or not, and why not). For a given package, multiple *test*s can be specified.

The test must do NO side-effects on the build directory. Overwriting compiled binaries or mixing testing-purposed file into the build directory is not allowed, except that the upstream sources having defined a subdirectory or a set of scripts that guarantee the equivalent explicitly.

A test can be in these *states*:
- Waiting
- Running
- Passed
- Failed (throws a QA Error)
- Partially passed (throws a QA Warning)
- Critical (encountered unexpected failure in testing, the result cannot be collected, fails the build immediately)

A finished test must return its status by return value, either be 0 (Passed), 1 (Failed), 2 (Partially passed), 255 (Critical).

A non-critical test result can give *additional information*. This may include failed sub-tests, statistics and other machine readable information.

*Logs* are directly printed to stdout and stderr. They're not part of the test result.

A test is specified by a [package metadata](@/developer/automation/packaging-metadata-syntax.md) file called *test specification file*. The metadata file name is the *test name*. Different tests in a same package must not share a *test name*.

A special test called `default` can be specified without a package metadata file. Metadata entries required by the test can be set in the `autobuild/defines` directly. If it is used, this default test should be the only test in the package, and the `plain` executor must be used. That is to say, if the package is associated with more than one tests, the default test shall not be used.

*Executors* are environments for running the tests. A executor is an abstraction with:
- A working AOSC OS, with systemd and dbus mostly usable
- Same architecture with the package
- autobuild3 with same version installed
- read ability of the build directory (temporary writes can be implemented by overlay filesystem or simply a copy, so write is not a problem here)
- an interface for autobuild3 to run commands in it and stop it
- pipes connected to the autobuild3's stdout and stderr for log output
- a result report method

Some example executors are:
- `plain`: the default one, just run it in a subshell, enough for most packages
- `systemd-run`: resource/time controls, permission limitations
- `x11`: with a x11 server running and DISPLAY variable set
- `wayland`: basically the same with x11
- `qemu`: kernel related tests, namespace operations

Except for `plain` executor, the test specification file is sourced at least twice, once in the host autobuild3's subshell, and once in the executor.

The test *types* defines the pre-defined test script to use. A special "pre-defined" test script called "custom" can invoke your own test script.

## Files

For packages that uses the default test, only `defines` (or other name and location that autobuild3 recognizes) is involved.

For normal testing setup, there must be a `tests/` directory under `autobuild/` that contains all of the test specification file, which is named by the test name, without suffixes.

Test data including self-written scripts, example file for the software to process, or standard outputs or screenshots for comparison should be placed in `autobuild/testdata`. Large files, copyrighted assets, and other controversial files should be hosted elsewhere, keeping the aosc-os-abbs repository clean. Placing files by test name is recommended.

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

## Metadata

All metadata entries should placed in the test specification file, except for `TESTS`.

### `TESTS`

A space separated list of enabled tests in the `defines` file.

The default value is `"default"`, which runs the only test specified in `defines`.

Example:
```
TESTS=""                    # disables the default test
TESTS="default"
TESTS="screenshot ctest"

TESTS="default ctest"       # incorrect! default should not be used with other tests
```

### `TESTDESC`

A human readable short description of the test. Must be defined except for the default test.

### `TESTDEP`

A space separated list of dependency for running the test. Defaults to `""`.

Note that this may be only installed inside of the executor, so they may not be available in other tests and other parts of the autobuild3l.

### `TESTEXEC`

The executor name. Defaults to `"plain"`.

### `TESTTYPE`

The test type, must be defined, except for the default test which can be inferred from `$ABTYPE`

### Executor dependent metadata

Examples:
- qemu
    - QEMUEXEC_MEMORY
    - QEMUEXEC_SMP
    - QEMUEXEC_CMDLINE
- systemd-run
    - SDRUNEXEC_PROPERTY
- x11 / wayland
    - GUIEXEC_RESOLUTION

### Test type dependent metadata

Examples:
- custom
    - TESTCUSTOM
    - TESTAT
