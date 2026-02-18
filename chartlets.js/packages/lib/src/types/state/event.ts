/*
 * Copyright (c) 2019-2026 by Brockmann Consult Development team
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import type { ObjPathLike } from "@/utils/objPath";

export interface ComponentChangeEvent {
  componentType: string;
  // See commonality with StateChange
  id: string;
  property: ObjPathLike;
  value: unknown;
}

export type ComponentChangeHandler = (event: ComponentChangeEvent) => void;
