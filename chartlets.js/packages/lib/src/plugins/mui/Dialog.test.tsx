/*
 * Copyright (c) 2019-2026 by Brockmann Consult Development team
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { registry } from "@/components/registry";
import { createChangeHandler } from "@/plugins/mui/common.test";
import { Button, type ButtonProps } from "@/plugins/mui/Button";
import { Dialog } from "./Dialog";

describe("Dialog", () => {
  it("should render the Dialog component", () => {
    render(
      <Dialog
        id="test-dialog"
        type="Dialog"
        open={true}
        title="Test Title"
        content="Test Content"
        onChange={() => {}}
      />,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("should not render the Dialog if open is false", () => {
    render(
      <Dialog
        id="test-dialog"
        type="Dialog"
        open={false}
        onChange={() => {}}
      />,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("should handle onClose event and call onChange", () => {
    const { recordedEvents, onChange } = createChangeHandler();

    render(
      <Dialog
        id="test-dialog"
        type="Dialog"
        open={true}
        title="Test Title"
        content="Test Content"
        onChange={onChange}
      />,
    );

    const backdrop = document.querySelector(".MuiBackdrop-root");
    expect(backdrop).toBeInTheDocument();
    if (backdrop) {
      fireEvent.click(backdrop);
    }

    expect(recordedEvents.length).toBe(1);
    expect(recordedEvents[0]).toEqual({
      componentType: "Dialog",
      id: "test-dialog",
      property: "open",
      value: false,
    });
  });

  it("should render children within DialogActions", () => {
    registry.register("Button", Button);
    render(
      <Dialog
        id="test-dialog"
        type="Dialog"
        open={true}
        title="Test Title"
        content="Test Content"
        children={[
          {
            id: "test-button",
            type: "Button",
            text: "Click me!",
          } as ButtonProps,
        ]}
        onChange={() => {}}
      ></Dialog>,
    );

    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByText("Click me!")).toBeInTheDocument();
  });
});
