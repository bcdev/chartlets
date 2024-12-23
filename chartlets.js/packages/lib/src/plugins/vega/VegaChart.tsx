import { VegaLite } from "react-vega";
import type { TopLevelSpec } from "vega-lite";

import type { ComponentProps, ComponentState } from "@/index";
import { useSignalListeners } from "./hooks/useSignalListeners";
import { useVegaTheme, type VegaTheme } from "./hooks/useVegaTheme";
import { useEffect, useState } from "react";
import { Skeleton } from "@/plugins/mui/Skeleton";

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
  chart: initialChart,
  skeletonProps,
  onChange,
}: VegaChartProps) {
  const signalListeners = useSignalListeners(initialChart, type, id, onChange);
  const vegaTheme = useVegaTheme(theme);
  const [chart, setChart] = useState<TopLevelSpec | null | undefined>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (initialChart) {
      setLoading(false);
      setChart(initialChart);
    }
  }, [initialChart]);

  return (
    <Skeleton loading={loading} {...skeletonProps}>
      {chart ? (
        <VegaLite
          theme={vegaTheme}
          spec={chart}
          style={style}
          signalListeners={signalListeners}
          actions={false}
        />
      ) : (
        <div id={id} style={style} />
      )}
    </Skeleton>
  );
}
