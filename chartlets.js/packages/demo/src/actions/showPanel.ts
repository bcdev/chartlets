/*
 * Copyright (c) 2019-2026 by Brockmann Consult Development team
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { updateContributionContainer } from "chartlets";

import type { PanelState } from "@/types";

export function showPanel(panelIndex: number) {
  updateContributionContainer<PanelState>("panels", panelIndex, {
    visible: true,
  });
}
