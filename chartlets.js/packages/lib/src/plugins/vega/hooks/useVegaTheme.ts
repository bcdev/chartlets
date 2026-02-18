/*
 * Copyright (c) 2019-2026 by Brockmann Consult Development team
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import * as vegaThemes from "vega-themes";
import { useThemeMode } from "@/hooks";
import { useMemo } from "react";

// while using `react-vega` v7 the vegaTheme needs to be restricted to:
// "dark" | "excel" | "ggplot2" | "quartz" | "vox" | "default" | "system" | undefined
export type VegaTheme = keyof Omit<typeof vegaThemes, "version" | "latimes"| "fivethirtyeight" | "urbaninstitute" |
    "googlecharts" | "powerbi" | "carbonwhite" | "carbong10" | "carbong90" | "carbong100">;

const isVegaTheme = (key?: string): key is VegaTheme =>
  !!key && key in vegaThemes;

const isSystemThemeDark = (): boolean =>
  window.matchMedia("(prefers-color-scheme: dark)").matches;

export function useVegaTheme(
  theme: VegaTheme | "default" | "system" | undefined,
): VegaTheme | undefined {
  const themeMode = useThemeMode();
  return useMemo(() => {
    if (!theme || theme === "default") {
      return themeMode === "dark" ||
        (themeMode === "system" && isSystemThemeDark())
        ? "dark"
        : undefined;
    } else if (theme === "system") {
      return isSystemThemeDark() ? "dark" : undefined;
    } else {
      return isVegaTheme(theme) ? theme : undefined;
    }
  }, [theme, themeMode]);
}
