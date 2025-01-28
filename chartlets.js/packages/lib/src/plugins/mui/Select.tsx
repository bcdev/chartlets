import MuiFormControl from "@mui/material/FormControl";
import MuiInputLabel from "@mui/material/InputLabel";
import MuiMenuItem from "@mui/material/MenuItem";
import MuiSelect, { type SelectChangeEvent } from "@mui/material/Select";

import type { ComponentState, ComponentProps } from "@/index";
import { isString } from "@/utils/isString";
import { Tooltip } from "./Tooltip";

export type SelectOption =
  | string
  | number
  | [string, string]
  | [number, string]
  | { value: string | number; label?: string };

interface SelectState extends ComponentState {
  options?: SelectOption[];
  multiple?: boolean
}

interface SelectProps extends ComponentProps, SelectState {}

export function Select({
  type,
  id,
  name,
  value,
  options,
  disabled,
  style,
  tooltip,
  label,
  multiple,
  onChange,
}: SelectProps) {
  const handleChange = (event: SelectChangeEvent) => {
    if (id) {
      let newValue: string | number = event.target.value;
      if (typeof value == "number") {
        newValue = Number.parseInt(newValue);
      }
      onChange({
        componentType: type,
        id: id,
        property: "value",
        value: newValue,
      });
    }
  };
  return (
    <Tooltip title={tooltip}>
      <MuiFormControl variant="filled" size="small" style={style}>
        {label && <MuiInputLabel id={`${id}-label`}>{label}</MuiInputLabel>}
        <MuiSelect
          labelId={`${id}-label`}
          id={id}
          name={name}
          value={`${value}`}
          disabled={disabled}
          multiple={multiple}
          onChange={handleChange}
        >
          {Array.isArray(options) &&
            options.map(normalizeSelectOption).map(([value, text], index) => (
              <MuiMenuItem key={index} value={value}>
                {text}
              </MuiMenuItem>
            ))}
        </MuiSelect>
      </MuiFormControl>
    </Tooltip>
  );
}

function normalizeSelectOption(
  option: SelectOption,
): [string | number, string] {
  if (isString(option)) {
    return [option, option];
  } else if (typeof option === "number") {
    return [option, option.toString()];
  } else if (Array.isArray(option)) {
    return option;
  } else {
    return [option.value, option.label || `${option.value}`];
  }
}
