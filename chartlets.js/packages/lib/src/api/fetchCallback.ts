/*
 * Copyright (c) 2019-2026 by Brockmann Consult Development team
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import {
  type CallbackRequest,
  type StateChangeRequest,
} from "@/types/model/callback";
import type { ApiOptions, ApiResult } from "@/types/api";
import { makeUrl, callApi, fetchApiResult } from "./helpers";

export async function fetchCallback(
  callbackRequests: CallbackRequest[],
  options?: ApiOptions,
): Promise<ApiResult<StateChangeRequest[]>> {
  return fetchApiResult(_fetchCallback, callbackRequests, options);
}

async function _fetchCallback(
  callbackRequests: CallbackRequest[],
  options?: ApiOptions,
): Promise<StateChangeRequest[]> {
  return callApi(makeUrl("callback", options), {
    body: JSON.stringify({ callbackRequests }),
    method: "post",
  });
}
