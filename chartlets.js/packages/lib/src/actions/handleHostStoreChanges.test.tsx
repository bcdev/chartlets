import { beforeEach, describe, expect, it } from "vitest";
import { store } from "@/store";
import {
  getCallbackRequests,
  handleHostStoreChange,
  type PropertyRef,
} from "./handleHostStoreChange";
import type { ContribPoint } from "@/types/model/extension";
import type { ContributionState } from "@/types/state/contribution";

describe("handleHostStoreChange", () => {
  let listeners: (() => void)[] = [];
  let hostState: Record<string, unknown> = {};
  const hostStore = {
    get: (key: string) => hostState[key],
    set: (key: string, value: unknown) => {
      hostState = { ...hostState, [key]: value };
      listeners.forEach((l) => void l());
    },
    subscribe: (_l: () => void) => {
      listeners.push(_l);
    },
  };
  let lastInputValues: Record<string, unknown[]> = {};

  beforeEach(() => {
    listeners = [];
    hostState = {};
    lastInputValues = {};
  });

  it("should do nothing without host store", () => {
    store.setState({ configuration: {} });
    const oldState = store.getState();
    handleHostStoreChange();
    const newState = store.getState();
    expect(newState).toBe(oldState);
    expect(newState).toEqual(oldState);
  });

  it("should synchronize theme mode", () => {
    store.setState({ configuration: { hostStore } });
    expect(store.getState().themeMode).toBeUndefined();
    hostStore.set("themeMode", "light");
    handleHostStoreChange();
    expect(store.getState().themeMode).toEqual("light");
  });

  it("should generate callback requests", () => {
    const extensions = [{ name: "e0", version: "0", contributes: ["panels"] }];
    store.setState({
      configuration: { hostStore },
      extensions,
      contributionsResult: {
        status: "ok",
        data: {
          extensions,
          contributions: {
            panels: [
              {
                name: "p0",
                extension: "e0",
                layout: {
                  function: {
                    name: "layout",
                    parameters: [],
                    return: {},
                  },
                  inputs: [],
                  outputs: [],
                },
                callbacks: [
                  {
                    function: {
                      name: "callback",
                      parameters: [],
                      return: {},
                    },
                    inputs: [{ id: "@app", property: "variableName" }],
                    outputs: [{ id: "select", property: "value" }],
                  },
                ],
                initialState: {},
              },
            ],
          },
        },
      },
    });
    hostStore.set("variableName", "CHL");
    handleHostStoreChange();
  });

  it("should memoize second call with same arguments", () => {
    const extensions = [{ name: "e0", version: "0", contributes: ["panels"] }];
    store.setState({
      configuration: { hostStore, logging: { enabled: false } },
      extensions,
      contributionsResult: {
        status: "ok",
        data: {
          extensions,
          contributions: {
            panels: [
              {
                name: "ext.p1",
                extension: "ext",
                layout: {
                  function: {
                    name: "layout",
                    parameters: [],
                    return: {},
                  },
                  inputs: [],
                  outputs: [],
                },
                callbacks: [
                  {
                    function: {
                      name: "callback",
                      parameters: [],
                      return: {},
                    },
                    inputs: [{ id: "@app", property: "variableName" }],
                    outputs: [{ id: "select", property: "value" }],
                  },
                ],
                initialState: {},
              },
            ],
          },
        },
      },
      lastInputValues: lastInputValues,
    });
    hostStore.set("variableName", "CHL");
    const propertyRefs: PropertyRef[] = [
      {
        id: "panel-0-0-0",
        contribPoint: "panel",
        contribIndex: 0,
        callbackIndex: 0,
        property: "value",
        inputIndex: 0,
      },
    ];
    const contributionsRecord: Record<ContribPoint, ContributionState[]> = {
      panel: [
        {
          name: "ext.p1",
          container: { title: "Panel A" },
          extension: "ext",
          componentResult: {},
          initialState: { title: "Panel A" },
          callbacks: [
            {
              function: {
                name: "callback",
                parameters: [{ name: "param1" }],
                return: {},
              },
              inputs: [{ id: "@app", property: "variableName" }],
            },
          ],
        },
      ],
    };
    const result = getCallbackRequests(
      propertyRefs,
      contributionsRecord,
      hostStore,
    );
    expect(result[0]).toEqual({
      ...propertyRefs[0],
      inputValues: ["CHL"],
    });
  });
});
