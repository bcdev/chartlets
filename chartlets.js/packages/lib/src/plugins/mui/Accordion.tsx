/*
 * Copyright (c) 2019-2026 by Brockmann Consult Development team
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiTypography from "@mui/material/Typography";

import type { ComponentState, ComponentProps } from "@/index";
import { Children } from "@/index";
import { Icon } from "./Icon";
import type { SyntheticEvent } from "react";

interface AccordionState extends ComponentState {
  label?: string;
  icon?: string;
  expanded?: boolean;
  disabled?: boolean;
}

interface AccordionProps extends ComponentProps, AccordionState {}

export const Accordion = ({
  id,
  style,
  label,
  icon,
  expanded,
  disabled,
  children: nodes,
  onChange,
}: AccordionProps) => {
  const handleChange = (_event: SyntheticEvent, isExpanded: boolean) => {
    if (id) {
      onChange?.({
        componentType: "Accordion",
        id,
        property: "expanded",
        value: isExpanded,
      });
    }
  };
  return (
    <div>
      <MuiAccordion
        id={id}
        style={style}
        expanded={expanded}
        disabled={disabled}
        onChange={handleChange}
      >
        <MuiAccordionSummary
          expandIcon={icon ? <Icon iconName={icon} /> : undefined}
        >
          {label ? (
            <MuiTypography component="span">{label}</MuiTypography>
          ) : null}
        </MuiAccordionSummary>

        {nodes && (
          <MuiAccordionDetails>
            <Children nodes={nodes} onChange={onChange} />
          </MuiAccordionDetails>
        )}
      </MuiAccordion>
    </div>
  );
};
