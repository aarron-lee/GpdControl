import decky_plugin
import time
import subprocess
import os
import plugin_settings as settings
from wincontrols import hardware

GPD_CONFIG_PATH = f'{decky_plugin.DECKY_USER_HOME}/homebrew/plugins/GpdControl/bin/gpdconfig'

# sync the state of the RGB lights to the values in settings.json
def sync_rgb_settings(current_game_id):
    s = settings.get_settings()

    rgb_profile = s.get('rgb').get(current_game_id)

    mode = rgb_profile.get('mode')

    if mode:
        set_rgb_mode(mode)
    
    if mode == "SOLID" or mode == "BREATHE":
        time.sleep(0.5)
        # set color
        red = "{:02x}".format(rgb_profile.get('red'))
        green = "{:02x}".format(rgb_profile.get('green'))
        blue = "{:02x}".format(rgb_profile.get('blue'))

        hexstring = f'{blue}{green}{red}'

        cmd = f'colour={hexstring}'

        set_config(cmd)

def set_rgb_mode(mode):
    cmd = f'ledmode={mode.lower()}'

    set_config(cmd)

def set_config(cmd):
    try:
        wc = hardware.WinControls(disableFwCheck=False)

        if wc.loaded:
            try:
                if wc.setConfig(config=cmd):
                    wc.writeConfig()
            except Exception as e:
                decky_plugin.logger.error(f'write error: {e}')
    except Exception as e:
        decky_plugin.logger.error(f'error {e}')
