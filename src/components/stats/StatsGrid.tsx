"use client";

import { DollarSign, Package, TrendingUp, Users } from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils";
import { StatCard } from "./StatCard";

export function StatsGrid() {
  const { stats } = useDashboard();

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Revenue"
        value={formatCurrency(stats.revenue)}
        change={stats.revenueChange}
        icon={DollarSign}
      />
      <StatCard
        label="Users"
        value={formatNumber(stats.users)}
        change={stats.usersChange}
        icon={Users}
      />
      <StatCard
        label="Orders"
        value={formatNumber(stats.orders)}
        change={stats.ordersChange}
        icon={Package}
      />
      <StatCard
        label="Growth"
        value={formatPercent(stats.growth)}
        change={stats.growthChange}
        icon={TrendingUp}
      />
    </div>
  );
}
