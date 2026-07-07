/*
 * Copyright (c) 2019-2026 by Brockmann Consult Development team
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { beforeEach, describe, expect, it } from "vitest";

import { store } from "@/store";
import type { CallbackRequest } from "@/types/model/callback";
import type { ComponentState } from "@/types/state/component";
import {
  getPendingProgressTargets,
  releasePendingProgressTargets,
  showPendingProgressTargets,
} from "./pendingProgress";

const callbackRequest: CallbackRequest = {
  contribPoint: "panels",
  contribIndex: 0,
  callbackIndex: 0,
  inputIndex: 0,
  inputValues: [true],
};

function getProgressComponent() {
  return store.getState().contributionsRecord.panels[0].component!
    .children![0] as ComponentState;
}

describe("pendingProgress", () => {
  beforeEach(() => {
    store.setState({
      configuration: {},
      extensions: [{ name: "ext", version: "0", contributes: ["panels"] }],
      contributionsResult: {},
      contributionsRecord: {
        panels: [
          {
            name: "panel",
            extension: "ext",
            container: {},
            componentResult: { status: "ok" },
            component: {
              type: "Box",
              children: [
                { type: "CircularProgress", id: "progress", hidden: true },
                { type: "Typography", id: "text", hidden: true },
              ],
            },
            callbacks: [
              {
                function: { name: "calculate", parameters: [], return: {} },
                inputs: [{ id: "run", property: "clicked" }],
                outputs: [
                  { id: "progress", property: "hidden" },
                  { id: "progress", property: "hidden" },
                  { id: "text", property: "hidden" },
                  { id: "progress", property: "value" },
                ],
              },
            ],
            initialState: {},
          },
        ],
      },
      lastCallbackInputValues: {},
    });
  });

  it("selects only hidden outputs that target progress components", () => {
    // Only the progress component's hidden output should become a pending target.
    // Duplicate outputs, non-progress components, and non-hidden outputs are ignored.
    expect(getPendingProgressTargets([callbackRequest])).toEqual([
      {
        contribPoint: "panels",
        contribIndex: 0,
        id: "progress",
        output: { id: "progress", property: "hidden" },
      },
    ]);
  });

  it("keeps progress visible until all overlapping callbacks are released", () => {
    const targets = getPendingProgressTargets([callbackRequest]);

    // Two overlapping callbacks should show the spinner once and keep it visible.
    showPendingProgressTargets(targets);
    showPendingProgressTargets(targets);
    releasePendingProgressTargets(targets, true);
    expect(getProgressComponent().hidden).toBe(false);

    // A failed final callback has no backend result to hide the spinner, so JS does it.
    releasePendingProgressTargets(targets, false);
    expect(getProgressComponent().hidden).toBe(true);
  });
});
