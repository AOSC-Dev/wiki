+++
title = ".NET 生命周期策略"
description = ""
date = 2020-05-04T03:35:48.616Z
[taxonomies]
tags = ["dev-sys"]
+++

以下的生命周期策略适用于 AOSC OS 中所有的 .NET 软件包，包括微软和 .NET 社区维护的 `dotnet-*` 和 `mono`<sup>[\[1\]][1][\[2\]][2]</sup>。

# .NET Core `dotnet-*`

.NET Core 有两种 [版本类型](https://dotnet.microsoft.com/platform/support/policy/dotnet-core)。

## 生命周期策略

- `stable`：最新长期支持（LTS）版本。
- `testing`：最新（Current）版本。

# Mono `mono`

Mono 有两个 [发布频道](https://www.mono-project.com/download/)。

## 生命周期策略

- `stable`：最新 Visual Studio 发布版本。
- `testing`：最新稳定版本。

# F# + Mono `fsharp`

F# + Mono 的发布来源是 [F# 软件基金会的 GitHub 仓库](https://github.com/fsharp/fsharp/releases)。

## 生命周期策略

- `stable`：最新版本。

<!-- # MSBuild + Mono `msbuild`

TODO... -->

# NuGet + Mono `nuget`

NuGet 有多个可用的 [发布版本](https://www.nuget.org/downloads)。

## 生命周期策略

- `stable`：最新推荐版本。

<!-- More packages policy expected -->

[1]: https://docs.microsoft.com/en-us/dotnet/core/
[2]: https://www.mono-project.com/