+++
title = "启用 VA-API"
[extra]
article_type = "技巧"
+++

Firefox 78 或更高版本为 VA-API 提供了支持（如果您在使用 Xorg，则是 80 或更高版本），但这个特性在默认情况下没有被启用。

要启用 VA-API 支持：

0. 首先您要确认 VA-API 可以正常工作。您可以通过安装 `libva-utils` 并运行 `vainfo` 了解工作状态。
1. 启用 `WebRender`。前往 `about:config` 并将 `gfx.webrender.all` 设置为 `true`。如果这不奏效，您可以打开 `OpenGL compositor`，前往 `about:config` 并将 `layers.acceleration.force-enabled` 设置为 `true`。
2. 类似地，前往 `about:config` 并将 `media.ffmpeg.vaapi.enabled` 设置为 `true`。
3. 类似地，前往 `about:config` 并将 `media.ffvpx.enabled` 设置为 `false`。
4. 如果您在使用 Xorg，设置环境变量 `MOZ_X11_EGL=1`。
5. 如果您在使用 Wayland，设置环境变量 `MOZ_ENABLE_WAYLAND=1`。
