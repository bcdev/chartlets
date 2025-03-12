import { describe, expect, it } from "vitest";
import { shallowEqualArrays } from "@/utils/compare";

describe("Test shallowEqualArrays()", () => {
  const arr_a: string[] = ["a", "b", "c"];
  const arr_b: string[] = ["a", "b", "c"];
  const arr_c: string[] = ["a", "b", "d"];
  const arr_d: string[] = [];
  const arr_e: string[] = ["a", "b", "c", "d"];
  const arr_f: (string | null)[] = ["a", "b", "c", null];
  const arr_g: (string | null)[] = ["a", "b", "c", null];
  const arr_h = [1, [1, 2, 3], [4, 5, 6]];
  const arr_i = [1, [1, 2, 3], [4, 5, 6]];
  const arr_j: (number | string | null)[] = [1, 2, "c", null];
  const arr_k: (number | string | null)[] = [1, 3, "c", null];
  const arr_l: (number | string | null)[] = [1, 2, "c", null];
  const arr_m: number[] = [1, 2];
  const arr_n: number[] = [1, 2];
  const arr_o: null[] = [null];
  const arr_p: null[] = [null];
  it("works", () => {
    expect(shallowEqualArrays(arr_a, arr_b)).toBe(true);
    expect(shallowEqualArrays(arr_a, arr_c)).toBe(false);
    expect(shallowEqualArrays(arr_a, arr_d)).toBe(false);
    expect(shallowEqualArrays(arr_a, arr_e)).toBe(false);
    expect(shallowEqualArrays(arr_f, arr_g)).toBe(true);
    expect(shallowEqualArrays(arr_h, arr_i)).toBe(false);
    expect(shallowEqualArrays(arr_j, arr_k)).toBe(false);
    expect(shallowEqualArrays(arr_j, arr_l)).toBe(true);
    expect(shallowEqualArrays(arr_m, arr_n)).toBe(true);
    expect(shallowEqualArrays(arr_m, arr_l)).toBe(false);
    expect(shallowEqualArrays(arr_o, arr_p)).toBe(true);
  });
});
