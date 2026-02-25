/*
 * Copyright (c) 2019-2026 by Brockmann Consult Development team
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import type { Plugin } from "@/index";
import { Accordion } from "./Accordion";
import { Box } from "./Box";
import { Button } from "./Button";
import { Checkbox } from "./Checkbox";
import { CircularProgress } from "./CircularProgress";
import { Divider } from "./Divider";
import { IconButton } from "./IconButton";
import { LinearProgress } from "./LinearProgress";
import { RadioGroup } from "./RadioGroup";
import { Select } from "./Select";
import { Switch } from "./Switch";
import { Tabs } from "./Tabs";
import { Typography } from "./Typography";
import { Slider } from "./Slider";
import { DataGrid } from "@/plugins/mui/DataGrid";
import { Dialog } from "@/plugins/mui/Dialog";
import { Table } from "@/plugins/mui/Table";

export default function mui(): Plugin {
  return {
    components: [
      ["Accordion", Accordion],
      ["Box", Box],
      ["Button", Button],
      ["Checkbox", Checkbox],
      ["CircularProgress", CircularProgress],
      ["DataGrid", DataGrid],
      ["Dialog", Dialog],
      ["Divider", Divider],
      ["IconButton", IconButton],
      ["LinearProgress", LinearProgress],
      ["RadioGroup", RadioGroup],
      ["Select", Select],
      ["Slider", Slider],
      ["Switch", Switch],
      ["Table", Table],
      ["Tabs", Tabs],
      ["Typography", Typography],
    ],
  };
}
