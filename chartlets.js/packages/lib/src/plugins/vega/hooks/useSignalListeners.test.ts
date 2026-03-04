/*
 * Copyright (c) 2019-2026 by Brockmann Consult Development team
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import type { TopLevelSpec } from "vega-lite";
import { useSignalListeners } from "./useSignalListeners";
import { createChangeHandler } from "@/plugins/mui/common.test";
import type { Result as VegaEmbedResult } from "vega-embed";

const chart: TopLevelSpec = {
  $schema: "https://vega.github.io/schema/vega-lite/v6.json",
  config: { view: { continuousWidth: 300, continuousHeight: 300 } },
  data: { name: "data-0" },
  mark: { type: "bar" },
  datasets: {
    "data-0": [
      { x: "A", a: 28, b: 50, c: 50 },
      { x: "B", a: 55, b: 32, c: 40 },
      { x: "C", a: 43, b: 56, c: 30 },
      { x: "D", a: 91, b: 44, c: 20 },
      { x: "E", a: 81, b: 8, c: 10 },
    ],
  },
};

const chartWithSelect: TopLevelSpec = {
  ...chart,
  params: [
    {
      name: "sel_point",
      select: "point",
    },
    {
      name: "sel_interval",
      select: "interval",
    },
    {
      name: "sel_point_a",
      select: { on: "click", type: "point", fields: ["x", "a"] },
    },
    // Event not supported yet
    {
      name: "sel_interval_b",
      select: { on: "wheel", type: "interval", fields: ["x", "b"] },
    },
  ],
};

describe("useSignalListeners", () => {
  it("should return a stable record wo signals", () => {
    const { result, rerender } = renderHook(() =>
      useSignalListeners(chart, "VegaChart", "my_chart", () => {}),
    );
    const signalHandlers1 = result.current.signalListenerMap;
    rerender();
    const signalHandlers2 = result.current.signalListenerMap;
    expect(signalHandlers1).toEqual({});
    expect(signalHandlers2).toEqual({});
    expect(signalHandlers1).toBe(signalHandlers1);
  });

  it("should support different signal types", () => {
    const { result } = renderHook(() =>
      useSignalListeners(chartWithSelect, "VegaChart", "my_chart", () => {}),
    );
    const signalHandlers = result.current.signalListenerMap;
    expect(signalHandlers).toBeDefined();
    expect(signalHandlers["sel_point"]).toBeTypeOf("function");
    expect(signalHandlers["sel_interval"]).toBeTypeOf("function");
    expect(signalHandlers["sel_point_a"]).toBeTypeOf("function");
    // "wheel" not supported
    expect(signalHandlers["sel_interval_b"]).toBeUndefined();
  });

  it("should call onChange", () => {
    const { recordedEvents, onChange } = createChangeHandler();
    const { result } = renderHook(() =>
      useSignalListeners(chartWithSelect, "VegaChart", "my_chart", onChange),
    );
    const signalHandlers = result.current.signalListenerMap;
    expect(signalHandlers).toBeDefined();
    const signalHandler = signalHandlers["sel_point_a"];
    expect(signalHandler).toBeTypeOf("function");
    act(() => {
      signalHandler("sel_point_a", [1, 2, 3]);
    });
    expect(recordedEvents.length).toBe(1);
    expect(recordedEvents[0]).toEqual({
      componentType: "VegaChart",
      id: "my_chart",
      property: "sel_point_a",
      value: [1, 2, 3],
    });
  });

  it("should register signal listeners on embed", () => {
    const { result } = renderHook(() =>
      useSignalListeners(chartWithSelect, "VegaChart", "my_chart", () => {}),
    );

    const view = createMockView();

    act(() => {
      result.current.onEmbed({ view } as unknown as VegaEmbedResult);
    });

    // Supported signals: sel_point, sel_interval, sel_point_a
    expect(view.addSignalListener).toHaveBeenCalledTimes(3);

    const names = view.addSignalListener.mock.calls.map(([name]) => name);
    expect(names).toEqual(
      expect.arrayContaining(["sel_point", "sel_interval", "sel_point_a"]),
    );

    // Unsupported "wheel" should not be registered
    expect(names).not.toContain("sel_interval_b");
  });

  it("should remove old listeners when embedding again", () => {
    const { result } = renderHook(() =>
      useSignalListeners(chartWithSelect, "VegaChart", "my_chart", () => {}),
    );

    const view1 = createMockView();
    const view2 = createMockView();

    act(() => {
      result.current.onEmbed({ view: view1 } as unknown as VegaEmbedResult);
    });

    const attachedToView1 = view1.addSignalListener.mock.calls.map(
      ([name, fn]) => ({ name, fn }),
    );

    act(() => {
      result.current.onEmbed({ view: view2 } as unknown as VegaEmbedResult);
    });

    expect(view1.removeSignalListener).toHaveBeenCalledTimes(
      attachedToView1.length,
    );

    for (const { name, fn } of attachedToView1) {
      expect(view1.removeSignalListener).toHaveBeenCalledWith(name, fn);
    }

    expect(view2.addSignalListener).toHaveBeenCalledTimes(3);
  });

  it("should cleanup listeners on unmount", () => {
    const { result, unmount } = renderHook(() =>
      useSignalListeners(chartWithSelect, "VegaChart", "my_chart", () => {}),
    );

    const view = createMockView();

    act(() => {
      result.current.onEmbed({ view } as unknown as VegaEmbedResult);
    });

    const attached = view.addSignalListener.mock.calls.map(([name, fn]) => ({
      name,
      fn,
    }));

    unmount();

    expect(view.removeSignalListener).toHaveBeenCalledTimes(attached.length);
    for (const { name, fn } of attached) {
      expect(view.removeSignalListener).toHaveBeenCalledWith(name, fn);
    }
  });

  it("should do nothing if embed result has no view", () => {
    const { result } = renderHook(() =>
      useSignalListeners(chartWithSelect, "VegaChart", "my_chart", () => {}),
    );

    act(() => {
      result.current.onEmbed({} as unknown as VegaEmbedResult);
    });
  });
});

function createMockView() {
  return {
    addSignalListener: vi.fn(),
    removeSignalListener: vi.fn(),
  };
}
