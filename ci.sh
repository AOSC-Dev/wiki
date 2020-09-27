#!/bin/bash
ZOLA_VERSION='0.12.0'

wget -q https://github.com/getzola/zola/releases/download/v"$ZOLA_VERSION"/zola-v"$ZOLA_VERSION"-x86_64-unknown-linux-gnu.tar.gz
tar xf zola-v"$ZOLA_VERSION"-x86_64-unknown-linux-gnu.tar.gz
sudo cp zola /usr/local/bin/
