import { lazy, Suspense } from "react";
import { DateRangeFilter } from "@/components/filters/DateRangeFilter";
import { StatsGrid } from "@/components/stats/StatsGrid";
import { useDashboard } from "@/context/DashboardContext";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState, SkeletonCards } from "@/components/ui/LoadingState";

const RevenueLineChart = lazy(() =>
  import("@/components/charts/RevenueLineChart").then((mod) => ({
    default: mod.RevenueLineChart,
  })),
);

const OrdersBarChart = lazy(() =>
  import("@/components/charts/OrdersBarChart").then((mod) => ({
    default: mod.OrdersBarChart,
  })),
);

const chartFallback = (
  <div className="h-[372px] animate-pulse rounded-[10px] border border-border bg-card" />
);

export default function AnalyticsPage() {
  const { loading, error, retry, series, stats } = useDashboard();

  if (error) return <ErrorState message={error} onRetry={retry} />;
  if (loading) {
    return (
      <div className="space-y-4">
        <SkeletonCards />
        <LoadingState label="Loading analytics…" />
      </div>
    );
  }

  const avgOrder = stats.orders ? stats.revenue / stats.orders : 0;

  return (
    <div className="space-y-4">
      <DateRangeFilter />
      <StatsGrid />

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-[10px] border border-border bg-card p-4">
          <p className="text-[12px] text-muted-foreground">Months in view</p>
          <p className="mt-1 text-[20px] font-semibold tabular">{series.length}</p>
        </div>
        <div className="rounded-[10px] border border-border bg-card p-4">
          <p className="text-[12px] text-muted-foreground">Avg order value</p>
          <p className="mt-1 text-[20px] font-semibold tabular">
            {avgOrder.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0,
            })}
          </p>
        </div>
        <div className="rounded-[10px] border border-border bg-card p-4">
          <p className="text-[12px] text-muted-foreground">Completion rate</p>
          <p className="mt-1 text-[20px] font-semibold tabular">
            {stats.completedRate.toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Suspense fallback={chartFallback}>
          <RevenueLineChart />
        </Suspense>
        <Suspense fallback={chartFallback}>
          <OrdersBarChart />
        </Suspense>
      </div>
    </div>
  );
}
