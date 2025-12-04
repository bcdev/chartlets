import { store } from "@/store";
import type { CallbackRequest } from "@/types/model/callback";
import { fetchCallback } from "@/api/fetchCallback";
import { applyStateChangeRequests } from "@/actions/helpers/applyStateChangeRequests";

export function invokeCallbacks(callbackRequests: CallbackRequest[]) {
  const { configuration, loadingState } = store.getState();
  const shouldLog = configuration.logging?.enabled;
  const invocationId = getInvocationId();
  if (shouldLog) {
    console.info(
      `chartlets: invokeCallbacks (${invocationId})-->`,
      callbackRequests,
    );
  }

  // Set the respective callback's outputs loading state to true before
  // sending the request
  callbackRequests.forEach((callbackRequest) => {
    const outputIds = callbackRequest.outputIds;
    outputIds.forEach((outputId) => {
      store.setState({
        loadingState: {
          ...loadingState,
          [outputId]: true,
        },
      });
    });
  });
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
        // Set the loading state of each output ID of the callback's that
        // were invoked to false as the fetch was successful.
        callbackRequests.forEach((callbackRequest) => {
          const outputIds = callbackRequest.outputIds;
          outputIds.forEach((outputId) => {
            store.setState({
              loadingState: {
                ...loadingState,
                [outputId]: false,
              },
            });
          });
        });
      } else {
        console.error(
          "callback failed:",
          changeRequestsResult.error,
          "for call requests:",
          callbackRequests,
        );
        // Set the loading state of each output ID of the callback's that
        // were invoked to `failed` as the fetch was unsuccessful.
        callbackRequests.forEach((callbackRequest) => {
          const outputIds = callbackRequest.outputIds;
          outputIds.forEach((outputId) => {
            store.setState({
              loadingState: {
                ...loadingState,
                [outputId]: "failed",
              },
            });
          });
        });
      }
    },
  );
}

let invocationCounter = 0;

function getInvocationId() {
  return invocationCounter++;
}
