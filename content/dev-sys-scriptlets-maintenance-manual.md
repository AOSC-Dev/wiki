+++
title = "[RFC] Scriptlets Maintenance Manual"
description = ""
date = 2020-07-17T02:41:06.700Z
[taxonomies]
tags = ["dev-sys"]
+++

# Rationale

Our [scriptlets](https://github.com/AOSC-Dev/scriptlets) repository, as it stands, lacks clear guidelines for introduction and maintenance procedures. As a result, this repository is littered with scripts without documentation and proper licensing declarations.

This manual intends to define such procedures, and also describe rules intentionally omitted (and the reasoning for such omissions).

# What is a "Scriptlet"

A scriptlet is a script that provides a (very) specific functionality, which works with a larger project. For instance, our `pushpkg` script works with our packaging toolset (Autobuild3, ACBS, and Ciel) and repository infrastructure (LDAP account authentication, uploading, etc).

These scripts are often small and does not warrant a full GitHub repository (or really, a project) to maintain and improve. They are therefore collected in our [scriptlets](https://github.com/AOSC-Dev/scriptlets) repository.

# Introducing New Scriptlets

Since scriptlets are small, they could be introduced without much process. However, several procedures should be observed to maintain relative orderliness in the repository.

Individual scriptlet, or a group of (tightly) related scriptlets...

- Must be put under each of their own sub-directory (or submodule, if applicable).
- Must have their own appropriate licensing document, *not inheriting* from the parent project as a whole.
- Must at least have a README document to describe its functionality and usage.
- If derived from another project, must specify its origin(s) (citation).

# Maintaining Scriptlets

Maintainers may take their liberty in how their own scriptlet(s) should be maintained. However, such maintenance procedures *must be documentated* in a README or CONTRIBUTING document. This is to prevent an orphaned (but possibly useful) scriptlet from being left unmaintainable.