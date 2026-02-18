/*
 * Copyright (c) 2019-2026 by Brockmann Consult Development team
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import MuiLinearProgress from "@mui/material/LinearProgress";

import type { ComponentState, ComponentProps } from "@/index";

interface LinearProgressState extends ComponentState {
  value?: number;
  valueBuffer?: number;
  variant?: "determinate" | "indeterminate" | "buffer" | "query";
}

interface LinearProgressProps extends ComponentProps, LinearProgressState {}

export const LinearProgress = ({
  id,
  style,
  value,
  variant,
}: LinearProgressProps) => {
  return (
    <MuiLinearProgress id={id} style={style} value={value} variant={variant} />
  );
};
