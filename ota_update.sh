#!/usr/bin/bash
# does the following:
# - Update GpdControl Decky Plugin

if [ ! -f '/tmp/GpdControl.tar.gz' ]; then
  echo "Failed to find downloaded plugin"
  exit -1
fi

DECKY_DIR="$HOME/homebrew/plugins"

if [ ! -d $DECKY_DIR ]; then
  echo "Failed to find DECKY_DIR at: "
  echo $DECKY_DIR
  exit -1
fi

rm -rf $DECKY_DIR/GpdControl

tar -xzf /tmp/GpdControl.tar.gz -C $DECKY_DIR

# install complete, remove files
rm  -rf /tmp/GpdControl.tar.gz

systemctl restart plugin_loader.service
