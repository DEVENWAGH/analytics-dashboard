"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useDashboard } from "@/context/DashboardContext";
import { useAppTheme } from "@/components/theme/useAppTheme";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  buildOrdersColorScale,
  type ChartTheme,
  formatInteger,
  getChartSurface,
  summarizeOrders,
  tooltipStyles,
} from "@/lib/chartTheme";

type TipProps = {
  active?: boolean;
  payload?: Array<{ value?: number; payload?: { month?: string; orders?: number } }>;
  average: number;
  surface: ReturnType<typeof getChartSurface>;
  theme: ChartTheme;
};

function OrdersTooltip({ active, payload, average, surface, theme }: TipProps) {
  if (!active || !payload?.length) return null;
  const point = payload[0];
  const orders = Number(point.value ?? 0);
  const vsAvg = average ? ((orders - average) / average) * 100 : 0;

  return (
    <div style={tooltipStyles(surface, theme)}>
      <p className="mb-1 font-semibold">{point.payload?.month}</p>
      <p>Orders: {formatInteger(orders)}</p>
      <p style={{ opacity: 0.75, marginTop: 2 }}>
        {vsAvg >= 0 ? "+" : ""}
        {vsAvg.toFixed(1)}% vs period avg ({formatInteger(Math.round(average))})
      </p>
    </div>
  );
}

export function OrdersBarChart() {
  const { series } = useDashboard();
  const { theme } = useAppTheme();
  const isDark = theme === "dark";
  const isRetro = theme === "retro";
  const surface = useMemo(() => getChartSurface(theme), [theme]);
  const colorScale = useMemo(() => buildOrdersColorScale(series, theme), [theme, series]);
  const summary = useMemo(() => summarizeOrders(series), [series]);

  return (
    <section className="rounded-[10px] border border-border bg-card p-4 shadow-xs">
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-[13px] font-semibold text-foreground">Monthly orders</h2>
          <p className="mt-0.5 text-[12px] text-muted-foreground">
            Volume by month with D3 sequential color scale (low → high)
          </p>
        </div>

        {series.length > 0 ? (
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
            <span className="tabular">
              Avg {formatInteger(Math.round(summary.average))}
            </span>
            <span className="tabular">Peak {formatInteger(summary.peak)}</span>
            <div className="flex items-center gap-1.5">
              <span>Low</span>
              <div
                className="h-2 w-20 rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${surface.barLow}, ${surface.barHigh})`,
                }}
                aria-hidden
              />
              <span>High</span>
            </div>
          </div>
        ) : null}
      </div>

      {series.length === 0 ? (
        <EmptyState
          title="No orders in this range"
          description="Widen or reset the date filter to see the chart."
        />
      ) : (
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={series}
              margin={{ top: 12, right: 8, left: 0, bottom: 4 }}
              barCategoryGap="18%"
            >
              <CartesianGrid
                stroke={surface.grid}
                vertical={false}
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tick={{ fill: surface.tick, fontSize: 12 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={44}
                tick={{ fill: surface.tick, fontSize: 12 }}
                tickFormatter={(value: number) => formatInteger(value)}
              />
              <Tooltip
                cursor={{ fill: surface.cursor }}
                content={
                  <OrdersTooltip
                    average={summary.average}
                    surface={surface}
                    theme={theme}
                  />
                }
              />
              <ReferenceLine
                y={summary.average}
                stroke={surface.reference}
                strokeDasharray="4 4"
                label={{
                  value: "avg",
                  position: "insideTopRight",
                  fill: surface.tick,
                  fontSize: 10,
                }}
              />
              <Bar
                dataKey="orders"
                radius={isRetro ? 0 : [5, 5, 0, 0]}
                maxBarSize={42}
                name="Orders"
                isAnimationActive={false}
              >
                {series.map((point) => (
                  <Cell
                    key={point.month}
                    fill={colorScale(point.orders)}
                    stroke={
                      isRetro
                        ? "#23203a"
                        : isDark
                          ? "rgba(255,255,255,0.04)"
                          : "rgba(15,23,42,0.04)"
                    }
                    strokeWidth={isRetro ? 2 : 1}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
