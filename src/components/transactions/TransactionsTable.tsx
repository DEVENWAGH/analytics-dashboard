"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";
import { filterTransactions } from "@/lib/filters";
import { formatCurrency } from "@/lib/utils";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "./StatusBadge";

const PAGE_SIZE = 8;

export function TransactionsTable() {
  const { transactions: ranged, range, rangeError } = useDashboard();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  const rows = useMemo(() => {
    const source = rangeError ? ranged : ranged;
    return filterTransactions(
      source,
      rangeError ? { start: "", end: "" } : range,
      search,
      status,
    );
  }, [range, rangeError, ranged, search, status]);

  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageRows = rows.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <section className="overflow-hidden rounded-[10px] border border-border bg-card shadow-xs">
      <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-[13px] font-semibold text-foreground">Transactions</h2>
          <p className="mt-0.5 text-[12px] text-muted-foreground">
            {rows.length} result{rows.length === 1 ? "" : "s"}
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <label className="relative block min-w-[220px]">
            <span className="sr-only">Search by customer or order ID</span>
            <Search
              className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search customer or order ID"
              className="h-9 w-full rounded-[8px] border border-border bg-background pr-3 pl-8 text-[13px] outline-none focus:border-accent"
            />
          </label>

          <label className="block">
            <span className="sr-only">Filter by status</span>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="h-9 w-full cursor-pointer rounded-[8px] border border-border bg-background px-2.5 text-[13px] outline-none focus:border-accent sm:w-[140px]"
            >
              <option value="all">All statuses</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </label>
        </div>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          title="No transactions found"
          description="Try another search, clear the status filter, or reset the date range."
          action={
            <button
              type="button"
              className="cursor-pointer rounded-[8px] border border-border bg-card px-3 py-1.5 text-[12px] font-medium hover:bg-muted"
              onClick={() => {
                setSearch("");
                setStatus("all");
                setPage(1);
              }}
            >
              Clear table filters
            </button>
          }
        />
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-[13px]">
              <thead className="bg-muted/70 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Order</th>
                  <th className="px-4 py-2.5 font-medium">Customer</th>
                  <th className="px-4 py-2.5 font-medium">Date</th>
                  <th className="px-4 py-2.5 font-medium">Method</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                  <th className="px-4 py-2.5 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-t border-border transition-colors hover:bg-muted/40"
                  >
                    <td className="px-4 py-3 font-medium text-foreground">{row.id}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground">{row.customer}</div>
                      <div className="text-[12px] text-muted-foreground">{row.email}</div>
                    </td>
                    <td className="px-4 py-3 tabular text-muted-foreground">
                      {row.date}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{row.method}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={row.status} />
                    </td>
                    <td className="px-4 py-3 text-right font-medium tabular text-foreground">
                      {formatCurrency(row.amount)}
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
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-[8px] border border-border disabled:cursor-not-allowed disabled:opacity-40 hover:bg-muted"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                disabled={safePage >= pageCount}
                onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
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
