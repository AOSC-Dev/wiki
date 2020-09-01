+++
title = "SYS-KB-00003: Configuration of JACK"
description = "JACK Audio Connection Kit Configuration on AOSC OS"
date = 2020-05-04T03:37:29.098Z
[taxonomies]
tags = ["sys-kb"]
+++

# JACK Audio Connection Kit

JACK is a super low latency sound toolkit. It provides builtin DSP, sound server and sound routing to suit your daily usage and pro-audio production needs. However, given the nature of this kit of software, it is not possible for us to provide an out-of-the-box configuartion that works to suite your needs.

# Installation & Configuration

To install JACK on AOSC OS, simply issue the following command:

```
sudo apt install jack
```

And if you think that's it, then you are unfortunately - not mentally ready for JACK.

To make JACK at run, you would need to:

- Add yourself to `audio` group by issuing the command `sudo usermod -aG audio <your username>`
- **Optional** To enhance your experience, you are recommended to install `cadence`, which is a GUI application to configure various settings of JACK
- Re-login to activate new settings
- Start JACK server by issuing `jack_control start`, if you have `cadence` installed, just fire up `cadence` and hit that `Start` button on the right
- Start your application that requires jack

# Troubleshooting
## JACK shows error message `Cannot lock down XXX byte memory area (Cannot allocate memory)`
- Cause: The locked memory limit is low.
- Solution: Try to repeat the step 1 and step 3 of the above intructions.

## JACK shows error message `Cannot use real-time scheduling (RR/5)(1: Operation not permitted)`
- Cause: The Realtime Priority is very low.
- Solution: Try to repeat the step 1 and step 3 of the above intructions.
 
## JACK is up and running but there's no sound coming out
- Possible Cause 1: JACK encountered errors and is spitting out error messages, please see the logs (if you have `cadence` installed, see `Tools -> View JACK, A2J and LADISH logs`) and see if the error messages are similar to the aforementioned ones.
- Possible Cause 2: If JACK is running correctly (no misconfiguration, no error messages, no xruns), check if JACK is using the correct sound card / sound device / output device. If you have `cadence` installed, you can see the if the `Driver/Interface` option in `System -> Configure -> Driver -> ALSA` is set to correct one. If you don't have `cadence` installed, you can issue `jack_control dpd` to see the currently known sound interface, and use `jack_control dps <interface number>` to set it.
- Possible Cause 3: If JACK is running correctly (no misconfiguration, no error messages, no xruns) and the sound device settings are correct, check if the sound routing is correct. If you have `cadence` installed, you can see the sound routing map at `Tools -> Catia`, check if your application playback port is connected to system playback, if not, draw the connections between them.
- Possible Cause 4: If your applications use ALSA or PulseAudio, check if the JACK bridges are enabled and check the bridge logs to see if they are having difficulties routing the signals. Please note if PulseAudio is used, please make sure the `JACK Bridges -> PulseAudio` is in running state, and there's a `...` button below the `Stop` button, make sure to click it and select `Playback mode only`, after that, click `Stop` once, you'll see it automatically restart bridge.
 
## JACK is running but I got scattered or distorted sound
- Cause: Your buffer size is too small and your device is not powerful enough to process the signals in time.
- Solution: Increase the buffer size and the delay or upgrade your device hardware.

# Known Issues
- If you are using JACK package prior to version `1.9.11rc1-1` then it will not work at all. There was a packaging problem on our side, please upgrade it to latest version.