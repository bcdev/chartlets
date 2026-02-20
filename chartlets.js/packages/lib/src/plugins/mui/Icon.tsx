/*
 * Copyright (c) 2019-2026 by Brockmann Consult Development team
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import MuiIcon from "@mui/material/Icon";

interface IconProps {
  iconName?: string;
}

export const Icon = ({ iconName }: IconProps) => {
  if (!iconName) return null;

  return (
    <MuiIcon
      sx={{
        fontFamily: "Material Icons",
        textTransform: "none",
        lineHeight: 1,
      }}
    >
      {iconName}
    </MuiIcon>
  );
};
