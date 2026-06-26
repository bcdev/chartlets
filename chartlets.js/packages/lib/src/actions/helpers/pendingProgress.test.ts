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
  return (store.getState().contributionsRecord.panels[0].component!
    .children![0] as ComponentState);
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
                {
                  type: "CircularProgress",
                  id: "progress",
                  visible: false,
                },
                {
                  type: "Typography",
                  id: "text",
                  visible: false,
                },
              ],
            },
            callbacks: [
              {
                function: { name: "calculate", parameters: [], return: {} },
                inputs: [{ id: "run", property: "clicked" }],
                outputs: [{ id: "progress", property: "visible" }],
              },
              {
                function: { name: "duplicate", parameters: [], return: {} },
                inputs: [{ id: "run", property: "clicked" }],
                outputs: [
                  { id: "progress", property: "visible" },
                  { id: "progress", property: "visible" },
                ],
              },
              {
                function: { name: "text", parameters: [], return: {} },
                inputs: [{ id: "run", property: "clicked" }],
                outputs: [{ id: "text", property: "visible" }],
              },
              {
                function: { name: "value", parameters: [], return: {} },
                inputs: [{ id: "run", property: "clicked" }],
                outputs: [{ id: "progress", property: "value" }],
              },
            ],
            initialState: {},
          },
        ],
      },
      lastCallbackInputValues: {},
    });
  });

  it("finds progress components targeted by visible callback outputs", () => {
    expect(getPendingProgressTargets([callbackRequest])).toEqual([
      {
        contribPoint: "panels",
        contribIndex: 0,
        id: "progress",
        output: { id: "progress", property: "visible" },
      },
    ]);
  });

  it("deduplicates repeated progress outputs from the same callback", () => {
    const targets = getPendingProgressTargets([
      { ...callbackRequest, callbackIndex: 1 },
    ]);

    expect(targets).toHaveLength(1);
  });

  it("ignores non-progress components and non-visible outputs", () => {
    expect(
      getPendingProgressTargets([{ ...callbackRequest, callbackIndex: 2 }]),
    ).toEqual([]);
    expect(
      getPendingProgressTargets([{ ...callbackRequest, callbackIndex: 3 }]),
    ).toEqual([]);
  });

  it("ignores progress outputs when no component tree has been loaded", () => {
    store.setState({
      contributionsRecord: {
        panels: [
          {
            ...store.getState().contributionsRecord.panels[0],
            component: undefined,
          },
        ],
      },
    });

    expect(getPendingProgressTargets([callbackRequest])).toEqual([]);
  });

  it("shows and hides progress when a callback fails", () => {
    const targets = getPendingProgressTargets([callbackRequest]);

    showPendingProgressTargets(targets);

    expect(getProgressComponent().visible).toBe(true);

    releasePendingProgressTargets(targets, false);

    expect(getProgressComponent().visible).toBe(false);
  });

  it("keeps progress visible until overlapping callbacks have completed", () => {
    const targets = getPendingProgressTargets([callbackRequest]);

    showPendingProgressTargets(targets);
    showPendingProgressTargets(targets);

    releasePendingProgressTargets(targets, true);

    expect(getProgressComponent().visible).toBe(true);

    releasePendingProgressTargets(targets, false);

    expect(getProgressComponent().visible).toBe(false);
  });
});