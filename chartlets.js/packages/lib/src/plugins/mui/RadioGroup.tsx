/*
 * Copyright (c) 2019-2026 by Brockmann Consult Development team
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { type ChangeEvent } from "react";
import MuiRadio from "@mui/material/Radio";
import MuiRadioGroup from "@mui/material/RadioGroup";
import MuiFormControl from "@mui/material/FormControl";
import MuiFormControlLabel from "@mui/material/FormControlLabel";
import MuiFormLabel from "@mui/material/FormLabel";
import { Tooltip } from "./Tooltip";

import type { ComponentProps, ComponentState } from "@/index";

interface RadioState extends ComponentState {
  type: "Radio";
  value?: boolean | number | string | undefined;
  label?: string;
  size?: "medium" | "small" | string;
}

interface RadioGroupState extends ComponentState {
  children?: RadioState[];
  label?: string;
  row?: boolean;
  dense?: boolean;
  tooltip?: string;
}

interface RadioGroupProps extends ComponentProps, RadioGroupState {}

export function RadioGroup({
  type,
  id,
  name,
  value,
  disabled,
  style,
  label,
  row,
  tooltip,
  dense,
  children: radioButtons,
  onChange,
}: RadioGroupProps) {
  const handleChange = (
    _event: ChangeEvent<HTMLInputElement>,
    value: string,
  ) => {
    if (id) {
      return onChange({
        componentType: type,
        id: id,
        property: "value",
        value,
      });
    }
  };
  return (
    <Tooltip title={tooltip}>
      <MuiFormControl disabled={disabled}>
        <MuiFormLabel>{label}</MuiFormLabel>
        <MuiRadioGroup
          id={id}
          name={name}
          row={row}
          value={value}
          style={style}
          onChange={handleChange}
        >
          {radioButtons &&
            radioButtons.map((radioButton) => (
              <MuiFormControlLabel
                value={radioButton.value}
                label={radioButton.label}
                disabled={radioButton.disabled}
                control={
                  <MuiRadio
                    id={radioButton.id}
                    size={dense ? "small" : "medium"}
                  />
                }
              />
            ))}
        </MuiRadioGroup>
      </MuiFormControl>
    </Tooltip>
  );
}
