import type { CSSProperties, ReactElement } from "react";
import CircularProgress from "@mui/material/CircularProgress";

import {
  type PropertyChangeHandler,
  type ContributionState,
  DashiComponent,
} from "@/lib";
import type { PanelState } from "@/demo/types";

const panelContainerStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  width: 400,
  height: 400,
  border: "1px gray solid",
};

const panelHeaderStyle: CSSProperties = {
  flexGrow: 0,
  display: "flex",
  flexDirection: "row",
  width: "100%",
  textAlign: "center",
  background: "lightgray",
  padding: "2px 4px 2px 4px",
};

const panelContentStyle: CSSProperties = {
  width: "100%",
  flexGrow: 1,
  padding: 2,
};

interface PanelProps extends ContributionState<PanelState> {
  onPropertyChange: PropertyChangeHandler;
}

function Panel({
  name,
  state,
  componentState,
  componentResult,
  onPropertyChange,
}: PanelProps) {
  if (!state.visible) {
    return null;
  }
  let panelElement: ReactElement | null = null;
  if (componentState) {
    panelElement = (
      <DashiComponent {...componentState} onPropertyChange={onPropertyChange} />
    );
  } else if (componentResult.error) {
    panelElement = (
      <span>
        Error loading {name}: {componentResult.error.message}
      </span>
    );
  } else if (componentResult.status === "pending") {
    panelElement = (
      <span>
        <CircularProgress size={30} color="secondary" /> Loading {name}...
      </span>
    );
  }
  return (
    <div style={panelContainerStyle}>
      <div style={panelHeaderStyle}>{state.title}</div>
      <div style={panelContentStyle}>{panelElement}</div>
    </div>
  );
}

export default Panel;
