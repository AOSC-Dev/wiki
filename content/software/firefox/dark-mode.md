+++
title = "Global Dark Mode"
[extra]
article_type = "Tricks"
+++

To enable dark mode throughout Firefox, enter `about:config` and add a field named `ui.systemUsesDarkTheme` as an integer. Set this field to 1 for forced dark and 0 for forced light.

This field will change the media query result for web pages (you will notice this site goes dark) and also built-in Firefox pages (like the Add-on menu and such).
