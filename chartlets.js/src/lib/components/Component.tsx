import { type ComponentState } from "@/lib/types/state/component";
import { type ComponentChangeHandler } from "@/lib/types/state/event";
import { Button, type ButtonProps } from "./Button";
import { Box, type BoxProps } from "./Box";
import { Checkbox, type CheckboxProps } from "./Checkbox";
import { Select, type SelectProps } from "./Select";
import { Plot, type PlotProps } from "./Plot";
import { Typography, type TypographyProps } from "@/lib/components/Typography";
import {
  CircularProgress,
  type CircularProgressProps,
} from "./CircularProgress";

export interface ComponentProps extends ComponentState {
  onChange: ComponentChangeHandler;
}

export function Component({ type, ...props }: ComponentProps) {
  // TODO: allow for registering children via their types
  //   and make following code generic.
  //
  // const DashiComp = Registry.getComponent(link);
  // return return <DashiComp {...props} />;
  //
  if (type === "Plot") {
    return <Plot {...(props as PlotProps)} />;
  } else if (type === "Select") {
    return <Select {...(props as SelectProps)} />;
  } else if (type === "Button") {
    return <Button {...(props as ButtonProps)} />;
  } else if (type === "Box") {
    return <Box {...(props as BoxProps)} />;
  } else if (type === "Checkbox") {
    return <Checkbox {...(props as CheckboxProps)} />;
  } else if (type === "CircularProgress") {
    return <CircularProgress {...(props as CircularProgressProps)} />;
  } else if (type === "Typography") {
    return <Typography {...(props as TypographyProps)} />;
  } else {
    console.error(`Cannot render unknown component type ${type}`);
  }
}
