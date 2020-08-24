+++
title = "p-vector"
description = "Information about the deb repo manager p-vector"
date = 2020-05-04T03:36:26.143Z
[taxonomies]
tags = ["infra"]
+++

# Introduction
P-vector manages AOSC OS's deb repository, generates index files and analyzes problems in packaging.

# Usage
`p-vector config.yaml (scan|release [--force]|sync|analyze [full]|reset [pv|sync])`

* `scan`: scan the directories containing packages and record them in the database.
* `release`: generate the `Packages`, `InRelease` and `Contents` files for apt.
* `sync`: download SQLite databases from packages.aosc.io and load them into the PostgreSQL database.
* `analyze`: analyze problems in packaging.
* `reset`: drop tables.

# Database
p-vector uses a PostgreSQL database. We recommend using the latest version, even though 9.6 is still usable. Specify the connection string in `db_pgconn` in the config file.

## Tables
### p-vector native tables
These tables contain information necessary to generate indices for apt and to analyze problems.

* pv_repos: lists information about repos
	* name\*: primary key
	* realname: name without branch
	* path: path of deb repo
	* testing: 0-2, the level of stablility
	* branch: stable, testing, explosive
	* component: main, bsp, opt
	* architecture: all, amd64, ...
* pv_packages: metadata of every .deb file
	* package\*
	* version\*
	* repo\*
	* architecture
	* filename
	* size
	* sha256
	* mtime: modification time of the deb file
	* debtime: the modification time of `control` file
	* section: as listed in deb file
	* installed_size: KiB, listed in deb file
	* maintainer
	* description
	* \_vercomp: comparable version for sorting
* pv_package_duplicate: deb files with same package, version and repo
	* (same as above, primary key is filename)
* pv_package_dependencies
	* package\*
	* version\*
	* repo\*
	* relationship\*: Depends, Breaks, ...
	* value: as listed in deb (parsed in v_dpkg_dependencies)
* pv_package_sodep: dynamic library dependency of deb file
	* package
	* version
	* repo
	* depends: 0 provides, 1 depends
	* name: libfoo.so
	* ver: .1.2.3
* pv_package_files: files in deb packages
	* package
	* version
	* repo
	* path: without leading /
	* name
	* size
	* ftype: file types, eg. reg, dir, lnk, sock, chr, blk, fifo
	* perm: permission stored as integer
	* uid
	* gid
	* uname
	* gname
* pv_package_issues: current package issues
	* id\*
	* package
	* version
	* repo
	* errno: [issue code](@/developer/packaging/qa-issue-codes.md)
	* level: -1 critical, 0 error, 1 warning
	* filename
	* ctime: creation time
	* mtime: modification time (same package and file, different detail)
	* atime: verification time
	* detail: json field
* pv_issues_stats: package issue statistics log
	* repo
	* errno
	* cnt: issue count
	* total: package count
	* updated
* pv_dbsync: packages site database sync status
	* name: database filename
	* etag
	* updated

### tables from packages site
These tables are copied from the packages site.

#### abbs.db
* trees
* tree_branches
* packages
* package_dependencies
* package_duplicate
* package_spec
* package_versions
* dpkg_repo_stats

#### \*-marks.db
* repo_branches
* repo_committers
* repo_marks
* repo_package_basherr
* repo_package_rel

#### piss.db
* package_upstream
* upstream_status
* anitya_link
* anitya_projects

## Views
These views come from abbs.db of the packages site.

* v_packages: latest packages in source trees
* v_package_upstream: package upstream version and url

## Materialized Views
These views show more information about packages and their relationships, but are expensive to compute.

* v_packages_new: packages with the largest versions
	* (same as pv_packages)
* v_dpkg_dependencies: parsed dpkg dependencies
	* package
	* version
	* repo
	* relationship
	* nr: number of dependency. If dependency specified contains | (or), then nr is same
	* deppkg: depended package
	* deparch: archtecture of depended package
	* relop: version relationship
	* depver: version requirement
	* depvercomp: version requirement for comparison
* v_so_breaks: when updating `package`, which `dep_package`s will be broken?
	* package: the package that is depended on
	* repo
	* soname
	* sover
	* sodepver: the sover that other packages require
	* dep_package: the reverse dependency
	* dep_repo
	* dep_version

# Analyze
Here we list the actual implementation of issue detection.

* 101: find entries in table repo_package_basherr where package name is null
* 102: find entries in table repo_package_basherr where package name is not null (package name is defined in `defines`)
* 103: regex `^[a-z0-9][a-z0-9+.-]*$`. The debian policy specifies that package name should be at least 2 characters, but we set an exception here for `r`.
* 301: debtime is null. If we can't open the deb file, we won't be able to get mtime of `control`.
* 302: size < 10M and size < one third of median package size
* 303: pool/(lib)\<initial letter\>/\<package name\>\_\<version\>\_\<architecture\>.deb
* 311: regex `^.+ <.+@.+>$`
* 321: packages doesn't contain files in /usr/local or `^(bin|boot|etc|lib|opt|run|sbin|srv|usr|var)/?.*`
* 322: executable zero-size files, whose names are not NEWS, ChangeLog, INSTALL, TODO, COPYING, AUTHORS, README, README.md, README.txt, empty, placeholder, placeholder.txt, .\*, \_\_init\_\_.p\*
* 323: uid>999 OR gid>999
* 324: non-executable file in /bin, /sbin, /usr/bin; or non-executable directory
* 401: find packages whose build dependencies are not found in source
* 402: find entries in table package_duplicate
* 411: find packages whose dependencies (Depends, Pre-Depends, Recommends, Suggests) not found in related deb repos
* 412: find entries in table pv_package_duplicate
* 421: find packages p1 and p2, where p1 and p2 have same regular files, p1 != p2, p1.arch=p2.arch or p2.arch=all, p1.repo_component=p2.repo_component, p1.testing <= p2.testing; also excludes Breaks, Replaces, Conflicts listed in deb package
* 431: find package p2 that provides the library that package p1 needs. If no version matches, then find the same so-name, such that p2 is the most popular provider. Return fuzzy matches and empty matches.
* 432: recursively find package p2 that provides the library that package p1 needs. Return library providers that not found in PKGDEP. Don't report missing dependencies in aosc-os-core. If p1 dep p2 dep p3 and p1 sodep p3, but p1 doesn't declare PKGDEP on p3, this situation is NOT reported. If p1 dep/sodep p2 dep p3, and p1 sodep p3, but p1 doesn't declare PKGDEP on p3, this situation is reported.


