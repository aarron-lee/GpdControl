import os
import subprocess
from settings import SettingsManager

settings_directory = os.environ["DECKY_PLUGIN_SETTINGS_DIR"]
settings_path = os.path.join(settings_directory, 'settings.json')
setting_file = SettingsManager(name="settings", settings_directory=settings_directory)
setting_file.read()

def deep_merge(origin, destination):
    for k, v in origin.items():
        if isinstance(v, dict):
            n = destination.setdefault(k, {})
            deep_merge(v, n)
        else:
            destination[k] = v

    return destination

def get_settings():
    setting_file.read()
    return setting_file.settings

def set_setting(name: str, value):
    return setting_file.setSetting(name, value)

DEFAULT_RGB_LIGHT_VALUES = {
  "red": 255,
  "green": 0,
  "blue": 0,
  "hue": 0
}

def bootstrap_rgb_settings(profileName: str):
    settings = get_settings()

    if not settings.get('rgb'):
        settings['rgb'] = {}
    rgb_profiles = settings['rgb']
    if not rgb_profiles.get(profileName):
        rgb_profiles[profileName] = {}
    rgb_profile = rgb_profiles[profileName]
    default_rgb_profile = rgb_profiles.get('default')

    if not rgb_profile:
        rgb_profile = default_rgb_profile or DEFAULT_RGB_LIGHT_VALUES

def set_rgb_profile_value(profileName: str, key: str, value):
    bootstrap_rgb_settings(profileName)

    setting_file.settings['rgb'][profileName][key] = value
    setting_file.commit()

def set_rgb_profile_values(profileName: str, values):
    bootstrap_rgb_settings(profileName)

    profile = setting_file.settings['rgb'][profileName]

    deep_merge(values, profile)

    setting_file.settings['rgb'][profileName] = profile

    setting_file.commit()

def set_all_rgb_profiles(rgb_profiles):
    for profileName, rgbProfile in rgb_profiles.items():
        set_rgb_profile_values(
            profileName=profileName,
            values=rgbProfile
        )
