/*
 * Copyright (c) 2019-2026 by Brockmann Consult Development team
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Accordion } from "./Accordion";
import { createChangeHandler } from "@/plugins/mui/common.test";

describe("Accordion", () => {
  it("should render the Accordion component", () => {
    render(
      <Accordion
        id="acc"
        type="Accordion"
        label="My Accordion"
        onChange={() => {}}
      />,
    );

    expect(screen.getByText("My Accordion")).not.toBeUndefined();
  });

  it("should fire 'expanded' property", () => {
    const { recordedEvents, onChange } = createChangeHandler();

    render(
      <Accordion
        id="acc"
        type="Accordion"
        expanded={false}
        label="My Accordion"
        onChange={onChange}
      ></Accordion>,
    );

    // MUI Summary renders a button element
    fireEvent.click(screen.getByRole("button"));

    expect(recordedEvents.length).toEqual(1);
    expect(recordedEvents[0]).toEqual({
      componentType: "Accordion",
      id: "acc",
      property: "expanded",
      value: true,
    });
  });
});
