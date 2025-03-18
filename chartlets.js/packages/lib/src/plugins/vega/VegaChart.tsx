import { VegaLite } from "react-vega";
import type { TopLevelSpec } from "vega-lite";

import { type ComponentProps, type ComponentState } from "@/index";
import { useVegaTheme, type VegaTheme } from "./hooks/useVegaTheme";
import { useSignalListeners } from "@/plugins/vega/hooks/useSignalListeners";
import { Skeleton } from "@/plugins/mui/Skeleton";
import { useLoadingState } from "@/hooks";
import type { ReactElement } from "react";

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

  const loadingState = useLoadingState();
  if (!id) {
    return;
  }
  const isLoading = loadingState[id];

  if (isLoading == "failed") {
    return <div>An error occurred while loading the data.</div>;
  }
  const chart: ReactElement | null = initialChart ? (
    <VegaLite
      theme={vegaTheme}
      spec={initialChart}
      signalListeners={signalListeners}
      actions={false}
    />
  ) : (
    <div />
  );
  const isSkeletonRequired = skeletonProps !== undefined;
  if (!isSkeletonRequired) {
    return chart;
  }
  const skeletonId = id + "-skeleton";
  return (
    <Skeleton
      isLoading={isLoading}
      id={skeletonId}
      style={style}
      {...skeletonProps}
    >
      {chart}
    </Skeleton>
  );
}
