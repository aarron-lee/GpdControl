import os
import logging
import decky_plugin
import plugin_enums
import rgb
import file_timeout
import plugin_update
import plugin_settings
from time import sleep

try:
    LOG_LOCATION = f"/tmp/gpdControl.log"
    logging.basicConfig(
        level = logging.INFO,
        filename = LOG_LOCATION,
        format="[%(asctime)s | %(filename)s:%(lineno)s:%(funcName)s] %(levelname)s: %(message)s",
        filemode = 'w',
        force = True)
except Exception as e:
    logging.error(f"exception|{e}")

class Plugin:
    # Asyncio-compatible long-running code, executed in a task when the plugin is loaded
    async def _main(self):
        decky_plugin.logger.info("Hello World!")

    async def get_settings(self):
        results = plugin_settings.get_settings()

        try:
            results['pluginVersionNum'] = f'{decky_plugin.DECKY_PLUGIN_VERSION}'

        except Exception as e:
            decky_plugin.logger.error(e)

        return results

    async def save_rgb_per_game_profiles_enabled(self, enabled: bool):
        return plugin_settings.set_setting('rgbPerGameProfilesEnabled', enabled)

    async def save_rgb_settings(self, payload):
        currentGameId = payload.get('currentGameId')
        rgbProfiles = payload.get('rgbProfiles')
        result = plugin_settings.set_all_rgb_profiles(rgbProfiles)

        if currentGameId:
            rgb.sync_rgb_settings(currentGameId)
        return result

    # sync state in settings.json to actual controller RGB hardware
    async def sync_rgb_settings(self, currentGameId):
        return rgb.sync_rgb_settings(currentGameId)

    async def ota_update(self):
        # trigger ota update
        try:
            with file_timeout.time_limit(15):
                plugin_update.ota_update()
        except Exception as e:
            logging.error(e)

    # Function called first during the unload process, utilize this to handle your plugin being removed
    async def _unload(self):
        decky_plugin.logger.info("Goodbye World!")
        pass

    # Migrations that should be performed before entering `_main()`.
    async def _migration(self):
        decky_plugin.logger.info("Migrating")
        # Here's a migration example for logs:
        # - `~/.config/decky-template/template.log` will be migrated to `decky_plugin.DECKY_PLUGIN_LOG_DIR/template.log`
        decky_plugin.migrate_logs(os.path.join(decky_plugin.DECKY_USER_HOME,
                                               ".config", "decky-template", "template.log"))
        # Here's a migration example for settings:
        # - `~/homebrew/settings/template.json` is migrated to `decky_plugin.DECKY_PLUGIN_SETTINGS_DIR/template.json`
        # - `~/.config/decky-template/` all files and directories under this root are migrated to `decky_plugin.DECKY_PLUGIN_SETTINGS_DIR/`
        decky_plugin.migrate_settings(
            os.path.join(decky_plugin.DECKY_HOME, "settings", "template.json"),
            os.path.join(decky_plugin.DECKY_USER_HOME, ".config", "decky-template"))
        # Here's a migration example for runtime data:
        # - `~/homebrew/template/` all files and directories under this root are migrated to `decky_plugin.DECKY_PLUGIN_RUNTIME_DIR/`
        # - `~/.local/share/decky-template/` all files and directories under this root are migrated to `decky_plugin.DECKY_PLUGIN_RUNTIME_DIR/`
        decky_plugin.migrate_runtime(
            os.path.join(decky_plugin.DECKY_HOME, "template"),
            os.path.join(decky_plugin.DECKY_USER_HOME, ".local", "share", "decky-template"))

    async def log_info(self, info):
        logging.info(info)