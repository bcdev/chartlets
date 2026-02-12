/*
 * Copyright (c) 2019-2026 by Brockmann Consult Development team
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { describe, it, expect } from "vitest";
import {
  isComponentChannel,
  isContainerChannel,
  isHostChannel,
} from "./channel";

describe("Test that isComponentChannel()", () => {
  it("works", () => {
    expect(isComponentChannel({ id: "ok_btn", property: "checked" })).toBe(
      true,
    );
    expect(isComponentChannel({ id: "@container", property: "visible" })).toBe(
      false,
    );
    expect(
      isComponentChannel({ id: "@app", property: "selectedDatasetId" }),
    ).toBe(false);
  });
});

describe("Test that isContainerChannel()", () => {
  it("works", () => {
    expect(isContainerChannel({ id: "ok_btn", property: "checked" })).toBe(
      false,
    );
    expect(isContainerChannel({ id: "@container", property: "visible" })).toBe(
      true,
    );
    expect(
      isContainerChannel({ id: "@app", property: "selectedDatasetId" }),
    ).toBe(false);
  });
});

describe("Test that isHostChannel()", () => {
  it("works", () => {
    expect(isHostChannel({ id: "ok_btn", property: "checked" })).toBe(false);
    expect(isHostChannel({ id: "@container", property: "visible" })).toBe(
      false,
    );
    expect(isHostChannel({ id: "@app", property: "selectedDatasetId" })).toBe(
      true,
    );
  });
});
