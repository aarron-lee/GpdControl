import { SliderField, gamepadSliderClasses } from "decky-frontend-lib";
import { FC } from "react";
import { useRgb, useRgbMode } from "../../hooks/rgb";
import RgbModeSlider from "./RgbModeSlider";
import { RgbModes } from "../../backend/constants";

const HIDE_COLOR_PICKER_MODES = [RgbModes.ROTATE, RgbModes.OFF];

export const RgbSettings: FC = () => {
  const rgb = useRgb();
  const { hue } = rgb.rgbInfo;
  const [mode] = useRgbMode();

  const label = "Controller LED";

  return (
    <>
      <RgbModeSlider />
      {!HIDE_COLOR_PICKER_MODES.includes(mode) && (
        <>
          <div className="ColorPicker_HSlider">
            <SliderField
              showValue
              label="Hue"
              value={hue}
              min={0}
              max={359}
              validValues="range"
              bottomSeparator="thick"
              onChange={(value) => rgb.setHue(value)}
            />
          </div>
        </>
      )}
      <style>
        {`
            .ColorPicker_HSlider .${gamepadSliderClasses.SliderTrack} {
              background: linear-gradient(
                to right,
                hsl(0, 100%, 50%),
                hsl(60, 100%, 50%),
                hsl(120, 100%, 50%),
                hsl(180, 100%, 50%),
                hsl(240, 100%, 50%),
                hsl(300, 100%, 50%),
                hsl(360, 100%, 50%)
              ) !important;
              --left-track-color: #0000 !important;
              --colored-toggles-main-color: #0000 !important;
            }
          `}
      </style>
    </>
  );
};
