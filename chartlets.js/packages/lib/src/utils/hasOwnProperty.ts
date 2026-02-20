/*
 * Copyright (c) 2019-2026 by Brockmann Consult Development team
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

export function hasOwnProperty(obj: unknown, property: string): boolean {
  return Object.prototype.hasOwnProperty.call(obj, property);
}
