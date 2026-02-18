/*
 * Copyright (c) 2019-2026 by Brockmann Consult Development team
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import type { ElementType } from "react";
import MuiBox from "@mui/material/Box";

import type { ComponentState, ComponentProps } from "@/index";
import { Children } from "@/index";

interface BoxState extends ComponentState {
  component?: ElementType<Element>;
}

interface BoxProps extends ComponentProps, BoxState {}

export const Box = ({
  id,
  style,
  color,
  component,
  children: nodes,
  onChange,
}: BoxProps) => {
  return (
    <MuiBox id={id} style={style} color={color} component={component || "div"}>
      <Children nodes={nodes} onChange={onChange} />
    </MuiBox>
  );
};
