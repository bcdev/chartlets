/*
 * Copyright (c) 2019-2026 by Brockmann Consult Development team
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

export interface ApiOptions {
  serverUrl?: string;
  endpointName?: string;
}

export interface ApiResult<T> {
  status?: "pending" | "ok" | "failed" | undefined;
  data?: T;
  error?: ApiError;
}

export type ApiError = {
  message: string;
  status?: number;
  traceback?: string[];
};
