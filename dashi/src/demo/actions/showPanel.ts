import { updateContributionState } from "@/lib";
import type { PanelState } from "@/demo/types";

export function showPanel(panelIndex: number) {
  updateContributionState<PanelState>("panels", panelIndex, { visible: true });
}