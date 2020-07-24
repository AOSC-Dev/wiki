#!/bin/bash

sed -i 's/^---$/+++/g;
s/^title: /title =/g;
s/^description:/description =/g;
/^published.*/d;
s/^date:/date =/g;
s/^tags:/tags =/g;
/^editor:/d' $1
