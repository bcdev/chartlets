import { type MouseEvent } from "react";
import MuiButton from "@mui/material/Button";

import type { ComponentProps, ComponentState } from "@/index";
import { Tooltip } from "./Tooltip";
import { Icon } from "./Icon";

interface ButtonState extends ComponentState {
  text?: string;
  startIcon?: string;
  endIcon?: string;
  variant?: "contained" | "outlined" | "text";
  color?:
    | "inherit"
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "info"
    | "warning";
}

export interface ButtonProps extends ComponentProps, ButtonState {}

export function Button({
  type,
  id,
  name,
  style,
  variant,
  color,
  disabled,
  text,
  startIcon,
  endIcon,
  tooltip,
  onChange,
}: ButtonProps) {
  const handleClick = (_event: MouseEvent<HTMLButtonElement>) => {
    if (id) {
      onChange({
        componentType: type,
        id: id,
        property: "clicked",
        value: true,
      });
    }
  };
  return (
    <Tooltip title={tooltip}>
      <MuiButton
        id={id}
        name={name}
        style={style}
        variant={variant}
        color={color}
        disabled={disabled}
        startIcon={startIcon && <Icon iconName={startIcon}></Icon>}
        endIcon={endIcon && <Icon iconName={endIcon}></Icon>}
        onClick={handleClick}
      >
        {text}
      </MuiButton>
    </Tooltip>
  );
}
