/*
 * Copyright (c) 2019-2026 by Brockmann Consult Development team
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Icon } from "./Icon";

describe("Icon", () => {
  it("should render nothing if iconName is not given", () => {
    const { container } = render(<Icon />);
    expect(container.firstChild).toBeNull();
  });

  it("should render the iconName", () => {
    render(<Icon iconName="sunny" />);
    expect(screen.getByText("sunny")).not.toBeUndefined();
  });

  it("should render a MUI Icon root element", () => {
    render(<Icon iconName="home" />);

    const icon = screen.getByText("home");
    // MUI Icon renders as a <span> with MuiIcon-root class in default configuration
    expect(icon.tagName.toLowerCase()).toEqual("span");
    expect(icon.className).toContain("MuiIcon-root");
  });
});
