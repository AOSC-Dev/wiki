+++
title = "List Of Package Issue Codes"
description = "Reference List of Package Issue Codes"
date = 2020-05-04T03:36:05.233Z
[taxonomies]
tags = ["dev-sys"]
+++

# The Codes
To help identifying various kind of package issues, listed below are four classes of codified packge issues:

- Codes starting with an "E" represent an error.
- Codes starting with an "W" represent a warning.

## Class 1: Metadata

| Code | Description |
|-----------|----------------------|
| E101 | Syntax error(s) in `spec` |
| E102 | Syntax error(s) in `defines` |
| E103 | Package name is not valid |
| E104 | Package section is not valid |
| W111 | Package may be out-dated |
| W112 | `SRCTBL` uses HTTP |
| W113 | `SRCTBL` does not have `CHKSUM` |
| W121 | The last commit message was badly formatted |
| W122 | Multiple packages changed in the last commit |
| W123 | Force-pushed recently (last *N* commit - TBD) |

## Class 2: Build Process

| Code | Description |
|-----------|----------------------|
| E201 | Failed to get source |
| E202 | Failed to get dependencies |
| E211 | Failed to build from source (FTBFS) |
| E221 | Failed to launch packaged executable(s) |
| W222 | Feature(s) non-functional, or unit test(s) failed |

## Class 3: Payload (.deb Package)

| Code | Description |
|-----------|----------------------|
| E301 | Bad or corrupted .deb file |
| E(W)302 | .deb file too small |
| E303 | Bad .deb filename or storage path |
| E311 | Bad .deb Maintainer metadata |
| E321 | File(s) stored in unexpected path(s) in .deb |
| E(W)322 | Zero-byte file(s) found in .deb |
| E(W)323 | File(s) with bad owner/group found in .deb |
| E(W)324 | File(s) with bad permission found in .deb |
| E325 | File(s) not found in .deb |
| W331 | Package(s) older than a year (unmaintained?) |

## Class 4: Dependencies

| Code | Description |
|-----------|----------------------|
| E401 | `BUILDDEP` unmet |
| E402 | Duplicate package in tree |
| E411 | `PKGDEP` unmet |
| E412 | Duplicate package in repository |
| E421 | File collision(s) |
| E431 | Library version (sover) dependency unmet |
| E432 | Library dependency without `PKGDEP` |