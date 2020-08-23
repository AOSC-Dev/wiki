+++
title = "INFRA-ERR-00001: Security Announcements Mailing List Migration"
description = "A quick summary of the recent Security Announcements Mailing List Migration incident"
date = 2020-05-04T03:36:15.932Z
[taxonomies]
tags = ["infra-errata"]
+++

# Summary
We experienced unexplained downtime of the original AOSC Security Announcements mainling list (security@lists.aosc.io) and was unable to resolve this issue. During the investigation, we also noticed that our old name, security@lists.aosc.io violated RFC 2142, since "security" was defined as a reserved mailbox that was only meant to be used by the system administrator. Therefore, we decided to create a new list under a RFC-compliant name, security-announcements@lists.aosc.io, and migrate the old subscribers and archives to the new list. This migration was successfully conducted on April 5th, 2020.

# Background
Since late March, we experienced rejections when attempting to post security advisories to our old mailing list, security@lists.aosc.io, and despite having attempted methods including temporarily bypassing inbound spam filtering, and reviewing various configuration files, we were not able to resolve this issue. Since almost no manual configuration change was conducted after the list went operational in 2018, it was more likely that a change in the underlying software (Sympa) broke our configuration. In the process, we also discovered that as per RFC 2142, "security" is a reserved mailbox that is meant to go to the site administrator, therefore we decided to re-create the list under a different name. After some short discussions in the Telegram chat group over last weekend, it was settled to use the name "security-announcements" for the new mailing list.

# Possible Cause
Not yet identified. However it was suspected that a configuration breakage was accidentally introduced at some point during regular system administration.

# Resolution
A new mailing list, security-announcements@lists.aosc.io was created on April 5th, 2020. After successfully creating the new mailing list, archives and subscribers were manually migrated from the old list. After verifying that the new mailing list was operational with archives and subscribers successfully imported, the old list was deactivated (but data was still saved on the server) using Sympa's deactivation function. Inbound spam filtering was also re-activated and confirmed operational after the migration.

From now on, all security-related announcements should go to security-announcements@lists.aosc.io.