import { describe, it, expect } from "vitest";

import { ComponentState, PlotState } from "../state/component";
import { ContribPoint } from "../model/extension";
import { ContributionState } from "../state/contribution";
import { ChangeRequest } from "../model/callback";
import {
  applyComponentStateChange,
  applyContributionChangeRequests,
  getComponentStateValue,
} from "./applyPropertyChange";

const componentState: ComponentState = {
  type: "Box",
  id: "b1",
  components: [
    { type: "Plot", id: "p1", figure: null } as PlotState,
    {
      type: "Box",
      id: "b2",
      components: [
        { type: "Checkbox", id: "cb1", value: true },
        { type: "Dropdown", id: "dd1", value: 13 },
      ],
    },
  ],
};

describe("Test that applyContributionChangeRequests()", () => {
  const contributionStatesRecord: Record<ContribPoint, ContributionState[]> = {
    panels: [
      { componentStateResult: { status: "ok" }, visible: true, componentState },
    ],
  };

  const changeRequest1: ChangeRequest = {
    contribPoint: "panels",
    contribIndex: 0,
    changes: [
      {
        kind: "Component",
        id: "dd1",
        property: "value",
        value: 14,
      },
    ],
  };

  const changeRequest2: ChangeRequest = {
    contribPoint: "panels",
    contribIndex: 0,
    changes: [
      {
        kind: "Component",
        id: "dd1",
        property: "value",
        value: 13,
      },
    ],
  };

  it("changes state if values are different", () => {
    const newState = applyContributionChangeRequests(contributionStatesRecord, [
      changeRequest1,
    ]);
    expect(newState).not.toBe(contributionStatesRecord);
    expect(
      newState["panels"][0].componentState!.components![1].components![1].value,
    ).toEqual(14);
  });

  it("doesn't change the state if value stays the same", () => {
    const newState = applyContributionChangeRequests(contributionStatesRecord, [
      changeRequest2,
    ]);
    expect(newState).toBe(contributionStatesRecord);
  });
});

describe("Test that applyComponentStateChange()", () => {
  it("changes state if values are different", () => {
    const newState = applyComponentStateChange(componentState, {
      kind: "Component",
      id: "cb1",
      property: "value",
      value: false,
    });
    expect(newState).not.toBe(componentState);
    expect(newState.components![1].components![0].value).toEqual(false);
  });

  it("doesn't change the state if value stays the same", () => {
    const newState = applyComponentStateChange(componentState, {
      kind: "Component",
      id: "cb1",
      property: "value",
      value: true,
    });
    expect(newState).toBe(componentState);
  });
});

describe("Test that getComponentStateValue()", () => {
  it("works on 1st level", () => {
    expect(
      getComponentStateValue(componentState, {
        kind: "Component",
        id: "b1",
        property: "value",
      }),
    ).toBeUndefined();
  });

  it("works on 2nd level", () => {
    expect(
      getComponentStateValue(componentState, {
        kind: "Component",
        id: "p1",
        property: "figure",
      }),
    ).toEqual(null);
  });

  it("works on 3rd level", () => {
    expect(
      getComponentStateValue(componentState, {
        kind: "Component",
        id: "cb1",
        property: "value",
      }),
    ).toEqual(true);

    expect(
      getComponentStateValue(componentState, {
        kind: "Component",
        id: "dd1",
        property: "value",
      }),
    ).toEqual(13);
  });
});
