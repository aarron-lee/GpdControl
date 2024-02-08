import { debounce } from "lodash";
import { setCurrentGameId, setInitialState } from "./extraActions";
import { extractCurrentGameId, getServerApi } from "../backend/utils";
import { rgbSlice } from "./rgbSlice";

// -------------
// middleware
// -------------

const mutatingActionTypes = [
  rgbSlice.actions.updateRgbProfiles.type,
  rgbSlice.actions.setColor.type,
  rgbSlice.actions.setPerGameProfilesEnabled.type,
  rgbSlice.actions.setRgbMode.type,
  rgbSlice.actions.setRgbColor.type,
  rgbSlice.actions.setHue.type,
  setCurrentGameId.type,
];

// persist RGB settings to the backend
const saveRgbSettings = (store: any) => {
  const serverApi = getServerApi();

  const {
    rgb: { rgbProfiles, perGameProfilesEnabled },
  } = store.getState();
  const currentGameId = perGameProfilesEnabled
    ? extractCurrentGameId()
    : "default";

  const payload = {
    rgbProfiles,
    currentGameId,
  };

  serverApi?.callPluginMethod("save_rgb_settings", {
    payload,
  });
};
const debouncedSaveRgbSettings = debounce(saveRgbSettings, 300);

export const saveRgbSettingsMiddleware =
  (store: any) => (next: any) => (action: any) => {
    const { type } = action;
    const serverApi = getServerApi();

    const result = next(action);

    if (mutatingActionTypes.includes(type)) {
      // save to backend
      debouncedSaveRgbSettings(store);
    }
    if (type === setInitialState.type || type === setCurrentGameId.type) {
      // tell backend to sync LEDs to current FE state
      const {
        rgb: { perGameProfilesEnabled },
      } = store.getState();
      const currentGameId = perGameProfilesEnabled
        ? extractCurrentGameId()
        : "default";

      serverApi?.callPluginMethod("sync_rgb_settings", { currentGameId });
    }
    if (type === rgbSlice.actions.setPerGameProfilesEnabled.type) {
      serverApi?.callPluginMethod("save_rgb_per_game_profiles_enabled", {
        enabled: Boolean(action.payload),
      });
      if (action.payload) {
        serverApi?.callPluginMethod("sync_rgb_settings", {
          currentGameId: extractCurrentGameId(),
        });
      } else {
        serverApi?.callPluginMethod("sync_rgb_settings", {
          currentGameId: "default",
        });
      }
    }

    return result;
  };
