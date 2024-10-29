import type {
  ContribPoint,
  Contributions,
  Extension,
} from "@/lib/types/model/extension";
import type { ApiResult } from "@/lib/utils/fetchApiResult";
import type { ContributionState } from "@/lib/types/state/contribution";
import type { ApiOptions } from "@/lib/api";
import type { LoggingOptions } from "@/lib/utils/configureLogging";
import type { StoreApi } from "zustand";

export interface FrameworkOptions<S> {
  /** The host applications state management store. */
  hostStore?: StoreApi<S>;
  /** API options to configure backend. */
  api?: ApiOptions;
  /** Logging options. */
  logging?: LoggingOptions;
}

export interface StoreState<S = unknown> {
  /** Framework configuration */
  configuration: FrameworkOptions<S>;
  /** API call result from `GET /contributions`. */
  contributionsResult: ApiResult<Contributions>;
  /** All extensions */
  extensions: Extension[];
  /** A record that maps contribPoint --> ContributionState[].*/
  contributionStatesRecord: Record<ContribPoint, ContributionState[]>;
}
