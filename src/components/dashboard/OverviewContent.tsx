"use client";

import dynamic from "next/dynamic";
import { useDashboard } from "@/context/DashboardContext";
import { DateRangeFilter } from "@/components/filters/DateRangeFilter";
import { StatsGrid } from "@/components/stats/StatsGrid";
import { TransactionsTable } from "@/components/transactions/TransactionsTable";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState, SkeletonCards } from "@/components/ui/LoadingState";

const RevenueLineChart = dynamic(
  () =>
    import("@/components/charts/RevenueLineChart").then(
      (mod) => mod.RevenueLineChart,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[372px] animate-pulse rounded-[10px] border border-border bg-card" />
    ),
  },
);

const OrdersBarChart = dynamic(
  () =>
    import("@/components/charts/OrdersBarChart").then((mod) => mod.OrdersBarChart),
  {
    ssr: false,
    loading: () => (
      <div className="h-[372px] animate-pulse rounded-[10px] border border-border bg-card" />
    ),
  },
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
            <RevenueLineChart />
            <OrdersBarChart />
          </div>
          <TransactionsTable />
        </>
      )}
    </div>
  );
}
