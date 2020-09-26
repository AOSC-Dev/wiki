+++
title = "Tooling and Infrastructural Changes Required for the Topic-Based Transition (RFC)"
description = "Preparing for the New Iteration System"
date = 2020-05-04T03:35:53.850Z
[taxonomies]
tags = ["dev-sys"]
+++

# Tooling

This section describes changes and additions required for our tools in order
to adapt to a topic-based iteration system.

## apt-gen-list

- [ ] Drop branch setting (the `b` parameter), as this is no longer needed.
    - Topic enrollment/withdrawal is to be implemented in a TUI topic manager.

## topic-manager

- [ ] Name this tool.
- [ ] Settle on a schema for an automatically generated repository manifest,
      which describes a list of topics, and each of their description and list
      of package(s) affected.
- [ ] Implementation.
    - [ ] Updates topic listing from generated manifest(s) upon launch.
    - [ ] Lists topics, descriptions, and list of package(s) affected in a
          multi-selection fashion.
    - [ ] Enrolls (generates respective APT source list(s)) in topic(s), and
          automatically updates system.
    - [ ] Withdrawal based on list of package(s) affected, checked against
          packages installed on current system. Using APT to downgrade
          packages.

# Infrastructure

This section describes changes and additions required for our infrastructures
in order to adapt to a topic-based iteration system.

## Iteration Editor

- [ ] TODO: Liushuyu input needed.

## Packages

- [ ] Drop display of branches in the front page, instead, only display
      single-line architectural statistics.
- [ ] Create a information page containing all topics? List each non-Retro
      architectural progression?
