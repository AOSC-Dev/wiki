+++
title = "Shortcode showcase"
description = "All available shortcodes in a page."
+++

# Cards
Used to provide clear visual standouts to show that there's something to pay attention to.
## Warning
```markdown
{%/* card(type="warning") */%}
Here is some warning messages in a card.
{%/* end */%}
```
{% card(type="warning") %}
Here is some warning messages in a card.
{% end %}

## Success
```markdown
{%/* card(type="success") */%}
Here is some success messages in a card.
{%/* end */%}
```
{% card(type="success") %}
Here is some success messages in a card.
{% end %}

## Info
```markdown
{%/* card(type="info") */%}
Here is some info in a card.
{%/* end */%}
```
{% card(type="info") %}
Here is some info in a card.
{% end %}

## Danger
```markdown
{%/* card(type="danger") */%}
Here is some danger messages in a card.
{%/* end */%}
```
{% card(type="danger") %}
Here is some danger messages in a card.
{% end %}

# Section
Used in the index of this Wiki, used to show highlight links.

```markdown
{%/* section(name="AOSC OS") */%}
[Is AOSC OS Right for Me?](/aosc-os/is-aosc-os-right-for-me)
Finding Your Best Fit (or Not)

[Installation Guides](/aosc-os/installation/)
Installing AOSC OS on Your Device

[AOSC OS/Retro](/aosc-os/retro/intro)
Enjoying AOSC OS on Your Retro Devices
{%/* end */%}
```

And here's the result (section number will not display on the index page):
{% section(name="AOSC OS") %}
[Is AOSC OS Right for Me?](/aosc-os/is-aosc-os-right-for-me)
Finding Your Best Fit (or Not)

[Installation Guides](/aosc-os/installation/)
Installing AOSC OS on Your Device

[AOSC OS/Retro](/aosc-os/retro/intro)
Enjoying AOSC OS on Your Retro Devices
{% end %}
