/*
 * Copyright (c) 2019-2026 by Brockmann Consult Development team
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LinearProgress } from "./LinearProgress";

describe("LinearProgress", () => {
  it("should render the LinearProgress component", () => {
    render(
      <LinearProgress
        type="LinearProgress"
        id="cp"
        value={75}
        onChange={() => {}}
      />,
    );
    // to inspect rendered component, do:
    // expect(document.querySelector("#cp")).toEqual({});
    expect(screen.getByRole("progressbar")).not.toBeUndefined();
  });
});
