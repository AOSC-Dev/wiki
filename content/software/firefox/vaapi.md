+++
title = "Enable VA-API"
[extra]
article_type = "Tricks"
+++

Starting from 78, Firefox supports VA-API (starting from 80, if you are using Xorg), but the feature is not enabled by default.

To turn on VA-API capability:

0. Make sure VA-API is working in the first place. You can check VA-API status via installing `libva-utils` and run `vainfo`.
1. Enable `WebRender`. Go to `about:config` and search for `gfx.webrender.all`, set it to `true`.
2. Also in `about:config`, set `media.ffmpeg.vaapi.enabled` to `true`.
3. Also in `about:config`, set `media.ffvpx.enabled` to `false`.
4. If you are using Xorg, set environmental variable `MOZ_X11_EGL=1`
5. If you are using Wayland, set environmental variable `MOZ_ENABLE_WAYLAND=1`.
