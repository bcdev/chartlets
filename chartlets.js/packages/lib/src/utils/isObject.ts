/*
 * Copyright (c) 2019-2026 by Brockmann Consult Development team
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

export function isObject(
  value: unknown,
): value is { [key: string | number]: unknown } {
  return typeof value === "object" && value !== null;
}
