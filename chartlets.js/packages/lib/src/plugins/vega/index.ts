/*
 * Copyright (c) 2019-2026 by Brockmann Consult Development team
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import type { Plugin } from "@/index";
import { VegaChart } from "./VegaChart";

export default function vega(): Plugin {
  return { components: [["VegaChart", VegaChart]] };
}
