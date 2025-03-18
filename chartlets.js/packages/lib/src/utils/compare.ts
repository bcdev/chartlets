export function shallowEqualArrays(
  arr1?: unknown[],
  arr2?: unknown[],
): boolean {
  if (!arr1 || !arr2) {
    return false;
  }
  if (arr1.length !== arr2.length) {
    return false;
  }
  return arr1.every((val, index) => val === arr2[index]);
}
