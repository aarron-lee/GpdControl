import { PanelSection } from "decky-frontend-lib";
import { VFC } from "react";
import { useRgbProfileDisplayName } from "../../hooks/rgb";
import { RgbPerGameProfilesToggle } from "./RgbPerGameProfilesToggle";
import { RgbSettings } from "./RgbSettings";

const ControllerLightingPanel: VFC = () => {
  const displayName = useRgbProfileDisplayName();

  let title =
    displayName === "Default"
      ? "Controller Lighting"
      : `Controller Lighting - ${displayName.substring(0, 10)}...`;

  return (
    <PanelSection title={title}>
      <RgbPerGameProfilesToggle />
      <RgbSettings />
    </PanelSection>
  );
};

export default ControllerLightingPanel;
