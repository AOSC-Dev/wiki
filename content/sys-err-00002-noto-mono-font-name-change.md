+++
title = "SYS-ERR-00002: Noto Mono Fonts Displayed as Sans Serif with Recent Font Package Update"
description = "Noto Mono Font Name Changes and Possible Impacts"
date = 2020-05-04T03:36:40.111Z
[taxonomies]
tags = ["sys-errata"]
+++

# Summary

With the recent `noto-font` package update, version `1:20180324` and above, the "Noto Mono" (monospace) font family has now gotten a new name "Noto Sans Mono" - and with this, if "Noto Mono" has been specified as the default fixed-width or monospace font ("Adobe Source Code Pro" is the default monospace font), one may experience the following issues (listed below are the ones we were able to identify so far):

- Text in terminal emulators could be overlapped, and the cursor may not align with text input.
- Text editors utilising monospace fonts may display in non-monospace fonts, altering text display appearance.
- When sending "code block" messages in Telegram Desktop may display in non-monospace fonts, making it difficult to identify normal messages from these "code block" messages.

# Possible Cause

With the recent `noto-font` package update, version `1:20180324` and above, the "Noto Mono" (monospace) font family has now gotten a new name "Noto Sans Mono":

| Old Font Name | New Font Name |
|-------------------------|--------------------------|
| Noto Mono Bold | Noto Sans Mono Bold |
| Noto Mono CJK JP Bold | Noto Sans Mono CJK JP Bold |
| Noto Mono CJK JP Regular | Noto Sans Mono CJK JP Regular |
| Noto Mono ... |Noto Sans Mono ... |

However, if one have specified one of the fonts from the former "Noto Mono" family within a desktop environment's configuration, or within a custom Fontconfig XML file - take this example from a KDE configuration:

```ini
[General]
ColorScheme=Breeze
...
fixed=Noto Mono,9,-1,5,50,0,0,0,0,0,Regular
...
```

With the recent `noto-fonts` update, the application(s) relying on a configuration like the one demonstrated above will fail to find the new "Noto Sans Mono" fonts, resulting in the issue where these supposed monospace/fixed-width fonts are displayed as variable-width Sans Serif fonts, or the default "Noto Sans Regular" font - resulting in the issues described above.

# Workaround

Unfortunately, this issue is impossible to address via future package updates - as system updates will not alter user-defined configurations. To resolve this issue, you will need to use appropriate configuration utilities to specify the "correct" font name - "Noto Sans Mono" counterparts of the former "Noto Mono" family.
