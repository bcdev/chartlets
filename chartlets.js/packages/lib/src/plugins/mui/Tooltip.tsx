/*
 * Copyright (c) 2019-2026 by Brockmann Consult Development team
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import MuiTooltip from "@mui/material/Tooltip";
import type { ReactElement } from "react";

interface TooltipProps {
  title?: string;
  children: ReactElement;
}

export function Tooltip({ title, children }: TooltipProps) {
  return title ? <MuiTooltip title={title}>{children}</MuiTooltip> : children;
}
