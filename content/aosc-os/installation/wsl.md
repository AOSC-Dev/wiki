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

**Note**: as is the case for any type of installation, you can greatly speed up the process by temporarily disabling your antivirus or by adding the target directory to an exclusion list.

Now that the OS is known to WSL, you can start it using any of the usual ways: with `LxRunOffline`, in a new tab in Windows Terminal, or using the desktop shortcut that has just been created.

# Setting up your system

Some more configuration is needed for the WSL system to interoperate with Windows properly. Enter a root shell in the new WSL instance of AOSC OS and run:

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

LxRunOffline cannot create WSL2 instances. You may convert the WSL1 instance to WSL2 using `wsl  --set-version AOSC-Whatever 2` ([MS documentation](https://docs.microsoft.com/en-us/windows/wsl/install-win10)). Notice that you need to keep your disk [uncompressed and unencrypted](https://github.com/microsoft/WSL/issues/4103), or you may get an error while creating the VHDX file.

# Any more plumbing needed?

Sadly, yes.

<!-- can we use https://www.markdownguide.org/extended-syntax#definition-lists ? -->
<dl>
  <dt>Graphics</dt>
  <dd>Apparently we need [Xvnc and a heavily modified version of systemd](https://most-useful.com/ubuntu-20-04-desktop-gui-on-wsl-2-on-surface-pro-4/) for a graphical login screen. Add that to the packaging list.</dd>
  <dt>Windows Store</dt>
  <dd>We will eventually need to provide gzipped tarballs when we want to submit AOSC OS to Windows Store. Unless Microsoft [gets its act together](https://github.com/microsoft/WSL/issues/4736), that is.</dd>
  <dd>And we better fix the ugly `/etc/profile` hack before we submit. Not that Microsoft cares.</dd>
</dl>
