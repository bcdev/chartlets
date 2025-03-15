import type {
  CallbackRef,
  CallbackRequest,
  ContribRef,
  InputRef,
} from "@/types/model/callback";
import type { Input } from "@/types/model/channel";
import { getInputValues } from "@/actions/helpers/getInputValues";
import { formatObjPath } from "@/utils/objPath";
import { invokeCallbacks } from "@/actions/helpers/invokeCallbacks";
import type { ContributionState } from "@/types/state/contribution";
import type { HostStore } from "@/types/state/host";
import { store } from "@/store";
import { shallowEqualArrays } from "@/utils/compare";

/**
 * A reference to a property of an input of a callback of a contribution.
 */
export interface PropertyRef extends ContribRef, CallbackRef, InputRef {
  /** The property. */
  property: string;
}

export function handleHostStoreChange() {
  const { extensions, configuration, contributionsRecord } = store.getState();
  const { hostStore } = configuration;
  if (!hostStore) {
    // Exit if no host store configured.
    // Actually, we should not come here.
    return;
  }
  synchronizeThemeMode(hostStore);
  if (extensions.length === 0) {
    // Exit if there are no extensions (yet)
    return;
  }
  const propertyRefs = getHostStorePropertyRefs();
  if (!propertyRefs || propertyRefs.length === 0) {
    // Exit if there are is nothing to be changed
    return;
  }
  const callbackRequests = getCallbackRequests(
    propertyRefs,
    contributionsRecord,
    hostStore,
  );

  const filteredCallbackRequests = callbackRequests.filter(
    (callbackRequest): callbackRequest is CallbackRequest =>
      callbackRequest !== undefined,
  );
  if (filteredCallbackRequests && filteredCallbackRequests.length > 0) {
    invokeCallbacks(filteredCallbackRequests);
  }
}

// Exporting for testing only
export function getCallbackRequests(
  propertyRefs: PropertyRef[],
  contributionsRecord: Record<string, ContributionState[]>,
  hostStore: HostStore,
): (CallbackRequest | undefined)[] {
  const { lastCallbackInputValues } = store.getState();
  return propertyRefs.map((propertyRef) =>
    getCallbackRequest(
      propertyRef,
      lastCallbackInputValues,
      contributionsRecord,
      hostStore,
    ),
  );
}

const getCallbackRequest = (
  propertyRef: PropertyRef,
  lastCallbackInputValues: Record<string, unknown[]>,
  contributionsRecord: Record<string, ContributionState[]>,
  hostStore: HostStore,
) => {
  const contribPoint: string = propertyRef.contribPoint;
  const contribIndex: number = propertyRef.contribIndex;
  const callbackIndex: number = propertyRef.callbackIndex;
  const contributions = contributionsRecord[contribPoint];
  const contribution = contributions[contribIndex];
  const callback = contribution.callbacks![callbackIndex];
  const inputValues = getInputValues(callback.inputs!, contribution, hostStore);
  const callbackId = `${contribPoint}-${contribIndex}-${callbackIndex}`;
  const lastInputValues = lastCallbackInputValues[callbackId];
  if (shallowEqualArrays(lastInputValues, inputValues)) {
    // We no longer log, as the situation is quite common
    // Enable error logging for debugging only:
    // console.groupCollapsed("Skipping callback request");
    // console.debug("inputValues", inputValues);
    // console.groupEnd();
    return undefined;
  }
  store.setState({
    lastCallbackInputValues: {
      ...lastCallbackInputValues,
      [callbackId]: inputValues,
    },
  });
  return { ...propertyRef, inputValues };
};

// TODO: use a memoized selector to get hostStorePropertyRefs
// Note that this will only be effective and once we split the
// static contribution infos and dynamic contribution states.
// The hostStorePropertyRefs only depend on the static
// contribution infos.

/**
 * Get the static list of host state property references for all contributions.
 */
function getHostStorePropertyRefs(): PropertyRef[] {
  const { contributionsRecord } = store.getState();
  const propertyRefs: PropertyRef[] = [];
  Object.getOwnPropertyNames(contributionsRecord).forEach((contribPoint) => {
    const contributions = contributionsRecord[contribPoint];
    contributions.forEach((contribution, contribIndex) => {
      (contribution.callbacks || []).forEach(
        (callback, callbackIndex) =>
          (callback.inputs || []).forEach((input, inputIndex) => {
            if (!input.noTrigger && input.id === "@app" && input.property) {
              propertyRefs.push({
                contribPoint,
                contribIndex,
                callbackIndex,
                inputIndex,
                property: formatObjPath(input.property),
              });
            }
          }),
        [] as Input[],
      );
    });
  });
  return propertyRefs;
}

function synchronizeThemeMode(hostStore: HostStore) {
  const newThemeMode = hostStore.get("themeMode");
  const oldThemeMode = store.getState().themeMode;
  if (
    (newThemeMode === "dark" ||
      newThemeMode === "light" ||
      newThemeMode === "system") &&
    newThemeMode !== oldThemeMode
  ) {
    store.setState({ themeMode: newThemeMode });
  }
}
