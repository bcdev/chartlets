/*
 * Copyright (c) 2019-2026 by Brockmann Consult Development team
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Typography } from "./Typography";

describe("Box", () => {
  it("should render the Typography component", () => {
    render(
      <Typography
        id="typo"
        type={"Typography"}
        children={["Hallo!"]}
        onChange={() => {}}
      />,
    );
    // to inspect rendered component, do:
    // expect(document.querySelector("#typo")).toEqual({});
    expect(screen.getByText("Hallo!")).not.toBeUndefined();
  });
});
