+++
title = "SYS-KB-00003：JACK 配置"
description = "在 AOSC OS 上使用 JACK 音频工具"
date = 2020-05-04T03:37:29.098Z
[taxonomies]
tags = ["sys-kb"]
+++

# JACK

JACK 是一个低延迟的声音工具包。它提供内置的 DSP、音频服务和音频路由，以满足您日常使用和专业音频制作的需要。然而，鉴于此软件包的性质，我们不可能提供一个现成的配置来满足您的需要。

# 安装和配置

您可以在 AOSC OS 的软件仓库找到 JACK：

```
sudo apt install jack
```

但 JACK 也不是完全开箱可用的，要想 JACK 工作，您需要：

- 使用 `sudo usermod -aG audio <your username>` 命令将您自己添加到 `audio` 用户组。
- （可选）为了提升您的使用体验，我们建议您安装 `cadence` 来为 JACK 提供一个 GUI 前端。
- 注销并重新登陆以应用更改。
- 使用 `jack_control start` 启动 JACK。如果您安装了 `cadence`，您可以直接运行 `cadence` 并点击窗口右侧的 `Start` 按钮。
- 启动需要 JACK 的应用程序。

# 常见问题

## JACK 报错：`Cannot lock down XXX byte memory area (Cannot allocate memory)`
- 成因：锁定内存限制低。
- 解决方案：尝试重新执行上面提到的步骤一和步骤三。

## JACK 报错：`Cannot use real-time scheduling (RR/5)(1: Operation not permitted)`
- 成因：实时优先级很低。
- 解决方案：尝试重新执行上面提到的步骤一和步骤三。
 
## JACK 已在运行，但仍然没有声音

- 成因 1：JACK 运行时出错。请查看日志（如果您安装了 `cadence`，点击 `Tools -> View JACK, A2J and LADISH logs` 即可查看），并查看错误消息是否与上述类似。
- 成因 2：如果 JACK 能正常运行（配置没出错，JACK 没有报错，没有 Xrun），请检查 JACK 是否使用了正确的声卡、音频设备和输出设备。如果您安装了 `cadence`，则可以前往 `System -> Configure -> Driver -> ALSA` 找到 `Driver/Interface` 选项并检查您的设定是否正确。如果您没有安装 `cadence`，您可以执行 `jack_control dpd` 来查看当前探测到的音频接口，并使用 `jack_control dps <interface number>` 设置音频接口。
- 成因 3：如果 JACK 能正常运行（配置没出错，JACK 没有报错，没有 Xrun），也使用了正确的音频接口，请检查音频路由设置是否正确。如果您安装了 `cadence`，则可以前往 `Tools -> Catia` 并检查应用程序播放端口是否连接到了系统。
- 成因 4：如果您的应用程序使用 ALSA 或 PulseAudio，请检查 JACK 桥接器是否已启用，并检查其日志以查看它们是否在建立桥接时遇到困难。如果使用的是 PulseAudio，请确保 `JACK Bridges -> PulseAudio` 处于运行状态，`Stop` 按钮下方有一个 `...` 菜单，请确保您在该处选择 `Playback mode only`。接下来再次点击 `Stop`，此时您会看到它自动重新启动桥接。
 
## JACK 已在运行，但是我的声音散射或失真

- 成因：您的缓冲区大小太小，设备无法及时处理信号。
- 解决方案：增加缓冲区大小和延迟，或者升级设备硬件。

# 已知问题

- 如果您在使用版本低于 `1.9.11rc1-1` 的 JACK，那么它将不会工作。这是我们打包失误造成的，烦请您将 JACK 升级到最新版本。