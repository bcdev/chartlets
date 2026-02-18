/*
 * Copyright (c) 2019-2026 by Brockmann Consult Development team
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { describe, it, expect } from "vitest";

import { mapObject } from "@/utils/mapObject";

describe("Test that mapObject()", () => {
  it("works", () => {
    const obj = { a: 1, b: "4", c: true };
    expect(mapObject(obj, (x) => Number(x))).toEqual({ a: 1, b: 4, c: 1 });
  });
});
