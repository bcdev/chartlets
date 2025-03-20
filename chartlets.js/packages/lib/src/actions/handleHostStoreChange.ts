import memoize from "micro-memoize";

import type {
  Callback,
  CallbackRef,
  CallbackRequest,
  ContribRef,
  InputRef,
} from "@/types/model/callback";
import { getInputValues } from "@/actions/helpers/getInputValues";
import { formatObjPath } from "@/utils/objPath";
import { invokeCallbacks } from "@/actions/helpers/invokeCallbacks";
import type { ContributionState } from "@/types/state/contribution";
import type { HostStore } from "@/types/state/host";
import { store } from "@/store";
import { shallowEqualArrays } from "@/utils/shallowEqualArrays";
import type { ContribPoint } from "@/types/model/extension";

/**
 * A reference to a property of an input of a callback of a contribution.
 */
export interface PropertyRef extends ContribRef, CallbackRef, InputRef {
  /** The property. */
  property: string;
}

/**
 * This action is called once a host store change has been detected.
 * Note this will only create callback requests for callbacks whose input
 * value are affected by the change.
 *
 * @returns The array of callback requests made or `undefined`,
 *   if no callback requests have been made.
 */
export function handleHostStoreChange(): CallbackRequest[] | undefined {
  const { extensions, configuration, contributionsRecord } = store.getState();
  const { hostStore } = configuration;
  if (!hostStore) {
    // Exit if no host store configured.
    // Actually, we should not come here.
    return undefined;
  }
  synchronizeThemeMode(hostStore);
  if (extensions.length === 0) {
    // Exit if there are no extensions (yet)
    return undefined;
  }
  const propertyRefs = getPropertyRefsForContribPoints(contributionsRecord);
  if (!propertyRefs || propertyRefs.length === 0) {
    // Exit if there are is nothing to be changed
    return undefined;
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
  if (!filteredCallbackRequests || !filteredCallbackRequests.length) {
    return undefined;
  }

  invokeCallbacks(filteredCallbackRequests);
  return filteredCallbackRequests;
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

/**
 * Get the static list of host state property references
 * for given contribution points.
 * Note: the export exists only for testing.
 */
export const getPropertyRefsForContribPoints = memoize(
  _getPropertyRefsForContribPoints,
);

function _getPropertyRefsForContribPoints(
  contributionsRecord: Record<ContribPoint, ContributionState[]>,
): PropertyRef[] {
  const propertyRefs: PropertyRef[] = [];
  Object.getOwnPropertyNames(contributionsRecord).forEach((contribPoint) => {
    const contributions = contributionsRecord[contribPoint];
    propertyRefs.push(
      ...getPropertyRefsForContributions(contribPoint, contributions),
    );
  });
  return propertyRefs;
}

/**
 * Get the static list of host state property references
 * for given contributions.
 */
const getPropertyRefsForContributions = memoize(
  _getPropertyRefsForContributions,
);

function _getPropertyRefsForContributions(
  contribPoint: string,
  contributions: ContributionState[],
): PropertyRef[] {
  const propertyRefs: PropertyRef[] = [];
  contributions.forEach((contribution, contribIndex) => {
    propertyRefs.push(
      ...getPropertyRefsForCallbacks(
        contribPoint,
        contribIndex,
        contribution.callbacks,
      ),
    );
  });
  return propertyRefs;
}

/**
 * Get the static list of host state property references
 * for given callbacks.
 */
const getPropertyRefsForCallbacks = memoize(_getPropertyRefsForCallbacks);

function _getPropertyRefsForCallbacks(
  contribPoint: string,
  contribIndex: number,
  callbacks: Callback[] | undefined,
) {
  const propertyRefs: PropertyRef[] = [];
  (callbacks || []).forEach((callback, callbackIndex) => {
    const inputs = callback.inputs || [];
    inputs.forEach((input, inputIndex) => {
      if (!input.noTrigger && input.id === "@app" && input.property) {
        propertyRefs.push({
          contribPoint,
          contribIndex,
          callbackIndex,
          inputIndex,
          property: formatObjPath(input.property),
        });
      }
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
