/*
 * Copyright (c) 2019-2026 by Brockmann Consult Development team
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

export function mapObject<V1 = unknown, V2 = unknown>(
  obj: Record<string, V1>,
  transformValue: (value: V1, key: string | number) => V2,
): Record<string, V2> {
  const obj2: { [k: string]: V2 } = {};
  Object.getOwnPropertyNames(obj).forEach((key) => {
    obj2[key] = transformValue(obj[key], key);
  });
  return obj2;
}
