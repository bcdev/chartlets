import { VegaLite } from "react-vega";
import type { TopLevelSpec } from "vega-lite";

import type { ComponentProps, ComponentState } from "@/index";
import { useSignalListeners } from "./hooks/useSignalListeners";
import { useVegaTheme, type VegaTheme } from "./hooks/useVegaTheme";
import { useCallback, useRef, useState } from "react";

interface VegaChartState extends ComponentState {
  theme?: VegaTheme | "default" | "system";
  chart?:
    | TopLevelSpec // This is the vega-lite specification type
    | null;
}

interface VegaChartProps extends ComponentProps, VegaChartState {}

export function VegaChart({
  type,
  id,
  style,
  theme,
  chart,
  onChange,
}: VegaChartProps) {
  const signalListeners = useSignalListeners(chart, type, id, onChange);
  const vegaTheme = useVegaTheme(theme);
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
  if (chart) {
    return (
      <div id="chart-container" ref={containerCallbackRef} style={style}>
        <VegaLite
          key={containerSizeKey}
          theme={vegaTheme}
          spec={chart}
          style={style}
          signalListeners={signalListeners}
          actions={false}
        />
      </div>
    );
  } else {
    return <div id={id} />;
  }
}
