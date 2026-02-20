/*
 * Copyright (c) 2019-2026 by Brockmann Consult Development team
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import "@testing-library/jest-dom";
import { vi } from "vitest";
import { createCanvas } from "canvas";

// Mock getContext for HTMLCanvasElement
HTMLCanvasElement.prototype.getContext = vi.fn().mockImplementation((type) => {
  const canvas = createCanvas(100, 100);
  return canvas.getContext(type);
});
