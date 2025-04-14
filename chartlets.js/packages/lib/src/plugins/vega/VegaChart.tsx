import { VegaLite } from "react-vega";
import type { TopLevelSpec } from "vega-lite";

import type { ComponentProps, ComponentState } from "@/index";
import { useSignalListeners } from "./hooks/useSignalListeners";
import { useVegaTheme, type VegaTheme } from "./hooks/useVegaTheme";
import { useResizeObserver } from "./hooks/useResizeObserver";

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
  const { containerSizeKey, containerCallbackRef } = useResizeObserver();
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
