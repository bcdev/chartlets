/*
 * Copyright (c) 2019-2026 by Brockmann Consult Development team
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { create } from "zustand";

import { type StoreState } from "@/types/state/store";

export const store = create<StoreState>(() => ({
  configuration: {},
  extensions: [],
  contributionsResult: {},
  contributionsRecord: {},
  lastCallbackInputValues: {},
}));
