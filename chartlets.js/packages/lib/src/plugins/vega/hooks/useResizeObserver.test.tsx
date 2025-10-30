import { describe, expect, it, vi } from "vitest";
import { useResizeObserver } from "./useResizeObserver";
import { act, render } from "@testing-library/react";
import { useEffect } from "react";

globalThis.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe("useResizeObserver", () => {
  it("should observe a node", () => {
    let callbackRef: (node: Element | null) => void;

    const TestComponent = () => {
      const { containerCallbackRef } = useResizeObserver();
      callbackRef = containerCallbackRef;
      return <div ref={containerCallbackRef} />;
    };

    render(<TestComponent />);

    const observeSpy = vi.spyOn(globalThis.ResizeObserver.prototype, "observe");

    const node = document.createElement("div");
    act(() => {
      if (callbackRef) {
        callbackRef(node);
      }
    });

    expect(observeSpy).toHaveBeenCalledWith(node);
  });

  it("should disconnect previous observer when node changes", () => {
    let callbackRef: (node: Element | null) => void;

    const TestComponent = () => {
      const { containerCallbackRef } = useResizeObserver();
      callbackRef = containerCallbackRef;
      return null;
    };

    render(<TestComponent />);

    const disconnectSpy = vi.spyOn(
      globalThis.ResizeObserver.prototype,
      "disconnect",
    );

    const observeSpy = vi.spyOn(globalThis.ResizeObserver.prototype, "observe");

    const node1 = document.createElement("div");
    const node2 = document.createElement("div");

    act(() => {
      if (callbackRef) {
        callbackRef(node1);
        callbackRef(node2);
      }
    });

    expect(disconnectSpy).toHaveBeenCalled();
    expect(observeSpy).toHaveBeenCalledWith(node2);
  });

  it("should update containerSizeKey on resize", () => {
    let observerCallback: ResizeObserverCallback | null = null;

    globalThis.ResizeObserver = class {
      constructor(cb: ResizeObserverCallback) {
        observerCallback = cb;
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    };

    let lastKey = 0;

    const TestComponent = () => {
      const { containerCallbackRef, containerSizeKey } = useResizeObserver();

      useEffect(() => {
        lastKey = containerSizeKey;
      }, [containerSizeKey]);

      return <div ref={containerCallbackRef} />;
    };

    render(<TestComponent />);
    const initialKey = lastKey;

    act(() => {
      if (observerCallback) {
        observerCallback([], {} as ResizeObserver);
      }
    });

    expect(lastKey).not.toBe(initialKey);
  });
});
