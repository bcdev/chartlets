/*
 * Copyright (c) 2019-2026 by Brockmann Consult Development team
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { store } from "@/store";
import type { CallbackRequest, StateChangeRequest } from "@/types/model/callback";
import type { ComponentState } from "@/types/state/component";
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

const callbackRequest: CallbackRequest = {
  contribPoint: "panels",
  contribIndex: 0,
  callbackIndex: 0,
  inputIndex: 0,
  inputValues: [true],
};

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

  it("shows pending progress and applies callback results", async () => {
    const deferred = createDeferred<Response>();
    globalThis.fetch = vi.fn().mockReturnValue(deferred.promise);

    invokeCallbacks([callbackRequest]);

    expect(getProgressComponent().visible).toBe(true);

    deferred.resolve(createCallbackResponse([
      {
        contribPoint: "panels",
        contribIndex: 0,
        stateChanges: [{ id: "progress", property: "visible", value: false }],
      },
    ]));

    await vi.waitFor(() => {
      expect(getProgressComponent().visible).toBe(false);
    });
  });

  it("logs and releases pending progress when a callback fails", async () => {
    const deferred = createDeferred<Response>();
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    globalThis.fetch = vi.fn().mockReturnValue(deferred.promise);

    invokeCallbacks([callbackRequest]);

    expect(getProgressComponent().visible).toBe(true);

    deferred.resolve({
      ok: true,
      status: 200,
      statusText: "ok",
      json: vi.fn().mockResolvedValue({ message: "unexpected" }),
    } as unknown as Response);

    await vi.waitFor(() => {
      expect(getProgressComponent().visible).toBe(false);
    });
    expect(consoleError).toHaveBeenCalledOnce();
  });

  it("logs callback requests and results when logging is enabled", async () => {
    const deferred = createDeferred<Response>();
    const consoleInfo = vi.spyOn(console, "info").mockImplementation(() => {});
    globalThis.fetch = vi.fn().mockReturnValue(deferred.promise);
    store.setState({ configuration: { logging: { enabled: true } } });

    invokeCallbacks([callbackRequest]);

    deferred.resolve(createCallbackResponse([]));

    await vi.waitFor(() => {
      expect(consoleInfo).toHaveBeenCalledTimes(2);
    });
  });
});

function createCallbackResponse(result: StateChangeRequest[]) {
  return {
    ok: true,
    status: 200,
    statusText: "ok",
    json: vi.fn().mockResolvedValue({ result }),
  } as unknown as Response;
}