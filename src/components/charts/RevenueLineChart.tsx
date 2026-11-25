"use client";

import { useMemo } from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useDashboard } from "@/context/DashboardContext";
import { useAppTheme } from "@/components/theme/useAppTheme";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatCurrency } from "@/lib/utils";
import { formatCompact, getChartSurface, tooltipStyles } from "@/lib/chartTheme";

export function RevenueLineChart() {
  const { series } = useDashboard();
  const { theme } = useAppTheme();
  const isRetro = theme === "retro";
  const surface = useMemo(() => getChartSurface(theme), [theme]);

  return (
    <section className="rounded-[10px] border border-border bg-card p-4 shadow-xs">
      <div className="mb-4">
        <h2 className="text-[13px] font-semibold text-foreground">Monthly revenue</h2>
        <p className="mt-0.5 text-[12px] text-muted-foreground">
          Gross volume trend with D3 compact axis formatting
        </p>
      </div>

      {series.length === 0 ? (
        <EmptyState
          title="No revenue in this range"
          description="Widen or reset the date filter to see the chart."
        />
      ) : (
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={series}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={surface.line} stopOpacity={0.28} />
                  <stop offset="100%" stopColor={surface.line} stopOpacity={0.02} />
                </linearGradient>
              </defs>
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
                width={52}
                tick={{ fill: surface.tick, fontSize: 12 }}
                tickFormatter={(value: number) => formatCompact(value)}
              />
              <Tooltip
                cursor={{ stroke: surface.reference, strokeDasharray: "4 4" }}
                contentStyle={tooltipStyles(surface, theme)}
                labelStyle={{ color: surface.tooltipText, fontWeight: 600 }}
                formatter={(value) => [formatCurrency(Number(value ?? 0)), "Revenue"]}
              />
              <Area
                type={isRetro ? "stepAfter" : "monotone"}
                dataKey="revenue"
                stroke="none"
                fill="url(#revenueFill)"
                tooltipType="none"
                isAnimationActive
              />
              <Line
                type={isRetro ? "stepAfter" : "monotone"}
                dataKey="revenue"
                stroke={surface.line}
                strokeWidth={isRetro ? 3 : 2.25}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0, fill: surface.line }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
