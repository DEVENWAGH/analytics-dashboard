"use client";

import { useDashboard } from "@/context/DashboardContext";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { cn, formatCurrency } from "@/lib/utils";

const statusStyle = {
  active: "bg-success-soft text-success",
  new: "bg-accent-soft text-accent",
  churned: "bg-muted text-muted-foreground",
} as const;

export default function CustomersPage() {
  const { customers: customersList, loading, error, retry } = useDashboard();

  if (error) return <ErrorState message={error} onRetry={retry} />;
  if (loading) return <LoadingState label="Loading customers…" />;

  return (
    <section className="overflow-hidden rounded-[10px] border border-border bg-card shadow-xs">
      <div className="border-b border-border p-4">
        <h2 className="text-[13px] font-semibold text-foreground">Customers</h2>
        <p className="mt-0.5 text-[12px] text-muted-foreground">
          Customer directory loaded from the database
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-[13px]">
          <thead className="bg-muted/70 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
            <tr>
              <th className="px-4 py-2.5 font-medium">Customer</th>
              <th className="px-4 py-2.5 font-medium">Joined</th>
              <th className="px-4 py-2.5 font-medium">Orders</th>
              <th className="px-4 py-2.5 font-medium">Status</th>
              <th className="px-4 py-2.5 text-right font-medium">Spent</th>
            </tr>
          </thead>
          <tbody>
            {customersList.map((customer) => (
              <tr
                key={customer.id}
                className="border-t border-border hover:bg-muted/40"
              >
                <td className="px-4 py-3">
                  <div className="font-medium text-foreground">{customer.name}</div>
                  <div className="text-[12px] text-muted-foreground">
                    {customer.email}
                  </div>
                </td>
                <td className="px-4 py-3 tabular text-muted-foreground">
                  {customer.joined}
                </td>
                <td className="px-4 py-3 tabular text-foreground">{customer.orders}</td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium capitalize",
                      statusStyle[customer.status],
                    )}
                  >
                    {customer.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-medium tabular">
                  {formatCurrency(customer.spent)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
