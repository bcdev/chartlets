import type { Plugin } from "@/index";
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
// import { DataGrid } from "@/plugins/mui/DataGrid";
import { Dialog } from "@/plugins/mui/Dialog";
import { Table } from "@/plugins/mui/Table";

export default function mui(): Plugin {
  return {
    components: [
      ["Box", Box],
      ["Button", Button],
      ["Checkbox", Checkbox],
      ["CircularProgress", CircularProgress],
      // Commenting out DataGrid as @mui/x-data-grid is quite large. It will
      // now be used as a plugin if needed by the user from v0.1.5.
      // ["DataGrid", DataGrid],
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
