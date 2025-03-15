import memoize from "micro-memoize";

import type {
  Callback,
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
import type { ContribPoint } from "@/types/model/extension";

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
  const propertyRefs = getHostStorePropertyRefs(contributionsRecord);
  if (!propertyRefs || propertyRefs.length === 0) {
    // Exit if there are is nothing to be changed
    return;
  }
  const callbackRequests = getCallbackRequests(
    propertyRefs,
    contributionsRecord,
    hostStore,
  );
  if (callbackRequests && callbackRequests.length > 0) {
    invokeCallbacks(callbackRequests);
  }
}

function getCallbackRequests(
  propertyRefs: PropertyRef[],
  contributionsRecord: Record<string, ContributionState[]>,
  hostStore: HostStore,
): CallbackRequest[] {
  return propertyRefs.map((propertyRef) => {
    const contributions = contributionsRecord[propertyRef.contribPoint];
    const contribution = contributions[propertyRef.contribIndex];
    const callback = contribution.callbacks![propertyRef.callbackIndex];
    const inputValues = getInputValues(
      callback.inputs!,
      contribution,
      hostStore,
    );
    return { ...propertyRef, inputValues };
  });
}

/**
 * Get the static list of host state property references for all contributions.
 */
const getHostStorePropertyRefs = memoize(_getHostStorePropertyRefs);

function getCallbackfn(
  contribPoint: string,
  contribution: ContributionState,
  contribIndex: number,
) {
  const propertyRefs: PropertyRef[] = [];
  const callbacks: Callback[] = contribution.callbacks || [];
  callbacks.forEach((callback, callbackIndex) => {
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

function _getHostStorePropertyRefs(
  contributionsRecord: Record<ContribPoint, ContributionState[]>,
): PropertyRef[] {
  const propertyRefs: PropertyRef[] = [];
  Object.getOwnPropertyNames(contributionsRecord).forEach((contribPoint) => {
    const contributions = contributionsRecord[contribPoint];
    contributions.forEach(getCallbackfn(propertyRefs, contribPoint));
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
