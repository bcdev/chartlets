/*
 * Copyright (c) 2019-2026 by Brockmann Consult Development team
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import MuiTypography from "@mui/material/Typography";
import { type TypographyVariant } from "@mui/material";

import type { ComponentState, ComponentProps } from "@/index";
import { Children } from "@/index";

interface TypographyState extends ComponentState {
  align?: "right" | "left" | "center" | "inherit" | "justify";
  gutterBottom?: boolean;
  noWrap?: boolean;
  variant?: TypographyVariant;
  text?: string;
  color?: string;
}

interface TypographyProps extends ComponentProps, TypographyState {}

export const Typography = ({
  id,
  style,
  align,
  gutterBottom,
  noWrap,
  variant,
  text,
  color,
  children: nodes,
  onChange,
}: TypographyProps) => {
  nodes = text ? [text] : nodes;

  return (
    <MuiTypography
      id={id}
      style={style}
      align={align}
      gutterBottom={gutterBottom}
      noWrap={noWrap}
      variant={variant}
      color={color}
    >
      <Children nodes={nodes} onChange={onChange} />
    </MuiTypography>
  );
};
