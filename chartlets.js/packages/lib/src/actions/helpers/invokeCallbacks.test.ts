/*
 * Copyright (c) 2019-2026 by Brockmann Consult Development team
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { store } from "@/store";
import type { ComponentState } from "@/types/state/component";
import type { StateChangeRequest } from "@/types/model/callback";
import { invokeCallbacks } from "./invokeCallbacks";

function createDeferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((resolvePromise) => {
    resolve = resolvePromise;
  });
  return { promise, resolve };
}

function getProgressComponent() {
  return (store.getState().contributionsRecord.panels[0].component!
    .children![0] as ComponentState);
}

describe("invokeCallbacks", () => {
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
              ],
            },
            callbacks: [
              {
                function: { name: "calculate", parameters: [], return: {} },
                inputs: [{ id: "run", property: "clicked" }],
                outputs: [{ id: "progress", property: "visible" }],
              },
            ],
            initialState: {},
          },
        ],
      },
      lastCallbackInputValues: {},
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("shows progress while a callback with a progress visibility output is pending", async () => {
    const deferred = createDeferred<Response>();
    globalThis.fetch = vi.fn().mockReturnValue(deferred.promise);

    invokeCallbacks([
      {
        contribPoint: "panels",
        contribIndex: 0,
        callbackIndex: 0,
        inputIndex: 0,
        inputValues: [true],
      },
    ]);

    expect(getProgressComponent().visible).toBe(true);

    const callbackResult: StateChangeRequest[] = [
      {
        contribPoint: "panels",
        contribIndex: 0,
        stateChanges: [{ id: "progress", property: "visible", value: false }],
      },
    ];
    deferred.resolve({
      ok: true,
      status: 200,
      statusText: "ok",
      json: vi.fn().mockResolvedValue({ result: callbackResult }),
    } as unknown as Response);

    await vi.waitFor(() => {
      expect(getProgressComponent().visible).toBe(false);
    });
  });
});