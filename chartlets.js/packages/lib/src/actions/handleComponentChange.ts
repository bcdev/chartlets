import { store } from "@/store";
import { type ContribPoint } from "@/types/model/extension";
import { type CallbackRequest } from "@/types/model/callback";
import { type ComponentChangeEvent } from "@/types/state/event";
import { getInputValues } from "@/actions/helpers/getInputValues";
import { applyStateChangeRequests } from "@/actions/helpers/applyStateChangeRequests";
import { invokeCallbacks } from "@/actions/helpers/invokeCallbacks";
import { equalObjPaths } from "@/utils/objPath";

export function handleComponentChange(
  contribPoint: ContribPoint,
  contribIndex: number,
  changeEvent: ComponentChangeEvent,
) {
  if (store.getState().extensions.length === 0) {
    // Exit immediately if there are no extensions (yet)
    return;
  }
  // Apply actual component state change immediately
  applyStateChangeRequests([
    {
      contribPoint,
      contribIndex,
      stateChanges: [
        {
          id: changeEvent.id,
          property: changeEvent.property,
          value: changeEvent.value,
        },
      ],
    },
  ]);
  const callbackRequests = getCallbackRequests(
    contribPoint,
    contribIndex,
    changeEvent,
  );
  if (callbackRequests && callbackRequests.length > 0) {
    invokeCallbacks(callbackRequests);
  }
}

/**
 * Collect callback requests for the callbacks of
 * the contribution that are triggered by the change event.
 *
 * @param contribPoint Name of the contribution point.
 * @param contribIndex Index of the contribution.
 * @param changeEvent The change event.
 */
function getCallbackRequests(
  contribPoint: ContribPoint,
  contribIndex: number,
  changeEvent: ComponentChangeEvent,
): CallbackRequest[] {
  const { configuration, contributionsRecord } = store.getState();
  const { hostStore } = configuration;
  const contributions = contributionsRecord[contribPoint];
  const contribution = contributions[contribIndex];
  const callbackRequests: CallbackRequest[] = [];
  (contribution.callbacks || []).forEach((callback, callbackIndex) => {
    if (callback.inputs && callback.inputs.length) {
      const inputs = callback.inputs;
      const inputIndex = inputs.findIndex(
        (input) =>
          !input.noTrigger &&
          input.id &&
          !input.id.startsWith("@") &&
          input.id === changeEvent.id &&
          equalObjPaths(input.property, changeEvent.property),
      );
      if (inputIndex >= 0) {
        // Collect triggered callback
        callbackRequests.push({
          contribPoint,
          contribIndex,
          callbackIndex,
          inputIndex,
          inputValues: getInputValues(inputs, contribution, hostStore),
        });
      }
    }
  });
  return callbackRequests;
}
