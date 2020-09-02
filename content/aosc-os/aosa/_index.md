+++
title = "AOSC OS Security Advisories (AOSA)"
description = "Tracking of security vulnerabilities found in AOSC OS"
date = 2020-05-04T03:35:01.002Z
insert_anchor_links = "left"
[taxonomies]
tags = ["aosa"]
+++

# AOSA?

The system of AOSC OS Security Advisories (AOSA) is introduced in 2017 to aid in the tracking of security vulnerabilities found in AOSC OS, and to help making our users aware of security updates available - which are often mixed-in with feature and other bug-fix updates.

# Formatting and Numbering

AOSAs follow a very simple (but organised) format with an aim to provide the immediate action suggestions, like in the example below:

```
 AOSA-2018-0008: Update WildMIDI to 0.4.2
|----|----|----|-------------------------|
```

- `AOSA-`, just to show that it's our advisory, as in contrary to `DSA-` from Debian, `ASA-` from Arch Linux, etc.
- `2018-`, to indicate the year in which the advisory was published.
- `0008`, a simple number counter to show how many advisories have been published before this particular one.
- `Update WildMIDI to 0.4.2`, developer suggestion for user action(s).

# Workflow for Security Advisories

The publication/announcement of a security advisory indicates the end of a security update cycle. Typically, this cycle could be summarised as the following workflow...

- Security contributor(s) subscribes to security mailing lists (like `oss-security`) and advisory mailing lists of upstream projects and other \*nix distributions - and by doing so, collects security vulnerability information on a regular basis.
- Security vulnerabilities are then checked against our own package trees (like the [AOSC OS Core](https://github.com/AOSC-Dev/aosc-os-core) and the [AOSC OS ABBS](https://github.com/AOSC-Dev/aosc-os-abbs) trees, etc.) to see if AOSC OS is vulnerable, (and without classification of priority levels, due to lack of man power,) and are reported to the respective issue trackers of these trees - tagged as `security`, or with an extra `upgrade` tag, if a version update is needed.
- These issues are then checked by AOSC OS maintainers, to check which update channel(s) they may apply to - and marked with respective `to-*` tags.
	- If no fix is yet available, a `no-fix-yet` tag is added.
	- In other cases, they may also be tagged as `invalid`, `questions`, `stalled`, etc.
- AOSC OS maintainers will then make necessary changes to address the security issues (in accordance to our *FIXME: AOSC OS SEASONAL CYCLES DOC*), and test these new packages for usability and in addition, against any known PoCs (Proof-of-Concepts).
- Updated packages are uploaded to the applicable repositories for user updates.
- Issues are closed with a reference to the fix commit (see the example [here](https://github.com/AOSC-Dev/aosc-os-abbs/issues/1299)).
- Security contributors may now assign a incremented AOSA number along with the suggested action, as shown in the formatting example above.
- Regularly, these advisories are then posted in our [security list](mailto:security@lists.aosc.io), and archived here on the Wiki site (see the [2019 Archive](@/aosc-os/aosa/archive-2019.md)).
