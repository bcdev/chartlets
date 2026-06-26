/*
 * Copyright (c) 2019-2026 by Brockmann Consult Development team
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { store } from "@/store";
import type { CallbackRequest } from "@/types/model/callback";
import { fetchCallback } from "@/api/fetchCallback";
import { applyStateChangeRequests } from "@/actions/helpers/applyStateChangeRequests";
import {
  getPendingProgressTargets,
  releasePendingProgressTargets,
  showPendingProgressTargets,
} from "@/actions/helpers/pendingProgress";

export function invokeCallbacks(callbackRequests: CallbackRequest[]) {
  const { configuration } = store.getState();
  const shouldLog = configuration.logging?.enabled;
  const invocationId = getInvocationId();
  const pendingProgressTargets = getPendingProgressTargets(callbackRequests);
  showPendingProgressTargets(pendingProgressTargets);
  if (shouldLog) {
    console.info(
      `chartlets: invokeCallbacks (${invocationId})-->`,
      callbackRequests,
    );
  }
  fetchCallback(callbackRequests, configuration.api).then(
    (changeRequestsResult) => {
      if (changeRequestsResult.data) {
        if (shouldLog) {
          console.info(
            `chartlets: invokeCallbacks <--(${invocationId})`,
            changeRequestsResult.data,
          );
        }
        applyStateChangeRequests(changeRequestsResult.data);
        releasePendingProgressTargets(pendingProgressTargets, true);
      } else {
        console.error(
          "callback failed:",
          changeRequestsResult.error,
          "for call requests:",
          callbackRequests,
        );
        releasePendingProgressTargets(pendingProgressTargets, false);
      }
    },
  );
}

let invocationCounter = 0;

function getInvocationId() {
  return invocationCounter++;
}