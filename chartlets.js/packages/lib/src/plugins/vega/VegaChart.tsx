/*
 * Copyright (c) 2019-2026 by Brockmann Consult Development team
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { useRef } from "react";
import { VegaEmbed } from "react-vega";
import type { TopLevelSpec } from "vega-lite";

import type { ComponentProps, ComponentState } from "@/index";
import { useSignalListeners } from "./hooks/useSignalListeners";
import { useVegaTheme, type VegaTheme } from "./hooks/useVegaTheme";
import { useResizeObserver } from "./hooks/useResizeObserver";

interface VegaChartState extends ComponentState {
  theme?: VegaTheme | "default" | "system";
  chart?: TopLevelSpec | null;
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
  const { onEmbed } = useSignalListeners(chart, type, id, onChange);
  const vegaTheme = useVegaTheme(theme);
  const { containerSizeKey, containerCallbackRef } = useResizeObserver();

  const embedDivRef = useRef<HTMLDivElement | null>(null);

  if (chart) {
    return (
      <div id="chart-container" ref={containerCallbackRef} style={style}>
        <VegaEmbed
          key={containerSizeKey}
          ref={embedDivRef}
          spec={chart}
          onEmbed={onEmbed}
          options={{
            actions: false,
            theme: vegaTheme,
          }}
          style={style}
        />
      </div>
    );
  } else {
    return <div id={id} />;
  }
}
