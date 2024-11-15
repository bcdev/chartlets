import { store } from "@/lib/store";
import type {
  CallbackRef,
  CallbackRequest,
  ContribRef,
  InputRef,
} from "@/lib/types/model/callback";
import type { Input } from "@/lib/types/model/channel";
import { getInputValues } from "@/lib/actions/helpers/getInputValues";
import { getValue, type ObjPath, toObjPath } from "@/lib/utils/objPath";
import { invokeCallbacks } from "@/lib/actions/helpers/invokeCallbacks";
import type { ContributionState } from "@/lib/types/state/contribution";

/**
 * A reference to a property of an input of a callback of a contribution.
 */
export interface PropertyRef extends ContribRef, CallbackRef, InputRef {
  /** The property name as path. */
  propertyPath: ObjPath;
}

export function handleHostStoreChange<S extends object = object>(
  currState: S,
  prevState: S,
) {
  const { contributionsRecord } = store.getState();
  const callbackRequests = getCallbackRequests(
    contributionsRecord,
    currState,
    prevState,
  );
  invokeCallbacks(callbackRequests);
}

function getCallbackRequests<S extends object = object>(
  contributionsRecord: Record<string, ContributionState[]>,
  hostState: S,
  prevHostState: S,
): CallbackRequest[] {
  return getHostStorePropertyRefs()
    .filter((propertyRef) =>
      hasPropertyChanged(propertyRef.propertyPath, hostState, prevHostState),
    )
    .map((propertyRef) => {
      const contributions = contributionsRecord[propertyRef.contribPoint];
      const contribution = contributions[propertyRef.contribIndex];
      const callback = contribution.callbacks![propertyRef.callbackIndex];
      const inputValues = getInputValues(
        callback.inputs!,
        contribution,
        hostState,
      );
      return { ...propertyRef, inputValues };
    });
}

// const getHostStorePropertyRefs = memoizeOne(_getHostStorePropertyRefs);

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
            if (!input.noTrigger && input.link === "app") {
              propertyRefs.push({
                contribPoint,
                contribIndex,
                callbackIndex,
                inputIndex,
                propertyPath: toObjPath(input.property!),
              });
            }
          }),
        [] as Input[],
      );
    });
  });
  return propertyRefs;
}

function hasPropertyChanged<S extends object = object>(
  propertyPath: ObjPath,
  currState: S,
  prevState: S,
): boolean {
  const currValue = getValue(currState, propertyPath);
  const prevValue = getValue(prevState, propertyPath);
  return !Object.is(currValue, prevValue);
}
