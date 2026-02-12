/*
 * Copyright (c) 2019-2026 by Brockmann Consult Development team
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import type {
  ContribPoint,
  Contributions,
  Extension,
} from "@/types/model/extension";
import type { ContributionState } from "@/types/state/contribution";
import type { ApiResult } from "@/types/api";
import type { FrameworkOptions } from "./options";

export type ThemeMode = "dark" | "light" | "system";

// TODO: Split contributionsRecord into two fields comprising static
//  contribution data and dynamic contribution states.
//  This will allow memoizing the computation of property references
//  (PropertyRef[]) on the level of the StoreState from static data only.
//  The property references would then be just computed once.
//  See function getPropertyRefsForContribPoints()
//  in actions/handleHostStoreChange.ts

/**
 * The state of the Chartlets main store.
 */
export interface StoreState {
  /**
   * Framework configuration.
   */
  configuration: FrameworkOptions;
  /**
   * All extensions.
   */
  extensions: Extension[];
  /**
   * API call result from `GET /contributions`.
   */
  contributionsResult: ApiResult<Contributions>;
  /**
   * A record that maps contribPoint --> ContributionState[].
   */
  contributionsRecord: Record<ContribPoint, ContributionState[]>;
  /**
   * The app's current theme mode.
   * Taken from the host stores `themeMode` property.
   * Used to allow components and charts to react to theme mode changes.
   * See hook `useThemeMode()`.
   */
  themeMode?: ThemeMode;
  /**
   * Store last input values for callback requests to avoid invoking them if
   * there are no  state changes
   */
  lastCallbackInputValues: Record<string, unknown[]>;
}
