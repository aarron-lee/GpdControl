import { FC } from "react";
import { SliderField, NotchLabel } from "decky-frontend-lib";
import { useRgbMode } from "../../hooks/rgb";
import { capitalize } from "lodash";
import { RgbModes } from "../../backend/constants";

enum Mode {
  OFF = 0,
  SOLID = 1,
  BREATHE = 2,
  ROTATE = 3,
}

const RgbModeSlider: FC = () => {
  const [mode, setMode] = useRgbMode();

  const handleSliderChange = (value: number) => {
    return setMode(Mode[value]);
  };

  const MODES: NotchLabel[] = Object.keys(Mode)
    .filter((key) => isNaN(Number(key)))
    .map((mode, idx) => {
      return { notchIndex: idx, label: capitalize(mode), value: idx };
    });

  // known bug: typescript has incorrect type for reverse mapping from enums
  const sliderValue = Mode[mode] as any;

  return (
    <>
      <SliderField
        value={sliderValue}
        min={0}
        max={MODES.length - 1}
        step={1}
        notchCount={MODES.length}
        notchLabels={MODES}
        notchTicksVisible={true}
        showValue={false}
        bottomSeparator={"none"}
        onChange={handleSliderChange}
      />
    </>
  );
};

export default RgbModeSlider;
