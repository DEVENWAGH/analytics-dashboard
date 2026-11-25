import { lazy, Suspense } from "react";
import { DateRangeFilter } from "@/components/filters/DateRangeFilter";
import { StatsGrid } from "@/components/stats/StatsGrid";
import { TransactionsTable } from "@/components/transactions/TransactionsTable";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState, SkeletonCards } from "@/components/ui/LoadingState";
import { useDashboard } from "@/context/DashboardContext";

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

export function OverviewContent() {
  const { loading, error, retry } = useDashboard();

  return (
    <div className="space-y-4">
      <DateRangeFilter />
      {error ? (
        <ErrorState message={error} onRetry={retry} />
      ) : loading ? (
        <>
          <SkeletonCards />
          <LoadingState />
        </>
      ) : (
        <>
          <StatsGrid />
          <div className="grid gap-4 xl:grid-cols-2">
            <Suspense fallback={chartFallback}>
              <RevenueLineChart />
            </Suspense>
            <Suspense fallback={chartFallback}>
              <OrdersBarChart />
            </Suspense>
          </div>
          <TransactionsTable />
        </>
      )}
    </div>
  );
}
