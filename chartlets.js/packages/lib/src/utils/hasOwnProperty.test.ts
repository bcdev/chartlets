/*
 * Copyright (c) 2019-2026 by Brockmann Consult Development team
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { describe, it, expect } from "vitest";
import { hasOwnProperty } from "@/utils/hasOwnProperty";

describe("Test that hasOwnProperty()", () => {
  it("works", () => {
    expect(hasOwnProperty({ test: 13 }, "test")).toBe(true);
    expect(hasOwnProperty({ test: 13 }, "test2")).toBe(false);
  });
});
