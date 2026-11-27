import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";
import { filterCustomers } from "@/lib/filters";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { cn, formatCurrency } from "@/lib/utils";

const PAGE_SIZE = 8;

const statusStyle = {
  active: "bg-success-soft text-success",
  new: "bg-accent-soft text-accent",
  churned: "bg-muted text-muted-foreground",
} as const;

export default function CustomersPage() {
  const {
    customers: customersList,
    loading,
    error,
    retry,
    search,
    setSearch,
  } = useDashboard();
  const [customerStatus, setCustomerStatus] = useState("all");
  const filterKey = `${search}|${customerStatus}`;
  const [pageState, setPageState] = useState({ key: filterKey, page: 1 });

  const rows = useMemo(
    () => filterCustomers(customersList, search, customerStatus),
    [customerStatus, customersList, search],
  );

  if (error) return <ErrorState message={error} onRetry={retry} />;
  if (loading) return <LoadingState label="Loading customers…" />;

  const currentPage = pageState.key === filterKey ? pageState.page : 1;
  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, pageCount);
  const pageRows = rows.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <section className="overflow-hidden rounded-[10px] border border-border bg-card shadow-xs">
      <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-[13px] font-semibold text-foreground">Customers</h2>
          <p className="mt-0.5 text-[12px] text-muted-foreground">
            {rows.length} customer{rows.length === 1 ? "" : "s"} in directory
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <label className="relative block min-w-[220px]">
            <span className="sr-only">Search customers by name, email, or ID</span>
            <Search
              className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPageState({ key: filterKey, page: 1 });
              }}
              placeholder="Search name, email, or ID"
              className="h-9 w-full rounded-[8px] border border-border bg-background pr-3 pl-8 text-[13px] outline-none focus:border-accent"
            />
          </label>

          <label className="block">
            <span className="sr-only">Filter customers by status</span>
            <select
              value={customerStatus}
              onChange={(e) => {
                setCustomerStatus(e.target.value);
                setPageState({ key: filterKey, page: 1 });
              }}
              className="h-9 w-full cursor-pointer rounded-[8px] border border-border bg-background px-2.5 text-[13px] outline-none focus:border-accent sm:w-[140px]"
            >
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="new">New</option>
              <option value="churned">Churned</option>
            </select>
          </label>
        </div>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          title="No customers found"
          description="Try another name or clear the customer status filter."
          action={
            <button
              type="button"
              className="cursor-pointer rounded-[8px] border border-border bg-card px-3 py-1.5 text-[12px] font-medium hover:bg-muted"
              onClick={() => {
                setSearch("");
                setCustomerStatus("all");
                setPageState({ key: filterKey, page: 1 });
              }}
            >
              Clear customer filters
            </button>
          }
        />
      ) : (
        <>
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
                {pageRows.map((customer) => (
                  <tr
                    key={customer.id}
                    className="border-t border-border transition-colors hover:bg-muted/40"
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
                    <td className="px-4 py-3 tabular text-foreground">
                      {customer.orders}
                    </td>
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

          <div className="flex items-center justify-between gap-3 border-t border-border px-4 py-3">
            <p className="text-[12px] text-muted-foreground">
              Page {safePage} of {pageCount}
            </p>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() =>
                  setPageState({
                    key: filterKey,
                    page: Math.max(1, safePage - 1),
                  })
                }
                className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-[8px] border border-border disabled:cursor-not-allowed disabled:opacity-40 hover:bg-muted"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                disabled={safePage >= pageCount}
                onClick={() =>
                  setPageState({
                    key: filterKey,
                    page: Math.min(pageCount, safePage + 1),
                  })
                }
                className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-[8px] border border-border disabled:cursor-not-allowed disabled:opacity-40 hover:bg-muted"
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
