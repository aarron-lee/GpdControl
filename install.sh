#!/usr/bin/bash
# does the following:
# - RGB control via GpdControl Decky Plugin
if [ "$EUID" -eq 0 ]
  then echo "Please do not run as root"
  exit
fi

echo "removing previous install if it exists"

cd $HOME

sudo rm -rf $HOME/homebrew/plugins/GpdControl

cat << EOF | sudo tee -a "/etc/udev/rules.d/99-gpd-control-kb.rules"
SUBSYSTEM=="hidraw", ATTRS{idVendor}=="2f24", ATTRS{idProduct}=="0135", MODE="0666"
EOF

echo "installing GpdControl plugin for RGB control"
# download + install Legion go remapper
curl -L $(curl -s https://api.github.com/repos/aarron-lee/GpdControl/releases/latest | grep "browser_download_url" | cut -d '"' -f 4) -o $HOME/GpdControl.tar.gz
sudo tar -xzf GpdControl.tar.gz -C $HOME/homebrew/plugins

# install complete, remove build dir
rm  $HOME/GpdControl.tar.gz
sudo systemctl restart plugin_loader.service
echo "Installation complete"
