import { useCallback, useRef, useState } from "react";

export interface ResizeObserverResult {
  containerSizeKey: number;
  containerCallbackRef: (node: Element | null) => void;
}

export function useResizeObserver(): ResizeObserverResult {
  const containerRef = useRef<ResizeObserver | null>(null);
  const [containerSizeKey, setContainerSizeKey] = useState(0);
  const containerCallbackRef = useCallback((node: Element | null) => {
    if (containerRef.current) {
      containerRef.current.disconnect();
      containerRef.current = null;
    }
    if (node !== null) {
      const resizeObserver = new ResizeObserver((_entries) => {
        // We only need to know that a resize happened because it triggers a
        // re-render allowing vega to get the latest layout.
        setContainerSizeKey(Date.now());
      });

      resizeObserver.observe(node);
      containerRef.current = resizeObserver;
    }
  }, []);

  return { containerSizeKey, containerCallbackRef };
}
