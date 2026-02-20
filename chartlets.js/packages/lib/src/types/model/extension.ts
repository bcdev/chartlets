/*
 * Copyright (c) 2019-2026 by Brockmann Consult Development team
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { type Contribution } from "./contribution";

export type ContribPoint = string;

export interface Contributions {
  extensions: Extension[];
  contributions: Record<ContribPoint, Contribution[]>;
}

export interface Extension {
  name: string;
  version: string;
  contributes: ContribPoint[];
}
