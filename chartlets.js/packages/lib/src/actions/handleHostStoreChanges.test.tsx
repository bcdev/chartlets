import { beforeEach, describe, expect, it } from "vitest";
import { store } from "@/store";
import {
  getCallbackRequests,
  getPropertyRefsForContribPoints,
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
  let lastCallbackInputValues: Record<string, unknown[]> = {};

  beforeEach(() => {
    listeners = [];
    hostState = {};
    lastCallbackInputValues = {};
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

  it("should memoize computation of property refs", () => {
    const contributionsRecord: Record<string, ContributionState[]> = {
      panels: [
        {
          name: "p0",
          container: { title: "Panel A" },
          extension: "e0",
          componentResult: {},
          initialState: {},
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
            {
              function: {
                name: "callback2",
                parameters: [],
                return: {},
              },
              inputs: [
                { id: "@app", property: "datasetId" },
                { id: "@app", property: "variableName" },
              ],
              outputs: [{ id: "plot", property: "value" }],
            },
          ],
        },
      ],
    };
    const propertyRefs1 = getPropertyRefsForContribPoints(contributionsRecord);
    const propertyRefs2 = getPropertyRefsForContribPoints(contributionsRecord);
    const propertyRefs3 = getPropertyRefsForContribPoints({
      ...contributionsRecord,
    });
    expect(propertyRefs1).toBe(propertyRefs2);
    expect(propertyRefs2).not.toBe(propertyRefs3);
    expect(propertyRefs1).toEqual([
      {
        callbackIndex: 0,
        contribIndex: 0,
        contribPoint: "panels",
        inputIndex: 0,
        property: "variableName",
      },
      {
        callbackIndex: 1,
        contribIndex: 0,
        contribPoint: "panels",
        inputIndex: 0,
        property: "datasetId",
      },
      {
        callbackIndex: 1,
        contribIndex: 0,
        contribPoint: "panels",
        inputIndex: 1,
        property: "variableName",
      },
    ]);
    expect(propertyRefs1).toEqual(propertyRefs2);
    expect(propertyRefs1).toEqual(propertyRefs3);
    expect(propertyRefs2).toEqual(propertyRefs3);
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
      contributionsRecord: {
        panel: [
          {
            name: "p0",
            container: { title: "Panel A" },
            extension: "e0",
            componentResult: {},
            initialState: {},
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
          },
        ],
      },
    });
    hostStore.set("variableName", "CHL");
    handleHostStoreChange();

    // calling it second time for coverage. No state change changes the
    // control flow
    handleHostStoreChange();
    //   TODO: Update this test to assert the generated callback request
  });

  it("should memoize second call with same arguments", () => {
    const extensions = [{ name: "ext", version: "0", contributes: ["panels"] }];
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
                  },
                ],
                initialState: {},
              },
            ],
          },
        },
      },
      lastCallbackInputValues: lastCallbackInputValues,
    });
    const propertyRefs: PropertyRef[] = [
      {
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

    hostStore.set("variableName", "CHL");

    // first call -> should create callback request
    let result = getCallbackRequests(
      propertyRefs,
      contributionsRecord,
      hostStore,
    );
    expect(result[0]).toEqual({
      ...propertyRefs[0],
      inputValues: ["CHL"],
    });

    // second call -> memoized -> should not create callback request
    result = getCallbackRequests(propertyRefs, contributionsRecord, hostStore);
    expect(result).toEqual([undefined]);

    // Third call - change state -> should create callback request
    hostStore.set("variableName", "TMP");
    result = getCallbackRequests(propertyRefs, contributionsRecord, hostStore);
    expect(result[0]).toEqual({
      ...propertyRefs[0],
      inputValues: ["TMP"],
    });

    // fourth call -> memoized -> should not invoke callback
    result = getCallbackRequests(propertyRefs, contributionsRecord, hostStore);
    expect(result).toEqual([undefined]);
  });
});
