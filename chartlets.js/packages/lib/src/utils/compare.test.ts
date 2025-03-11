import { describe, expect, it } from "vitest";
import { shallowEqualArrays } from "@/utils/compare";

describe("Test shallowEqualArrays()", () => {
  const arr_a: string[] = ["a", "b", "c"];
  const arr_b: string[] = ["a", "b", "c"];
  const arr_c: string[] = ["a", "b", "d"];
  const arr_d: string[] = [];
  const arr_e: string[] = ["a", "b", "c", "d"];
  it("works", () => {
    expect(shallowEqualArrays(arr_a, arr_b)).toBe(true);
    expect(shallowEqualArrays(arr_a, arr_c)).toBe(false);
    expect(shallowEqualArrays(arr_a, arr_d)).toBe(false);
    expect(shallowEqualArrays(arr_a, arr_e)).toBe(false);
  });
});
