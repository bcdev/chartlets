import MuiBox from "@mui/material/Box";
import MuiIcon from "@mui/material/Icon";
import MuiTabs from "@mui/material/Tabs";
import MuiTab from "@mui/material/Tab";

import type { ComponentProps, ComponentState } from "@/index";
import type { SyntheticEvent } from "react";
import { Box } from "@/plugins/mui/Box";
import { isString } from "@/utils/isString";
import { isComponentState } from "@/types/state/component";

interface TabState {
  type: "Tab";
  label?: string;
  icon?: string;
  disabled?: boolean;
  children?: ComponentProps[];
}

interface TabsState extends ComponentState {
  value?: number;
  children?: (string | TabState)[];
}

interface TabsProps extends ComponentProps, TabsState {}

export function Tabs({
  type,
  id,
  value,
  children: tabItems,
  disabled,
  style,
  onChange,
}: TabsProps) {
  const handleChange = (_event: SyntheticEvent, value: number) => {
    if (id) {
      onChange({
        componentType: type,
        id: id,
        property: "value",
        value: value,
      });
    }
  };
  return (
    <MuiBox sx={{ width: "100%" }}>
      <MuiBox sx={{ borderBottom: 1, borderColor: "divider" }}>
        <MuiTabs id={id} style={style} value={value} onChange={handleChange}>
          {tabItems?.map((tab, index) => {
            const tabState = isComponentState(tab)
              ? (tab as TabState)
              : undefined;
            return (
              <MuiTab
                key={index}
                label={tabState ? tabState.label : isString(tab) ? tab : ""}
                icon={
                  tabState &&
                  tabState.icon && <MuiIcon>{tabState.icon}</MuiIcon>
                }
                disabled={disabled || (tabState && tabState.disabled)}
              />
            );
          })}
        </MuiTabs>
      </MuiBox>
      {tabItems?.map((tab, index) => {
        const tabState = isComponentState(tab) ? (tab as TabState) : undefined;
        return (
          value === index && (
            <Box
              key={index}
              type={type}
              onChange={onChange}
              children={tabState?.children ?? undefined}
            />
          )
        );
      })}
    </MuiBox>
  );
}
