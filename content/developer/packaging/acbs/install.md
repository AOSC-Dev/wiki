+++
title = "ACBS - Installation"
+++

Installation
============

Get Started
-----------

ACBS could be deployed in any appropriate directories, and is invoked by
calling `acbs-build.py` (you may create a symlink for your convenience).
You need to install all the [mandatory
dependencies](#Mandatory dependencies) listed below. You may want to
create a configuration file before using ACBS, although this is not a
must, but it is highly recommended though.

You can use package manager to install it if you are running AOSC OS: :

    sudo apt install acbs

Or you can get it from source: <https://github.com/AOSC-Dev/acbs/> If
you don't want to clone it using `git`, you can directly download it:
<https://github.com/AOSC-Dev/acbs/archive/staging.zip>

------------------------------------------------------------------------

ACBS uses an INI-like configuration defining trees to be used, the
configuration file should be stored in `/etc/acbs/forest.conf`.

More detailed instructions are listed below.

Requirements
------------

<div id="Mandatory dependencies">

Mandatory dependencies:

</div>

-   Python 3 (\>= 3.6): Running the program itself.
-   GNU File (libmagic): File type detection.
-   LibArchive (bsdtar): Archive handling.
-   GNU Wget or Aria2: Source downloading.
-   [Autobuild3](https://github.com/AOSC-Dev/autobuild3): Package
    building.

<div id="Optional dependencies">

Optional dependencies[1]:

</div>

-   libmagic: Python module to detect file type.
-   pycryptodome: Python module to verify file checksums.
-   pexpect: Python module to simulate PTY sessions and log output to
    file.

Initial configurations
----------------------

The configuration file located in `/etc/acbs/forest.conf` is a INI-like
file.

A bare-minimum configuration example is shown below:

    [default]
    location = /usr/lib/acbs/repo

If you are feeling smart, variable substitutions are also supported:

    [vars]
    base = /mnt

    [default]
    location = ${vars:base}/aosc-os-abbs

By default, ACBS builds packages from the tree defined in the
`[default]` block. You can override this behavior by using
`-t <tree name>` parameter.

[1] Note: By installing optional dependencies, functionalities of ACBS
could be enhanced. These dependencies are available on PyPI.
