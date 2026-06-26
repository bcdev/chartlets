/*
 * Copyright (c) 2019-2026 by Brockmann Consult Development team
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { store } from "@/store";
import type { CallbackRequest, StateChangeRequest } from "@/types/model/callback";
import type { Output } from "@/types/model/channel";
import type { ComponentState } from "@/types/state/component";
import { applyStateChangeRequests } from "@/actions/helpers/applyStateChangeRequests";
import { formatObjPath } from "@/utils/objPath";

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
        formatObjPath(output.property) === "visible" &&
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

export function showPendingProgressTargets(targets: PendingProgressTarget[]) {
  incrementPendingProgressCounts(targets);
  applyPendingProgressTargets(targets, true);
}

export function releasePendingProgressTargets(
  targets: PendingProgressTarget[],
  callbackSucceeded: boolean,
) {
  decrementPendingProgressCounts(targets);
  const stillPendingTargets = targets.filter(
    (target) => pendingProgressCounts[getPendingProgressTargetKey(target)] > 0,
  );
  applyPendingProgressTargets(stillPendingTargets, true);

  if (!callbackSucceeded) {
    const completedTargets = targets.filter(
      (target) => !pendingProgressCounts[getPendingProgressTargetKey(target)],
    );
    applyPendingProgressTargets(completedTargets, false);
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
  visible: boolean,
) {
  if (targets.length === 0) {
    return;
  }
  applyStateChangeRequests(
    targets.map<StateChangeRequest>((target) => ({
      contribPoint: target.contribPoint,
      contribIndex: target.contribIndex,
      stateChanges: [{ ...target.output, value: visible }],
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