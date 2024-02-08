 #!/bin/bash
# for localhost dev purposes
pnpm run build
sudo rm -r $HOME/homebrew/plugins/GpdControl/
sudo rm -rf $HOME/homebrew/logs/GpdControl/*
sudo cp -r ../GpdControl/ $HOME/homebrew/plugins/
sudo systemctl restart plugin_loader.service