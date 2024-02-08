import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { get, merge } from "lodash";
import type { RootState } from "./store";
import { setCurrentGameId, setInitialState } from "./extraActions";
import { extractCurrentGameId } from "../backend/utils";
import { RgbModes } from "../backend/constants";
import { Router } from "decky-frontend-lib";

const DEFAULT_RGB_LIGHT_VALUES: RgbLight = {
  mode: RgbModes.ROTATE,
  red: 255,
  green: 0,
  blue: 0,
  hue: 0,
};

enum Colors {
  RED = "red",
  GREEN = "green",
  BLUE = "blue",
}

type RgbLight = {
  mode: RgbModes;
  red: number;
  green: number;
  blue: number;
  hue: number;
};

type RgbProfiles = {
  [gameId: string]: RgbLight;
};

type RgbState = {
  rgbProfiles: RgbProfiles;
  perGameProfilesEnabled: boolean;
};

const initialState: RgbState = {
  rgbProfiles: {},
  perGameProfilesEnabled: false,
};

const bootstrapRgbProfile = (state: RgbState, newGameId: string) => {
  if (!state.rgbProfiles) {
    // rgbProfiles don't exist yet, create it
    state.rgbProfiles = {};
  }
  if (
    // only initialize profile if perGameProfiles are enabled
    (!state.rgbProfiles[newGameId] && state.perGameProfilesEnabled) ||
    // always initialize default
    newGameId === "default"
  ) {
    const defaultProfile = get(
      state,
      "rgbProfiles.default",
      DEFAULT_RGB_LIGHT_VALUES
    ) as RgbLight;

    state.rgbProfiles[newGameId] = defaultProfile;
  }
};

export const rgbSlice = createSlice({
  name: "rgb",
  initialState,
  reducers: {
    setPerGameProfilesEnabled: (state, action: PayloadAction<boolean>) => {
      const enabled = action.payload;
      state.perGameProfilesEnabled = enabled;
      if (enabled) {
        bootstrapRgbProfile(state, extractCurrentGameId());
      }
    },
    setRgbMode: (state, action: PayloadAction<{ mode: RgbModes }>) => {
      const { mode } = action.payload;
      setStateValue({
        sliceState: state,
        key: "mode",
        value: mode,
      });
    },
    updateRgbProfiles: (state, action: PayloadAction<RgbProfiles>) => {
      merge(state.rgbProfiles, action.payload);
    },
    setColor: (
      state,
      action: PayloadAction<{
        color: Colors;
        value: number;
      }>
    ) => {
      const { color, value } = action.payload;
      setStateValue({
        sliceState: state,
        key: color,
        value,
      });
    },
    setRgbColor: (
      state,
      action: PayloadAction<{
        red: number;
        green: number;
        blue: number;
        hue: number;
      }>
    ) => {
      const { red, green, blue, hue } = action.payload;
      const currentGameId = extractCurrentGameId();
      if (state.perGameProfilesEnabled) {
        state.rgbProfiles[currentGameId].red = red;
        state.rgbProfiles[currentGameId].green = green;
        state.rgbProfiles[currentGameId].blue = blue;
        state.rgbProfiles[currentGameId].hue = hue;
      } else {
        state.rgbProfiles["default"].red = red;
        state.rgbProfiles["default"].green = green;
        state.rgbProfiles["default"].blue = blue;
        state.rgbProfiles["default"].hue = hue;
      }
    },
    setEnabled: (
      state,
      action: PayloadAction<{
        enabled: boolean;
      }>
    ) => {
      const { enabled } = action.payload;

      setStateValue({
        sliceState: state,
        key: "enabled",
        value: enabled,
      });
    },
    setHue: (
      state,
      action: PayloadAction<{
        hue: number;
      }>
    ) => {
      const { hue } = action.payload;
      const currentGameId = extractCurrentGameId();
      if (state.perGameProfilesEnabled) {
        state.rgbProfiles[currentGameId].hue = hue;
      } else {
        state.rgbProfiles["default"].hue = hue;
      }
      setStateValue({
        sliceState: state,
        key: "hue",
        value: hue,
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(setInitialState, (state, action) => {
      const rgbProfiles = action.payload.rgb as RgbProfiles;
      const perGameProfilesEnabled = Boolean(
        action.payload.rgbPerGameProfilesEnabled
      );

      state.rgbProfiles = rgbProfiles;
      state.perGameProfilesEnabled = perGameProfilesEnabled;
    });
    builder.addCase(setCurrentGameId, (state, action) => {
      /*
        currentGameIdChanged, check if exists in redux store.
        if not exists, bootstrap it on frontend
      */
      const newGameId = action.payload as string;
      bootstrapRgbProfile(state, newGameId);
    });
  },
});

// -------------
// selectors
// -------------

export const selectRgbInfo = (state: RootState) => {
  const currentGameId = extractCurrentGameId();
  let rgbInfo;
  if (state.rgb.perGameProfilesEnabled) {
    rgbInfo = state.rgb.rgbProfiles[currentGameId];
  } else {
    rgbInfo = state.rgb.rgbProfiles["default"];
  }

  return rgbInfo;
};

export const selectRgbMode = (state: RootState) => {
  const currentGameId = extractCurrentGameId();
  let rgbMode;
  if (state.rgb.perGameProfilesEnabled) {
    rgbMode = state.rgb.rgbProfiles[currentGameId].mode;
  } else {
    rgbMode = state.rgb.rgbProfiles["default"].mode;
  }

  return rgbMode;
};

export const selectPerGameProfilesEnabled = (state: RootState) => {
  return state.rgb.perGameProfilesEnabled;
};

export const selectRgbProfileDisplayName = (state: RootState) => {
  if (state.rgb.perGameProfilesEnabled) {
    return Router.MainRunningApp?.display_name || "Default";
  } else {
    return "Default";
  }
};

// -------------
// Slice Util functions
// -------------

function setStateValue({
  sliceState,
  key,
  value,
}: {
  sliceState: RgbState;
  key: string;
  value: any;
}) {
  if (sliceState.perGameProfilesEnabled) {
    const currentGameId = extractCurrentGameId();
    sliceState.rgbProfiles[currentGameId][key] = value;
  } else {
    sliceState.rgbProfiles["default"][key] = value;
  }
}
