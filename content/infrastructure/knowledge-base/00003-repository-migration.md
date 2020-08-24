+++
title = "INFRA-KB-00003: Community Repository Migration Guide"
description = "A quick summary of repo migration"
date = 2020-05-04T03:36:23.645Z
[taxonomies]
tags = ["infra-kb"]
+++

## TL;DR
We recently received a sponsorship from xTom, that includes a new repo server located in U.S. We are planning to migrate the old repo soon.

For mirror maintainers, you don't need to do anything if you are using the domain repo.anthonos.org / mirror.anthonos.org / repo.aosc.io as the rsync domain. If you are using 163.22.17.40, please change to repo.aosc.io as soon as possible.

For packagers, please refer to the following content to know what and when you need to take action.

## About the new server
The new server has a 1 Gbps network and much better hardware. The new IP would be 142.147.91.106 and 2604:e8c0:4::2 (yes, really a short IP).

## Timeline
- Dec 29, 2018: Stop uploading new packages to both old and new server.
- Dec 30, 2018: Fully sync content from old to new server.
   - Same day at 0:00 UTC +8: Update DNS and point to new repository server.
- Jan 2, 2019: Check old repo rsync log to see if any server is still connecting. 


## Packagers
Instead of a single `upload` account for everyone, new repository server now requires each packager has their own account on LDAP service (which will in the future serves as a unified login mechanism for all AOSC platform and services). If you currently don't have LDAP account , please contact @xiaoxing at Telegram.

## Sponsor
The new server is kindly sponsored by xTom (https://xtom.com/), a professional hosting solution.
