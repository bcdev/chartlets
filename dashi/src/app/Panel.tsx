import { CSSProperties, ReactElement } from "react";

import { Contribution } from "../model/contribution";
import { PropertyChangeHandler } from "../model/component";
import DashiComponent from "../components/DashiComponent";
import { ContributionState } from "../store/appStore";
import { CircularProgress } from "@mui/material";

const panelContainerStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  width: 400,
  height: 400,
  padding: 5,
  border: "1px gray solid",
};

interface PanelProps {
  panelModel: Contribution;
  panelState: ContributionState;
  onPropertyChange: PropertyChangeHandler;
}

function Panel({ panelModel, panelState, onPropertyChange }: PanelProps) {
  if (!panelState.visible) {
    return null;
  }
  let panelElement: ReactElement | null = null;
  const componentModelResult = panelState.componentModelResult;
  if (componentModelResult.data) {
    panelElement = (
      <DashiComponent
        {...componentModelResult.data}
        onPropertyChange={onPropertyChange}
      />
    );
  } else if (componentModelResult.error) {
    panelElement = (
      <span>
        Error loading {panelModel.name}: {componentModelResult.error.message}
      </span>
    );
  } else if (componentModelResult.status === "pending") {
    panelElement = (
      <span>
        <CircularProgress size={30} color="secondary" /> Loading{" "}
        {panelModel.name}...
      </span>
    );
  }
  return <div style={panelContainerStyle}>{panelElement}</div>;
}

export default Panel;
