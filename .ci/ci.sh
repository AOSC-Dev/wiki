#!/bin/bash
ZOLA_VERSION='0.12.0'

echo 'Installing Zola ...'
wget -q https://github.com/getzola/zola/releases/download/v"$ZOLA_VERSION"/zola-v"$ZOLA_VERSION"-x86_64-unknown-linux-gnu.tar.gz
tar xvf zola-v"$ZOLA_VERSION"-x86_64-unknown-linux-gnu.tar.gz
sudo install -Dvm755 zola /usr/local/bin/
