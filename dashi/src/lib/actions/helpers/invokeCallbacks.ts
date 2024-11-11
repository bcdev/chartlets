import { store } from "@/lib/store";
import type { CallbackRequest } from "@/lib/types/model/callback";
import { fetchApiResult } from "@/lib/utils/fetchApiResult";
import { fetchStateChangeRequests } from "@/lib/api/fetchStateChangeRequests";
import { applyStateChangeRequests } from "@/lib/actions/helpers/applyStateChangeRequests";

export function invokeCallbacks(callbackRequests: CallbackRequest[]) {
  const { configuration } = store.getState();
  const invocationId = getInvocationId();
  if (import.meta.env.DEV) {
    console.debug(`invokeCallbacks (${invocationId})-->`, callbackRequests);
  }
  if (callbackRequests.length) {
    fetchApiResult(
      fetchStateChangeRequests,
      callbackRequests,
      configuration.api,
    ).then((changeRequestsResult) => {
      if (changeRequestsResult.data) {
        if (import.meta.env.DEV) {
          console.debug(
            `invokeCallbacks <--(${invocationId})`,
            changeRequestsResult.data,
          );
        }
        applyStateChangeRequests(changeRequestsResult.data);
      } else {
        console.error(
          "callback failed:",
          changeRequestsResult.error,
          "for call requests:",
          callbackRequests,
        );
      }
    });
  }
}

let invocationCounter = 0;

function getInvocationId() {
  return invocationCounter++;
}
