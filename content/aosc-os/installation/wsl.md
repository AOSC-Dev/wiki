+++
title = "Installation/WSL"
description = "Installing AOSC OS on Windows Subsystems for Linux"
date = 2020-09-01T01:28:00.00Z
[taxonomies]
tags = ["sys-installation"]
+++

It is surprisingly easy to run AOSC OS on Windows Subsystems on Linux.

# Forenotes

WSL comes in two flavors:

* WSL1, which has the NT kernel mimic a Linux kernel with no graphics and no 32-bit support;
* WSL2, which uses the Windows Hypervisor Platform to run the distribution's own kernel.

You naturally need to first enable WSL to proceed. Read [Microsoft's guide](https://docs.microsoft.com/en-us/windows/wsl/install-win10) on how.

# Choosing a tarball

As of the time of writing, WSL is only supported on AMD64 devices. Please check the section in the [AMD64 Guide](@/aosc-os/installation/amd64.md#choosing-a-tarball).

# Unpacking the tarball

[LxRunOffline](https://github.com/DDoSolitary/LxRunOffline) is a great tool for managing WSL installs. Among other things that Microsoft does not yet provide, it:

* Allows us to use `xz`-compressed tarballs
* Allows users to place distributions wherever they want
* Allows tweaking all configurations in the WSL distro registry

After you have download the tarball and the tool, run the following in PowerShell:

```powershell
# Unpack the distro (avoid using a name with spaces!)
& ".\LxRunOffline.exe" install `
  -n AOSC-Whatever `
  -d C:\path\to\the\target `
  -f C:\path\to\the\tarball `
  -s
```

Now that the OS is known to WSL, you can start it using any of the usual ways: with `LxRunOffline`, in a new tab in Windows Terminal, or using the desktop shortcut that has just been created.

# Setting up your system

Some more configuration is needed for the WSL system to interoperate with Windows properly. Enter a root shell and run:

```bash
# Remove /etc/resolv.conf so WSL can generate it for us
rm /etc/resolv.conf
# Put sane defaults in /etc/wsl.conf
cat > /etc/wsl.conf << 'EOF'
[automount]
options = "metadata,umask=22,fmask=11"
EOF
# Leave setting PATH to WSL so appends will work
sed -i -e 's/^unset PATH MANPATH/# \1/g' /etc/profile
```

Now exit the shell and re-open it. You should have a functional, if a bit unorthodox, system available. Continue to the [User, and Post-installation Configuration](@/aosc-os/installation/amd64.md#user-and-post-installation-configuration) section of the AMD64 guide.
