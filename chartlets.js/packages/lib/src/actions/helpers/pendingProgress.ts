/*
 * Copyright (c) 2019-2026 by Brockmann Consult Development team
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { store } from "@/store";
import type {
  CallbackRequest,
  StateChangeRequest,
} from "@/types/model/callback";
import type { Output } from "@/types/model/channel";
import type { ComponentState } from "@/types/state/component";
import { applyStateChangeRequests } from "@/actions/helpers/applyStateChangeRequests";
import { formatObjPath } from "@/utils/objPath";

/**
 * A progress component output that should be shown while a callback is pending.
 *
 * The output is always a component `hidden` output. While the backend callback is
 * running, chartlets applies `hidden: false` locally. The backend callback result
 * is still responsible for the final state after it returns.
 */
export interface PendingProgressTarget {
  contribPoint: string;
  contribIndex: number;
  id: string;
  output: Output;
}

const progressComponentTypes = new Set([
  "CircularProgress",
  "CircularProgressWithLabel",
  "LinearProgress",
  "LinearProgressWithLabel",
]);

const pendingProgressCounts: Record<string, number> = {};

/**
 * Finds callback outputs that target the `hidden` property of progress
 * components in the currently rendered contribution tree.
 *
 * This is the bridge between a Python callback declaring
 * `Output("some_progress", "hidden")` and the frontend showing that progress
 * component before the callback response arrives.
 */
export function getPendingProgressTargets(
  callbackRequests: CallbackRequest[],
): PendingProgressTarget[] {
  const { contributionsRecord } = store.getState();
  const targets: PendingProgressTarget[] = [];
  const targetKeys = new Set<string>();

  callbackRequests.forEach(({ contribPoint, contribIndex, callbackIndex }) => {
    const contribution = contributionsRecord[contribPoint]?.[contribIndex];
    const callback = contribution?.callbacks?.[callbackIndex];
    callback?.outputs?.forEach((output) => {
      if (
        formatObjPath(output.property) === "hidden" &&
        isProgressComponent(contribution.component, output.id)
      ) {
        const target = { contribPoint, contribIndex, id: output.id, output };
        const key = getPendingProgressTargetKey(target);
        if (!targetKeys.has(key)) {
          targetKeys.add(key);
          targets.push(target);
        }
      }
    });
  });

  return targets;
}

/**
 * Shows pending progress targets immediately by setting `hidden` to `false`.
 */
export function showPendingProgressTargets(targets: PendingProgressTarget[]) {
  incrementPendingProgressCounts(targets);
  applyPendingProgressTargets(targets, false);
}

/**
 * Releases progress targets after a callback finishes.
 *
 * Successful callbacks are expected to provide the final progress state in their
 * own returned outputs. Failed callbacks do not have such outputs, so completed
 * progress targets are hidden here. Overlapping callbacks keep the progress
 * visible until the last pending callback has finished.
 */
export function releasePendingProgressTargets(
  targets: PendingProgressTarget[],
  callbackSucceeded: boolean,
) {
  decrementPendingProgressCounts(targets);
  const stillPendingTargets = targets.filter(
    (target) => pendingProgressCounts[getPendingProgressTargetKey(target)] > 0,
  );
  applyPendingProgressTargets(stillPendingTargets, false);

  if (!callbackSucceeded) {
    const completedTargets = targets.filter(
      (target) => !pendingProgressCounts[getPendingProgressTargetKey(target)],
    );
    applyPendingProgressTargets(completedTargets, true);
  }
}

function incrementPendingProgressCounts(targets: PendingProgressTarget[]) {
  targets.forEach((target) => {
    const key = getPendingProgressTargetKey(target);
    pendingProgressCounts[key] = (pendingProgressCounts[key] || 0) + 1;
  });
}

function decrementPendingProgressCounts(targets: PendingProgressTarget[]) {
  targets.forEach((target) => {
    const key = getPendingProgressTargetKey(target);
    const count = (pendingProgressCounts[key] || 0) - 1;
    if (count > 0) {
      pendingProgressCounts[key] = count;
    } else {
      delete pendingProgressCounts[key];
    }
  });
}

function applyPendingProgressTargets(
  targets: PendingProgressTarget[],
  hidden: boolean,
) {
  if (targets.length === 0) {
    return;
  }
  applyStateChangeRequests(
    targets.map<StateChangeRequest>((target) => ({
      contribPoint: target.contribPoint,
      contribIndex: target.contribIndex,
      stateChanges: [{ ...target.output, value: hidden }],
    })),
  );
}

function getPendingProgressTargetKey(target: PendingProgressTarget) {
  return `${target.contribPoint}-${target.contribIndex}-${target.id}`;
}

function isProgressComponent(
  component: ComponentState | undefined,
  id: string,
): boolean {
  if (!component) {
    return false;
  }
  if (component.id === id) {
    return progressComponentTypes.has(component.type);
  }
  return Boolean(
    component.children?.some(
      (child) =>
        typeof child === "object" &&
        child !== null &&
        isProgressComponent(child, id),
    ),
  );
}
