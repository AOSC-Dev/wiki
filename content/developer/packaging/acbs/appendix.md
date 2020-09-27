+++
title = "ACBS - Appendix"
+++

Appendix
========

Supported VCS
-------------

| VCS              | Supported? | Fetch | Update | Branch | Revision | URL Check | Note                                  |
|------------------|------------|-------|--------|--------|----------|-----------|---------------------------------------|
| Git              | Y          | Y     | Y      | Y      | Y        | Y         | Automatically fetch submodules        |
| Mercurial (hg)   | Y          | Y     | Y      | Y      | Y        | Y         |                                       |
| Subversion (svn) | Y          | Y     | Y      | Y      | Y        | N         |                                       |
| Baazar (bzr)     | Y          | Y     | Y      | N      | Y        | N         | Some functionalities are not verified |
| Fossil (fossil)  | Y          | Y     | Y      | N      | Y        | N         |                                       |
| BitKeeper (bk)   | N          | N     | N      | N      | N        | N         | Not supported                         |

Acceptable Prefixes for `SRCS`
------------------------------

|        |                                    |                   |        |
|--------|------------------------------------|-------------------|--------|
| Prefix | Source Type                        | Auto deduction[1] | Notes  |
| git    | Git (VCS)                          | Yes               |        |
| hg     | Mercurial (VCS)                    | No                |        |
| svn    | Subversion (VCS)                   | No                |        |
| bzr    | Baazar (VCS)                       | No                |        |
| fossil | Fossil (VCS)                       | No                |        |
| tbl    | Tarball Archives (Remote Files)    | Partial           | [2][3] |
| file   | Opaque Binary Blobs (Remote Files) | No                | [4]    |

Supported Checksum (Hashing) Algorithm
--------------------------------------

|           |              |       |
|-----------|--------------|-------|
| Algorithm | Recommended? | Notes |
| MD2       | N            |       |
| MD5       | N            |       |
| SHA1      | N            |       |
| SHA256    | Y            |       |
| SHA224    | Y            | [5]   |
| SHA384    | Y            |       |
| SHA512    | Y            | [6]   |
| BLAKE2B   | Y            |       |
| BLAKE2S   | Y            |       |
| SHA3_224  | Y            | [7]   |
| SHA3_256  | Y            |       |
| SHA3_384  | Y            |       |
| SHA3_512  | Y            | [8]   |

[1] Auto deduction means if the prefix is omitted, whether `acbs` would
try to deduce the missing prefix

[2] Will attempt to extract the archive

[3] Only when the extension name contains `.tar` or `.zip`

[4] Will leave the files as-is, implies `SUBDIR='.'`

[5] Although recommended, please consider using `SHA256` or better

[6] Although recommended, the hash sum is just too long. Currently,
`SHA256` is sufficient enough.

[7] Although recommended, please consider using `SHA3_256` or better

[8] Although recommended, the hash sum is just too long. Currently,
`SHA3_256` is sufficient enough.
