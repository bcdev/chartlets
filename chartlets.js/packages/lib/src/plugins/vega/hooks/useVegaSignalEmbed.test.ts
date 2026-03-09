/*
 * Copyright (c) 2019-2026 by Brockmann Consult Development team
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import type { Result as VegaEmbedResult } from "vega-embed";

import { useVegaSignalEmbed } from "./useVegaSignalEmbed";

type SignalHandler = (signalName: string, signalValue: unknown) => void;

describe("useVegaSignalEmbed", () => {
  it("should register signal listeners on embed", () => {
    const signalListenerMap: Record<string, SignalHandler> = {
      sel_point: vi.fn(),
      sel_interval: vi.fn(),
      sel_point_a: vi.fn(),
    };

    const { result } = renderHook(() => useVegaSignalEmbed(signalListenerMap));

    const view = createMockView();

    act(() => {
      result.current({ view } as unknown as VegaEmbedResult);
    });

    expect(view.addSignalListener).toHaveBeenCalledTimes(3);

    const names = view.addSignalListener.mock.calls.map(([name]) => name);
    expect(names).toEqual(
      expect.arrayContaining(["sel_point", "sel_interval", "sel_point_a"]),
    );
  });

  it("should remove old listeners when embedding again", () => {
    const signalListenerMap: Record<string, SignalHandler> = {
      sel_point: vi.fn(),
      sel_interval: vi.fn(),
    };

    const { result } = renderHook(() => useVegaSignalEmbed(signalListenerMap));

    const view1 = createMockView();
    const view2 = createMockView();

    act(() => {
      result.current({ view: view1 } as unknown as VegaEmbedResult);
    });

    const attachedToView1 = view1.addSignalListener.mock.calls.map(
      ([name, fn]) => ({ name, fn }),
    );

    act(() => {
      result.current({ view: view2 } as unknown as VegaEmbedResult);
    });

    expect(view1.removeSignalListener).toHaveBeenCalledTimes(
      attachedToView1.length,
    );

    for (const { name, fn } of attachedToView1) {
      expect(view1.removeSignalListener).toHaveBeenCalledWith(name, fn);
    }

    expect(view2.addSignalListener).toHaveBeenCalledTimes(2);
  });

  it("should cleanup listeners on unmount", () => {
    const signalListenerMap: Record<string, SignalHandler> = {
      sel_point: vi.fn(),
      sel_interval: vi.fn(),
    };

    const { result, unmount } = renderHook(() =>
      useVegaSignalEmbed(signalListenerMap),
    );

    const view = createMockView();

    act(() => {
      result.current({ view } as unknown as VegaEmbedResult);
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
    const signalListenerMap: Record<string, SignalHandler> = {
      sel_point: vi.fn(),
    };

    const { result } = renderHook(() => useVegaSignalEmbed(signalListenerMap));

    act(() => {
      result.current({} as VegaEmbedResult);
    });
  });

  it("should register no listeners if the signal listener map is empty", () => {
    const { result } = renderHook(() => useVegaSignalEmbed({}));

    const view = createMockView();

    act(() => {
      result.current({ view } as unknown as VegaEmbedResult);
    });

    expect(view.addSignalListener).not.toHaveBeenCalled();
    expect(view.removeSignalListener).not.toHaveBeenCalled();
  });
});

function createMockView() {
  return {
    addSignalListener: vi.fn(),
    removeSignalListener: vi.fn(),
  };
}
