import {
  extent,
  format,
  interpolateRgb,
  max,
  mean,
  scaleSequential,
} from "d3";
import type { MonthlyPoint } from "@/data/mock";

export type ChartSurface = {
  grid: string;
  tick: string;
  cursor: string;
  tooltipBg: string;
  tooltipBorder: string;
  tooltipText: string;
  line: string;
  area: string;
  reference: string;
  barLow: string;
  barHigh: string;
};

export type ChartTheme = "light" | "dark" | "retro";

export function getChartSurface(theme: ChartTheme): ChartSurface {
  if (theme === "retro") {
    return {
      grid: "#b9b7c6",
      tick: "#23203a",
      cursor: "#e6e4ee",
      tooltipBg: "#f4f3f7",
      tooltipBorder: "#23203a",
      tooltipText: "#23203a",
      line: "#5b4a9e",
      area: "rgba(91, 74, 158, 0.18)",
      reference: "#d8443c",
      barLow: "#c9bff0",
      barHigh: "#5b4a9e",
    };
  }

  if (theme === "dark") {
    return {
      grid: "#2a2f3a",
      tick: "#9aa3b2",
      cursor: "#1f2430",
      tooltipBg: "#151922",
      tooltipBorder: "#2e3544",
      tooltipText: "#e8eaed",
      line: "#8b8cf5",
      area: "rgba(139, 140, 245, 0.16)",
      reference: "#6b7280",
      barLow: "#1e3a5f",
      barHigh: "#3b82f6",
    };
  }

  return {
    grid: "#eef0f2",
    tick: "#6b7280",
    cursor: "#f1f3f5",
    tooltipBg: "#ffffff",
    tooltipBorder: "#e6e8eb",
    tooltipText: "#171717",
    line: "#5b5bd6",
    area: "rgba(91, 91, 214, 0.12)",
    reference: "#94a3b8",
    barLow: "#bfdbfe",
    barHigh: "#1d4ed8",
  };
}

export const formatCompact = format(".2~s");
export const formatInteger = format(",d");
export const formatOneDecimal = format(".1f");

export function buildOrdersColorScale(series: MonthlyPoint[], theme: ChartTheme) {
  const surface = getChartSurface(theme);
  const values = series.map((point) => point.orders);
  const domain = extent(values) as [number | undefined, number | undefined];
  const minValue = domain[0] ?? 0;
  const maxValue = domain[1] ?? 1;
  const domainMax = maxValue === minValue ? minValue + 1 : maxValue;

  return scaleSequential(interpolateRgb(surface.barLow, surface.barHigh)).domain([
    minValue,
    domainMax,
  ]);
}

export function summarizeOrders(series: MonthlyPoint[]) {
  const values = series.map((point) => point.orders);
  return {
    average: mean(values) ?? 0,
    peak: max(values) ?? 0,
    total: values.reduce((sum, value) => sum + value, 0),
  };
}

export function tooltipStyles(surface: ChartSurface, theme: ChartTheme = "light") {
  const retro = theme === "retro";
  return {
    borderRadius: retro ? 0 : 8,
    border: `${retro ? 3 : 1}px solid ${surface.tooltipBorder}`,
    background: surface.tooltipBg,
    color: surface.tooltipText,
    boxShadow: retro ? `4px 4px 0 ${surface.tooltipBorder}` : "0 8px 24px rgba(0,0,0,0.12)",
    fontSize: 12,
    padding: "8px 10px",
  };
}
