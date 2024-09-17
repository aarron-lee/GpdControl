# GpdControl - Decky Plugin

Decky Plugin that replicates some of the Gpd WinControls functionality.

![plugin image](./images/image.png)

# Features

- Per game RGB controls

# Install

### Prerequisites

Decky Loader must already be installed.

### Quick Install / Update

Run the following in terminal, then reboot. Note that this works both for installing or updating the plugin

```
curl -L https://github.com/aarron-lee/GpdControl/raw/main/install.sh | sh

```

### Manual Install

Download the latest release from the [releases page](https://github.com/aarron-lee/GpdControl/releases)

Unzip the `tar.gz` file, and move the `GpdControl` folder to your `$HOME/homebrew/plugins` directory

then run:

```
sudo systemctl restart plugin_loader.service
```

then reboot your machine.

## Manual build

Dependencies:

- Node.js v16.14+ and pnpm installed

```bash
git clone https://github.com/aarron-lee/GpdControl.git

cd GpdControl

# if pnpm not already installed
npm install -g pnpm

pnpm install
pnpm update decky-frontend-lib --latest
pnpm run build
```

Afterwards, you can place the entire `GpdControl` folder in the `~/homebrew/plugins` directly, then restart your plugin service

```bash
sudo systemctl restart plugin_loader.service
```

# Attribution

Big thanks to [pelrun's pyWinControls](https://github.com/pelrun/pyWinControls/) for the original gpd win control tool (GPL 3.0)

- vendored and modified for use [here](./py_modules/wincontrols/)

Built using Decky Plugin Template: https://github.com/SteamDeckHomebrew/decky-plugin-template/

Vendored python dependency for hid.py

- hid.py v1.0.5 by Austin Morton, MIT License. unmodified file [here](./py_modules/wincontrols/gpd_hid.py)
