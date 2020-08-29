+++
title = ".NET Lifecycle Policy"
description = ""
date = 2020-05-04T03:35:48.616Z
[taxonomies]
tags = ["dev-sys"]
+++

This policy covers .NET packages in AOSC OS, like `dotnet-*` and `mono`, which are maintained by Microsoft and the .NET community<sup>[1][1],[2][2]</sup>.

# .NET Core `dotnet-*`

.NET Core has 2 [release types](https://dotnet.microsoft.com/platform/support/policy/dotnet-core).

## Policy

- `stable`: Latest LTS release
- `testing`: Latest Current release

# Mono `mono`

Mono has 2 [release channels](https://www.mono-project.com/download/).

## Policy

- `stable`: Latest Visual Studio release
- `testing`: Latest Stable release

# F# + Mono `fsharp`

F# + Mono is published from [F# Software Foundation's repo](https://github.com/fsharp/fsharp/releases).

## Policy

- `stable`: Latest release

<!-- # MSBuild + Mono `msbuild`

TODO... -->

# NuGet + Mono `nuget`

NuGet has many [distribution versions](https://www.nuget.org/downloads) available.

## Policy

- `stable`: Latest recommended release

<!-- More packages policy expected -->

[1]: https://docs.microsoft.com/en-us/dotnet/core/
[2]: https://www.mono-project.com/