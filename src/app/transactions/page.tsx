import { Download } from "lucide-react";
import { DateRangeFilter } from "@/components/filters/DateRangeFilter";
import { TransactionsTable } from "@/components/transactions/TransactionsTable";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { useDashboard } from "@/context/DashboardContext";
import { downloadCsv, transactionsToCsv } from "@/lib/csv";

export default function TransactionsPage() {
  const { loading, error, retry, filteredTransactions } = useDashboard();

  if (error) return <ErrorState message={error} onRetry={retry} />;
  if (loading) return <LoadingState label="Loading transactions…" />;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xl text-[13px] text-muted-foreground">
          Search by customer name or order ID, filter by status, and export the active
          filtered set ({filteredTransactions.length} row
          {filteredTransactions.length === 1 ? "" : "s"}) as CSV.
        </p>
        <div className="flex flex-wrap gap-2 self-start">
          <a
            href="/sample-transactions.csv"
            download
            className="inline-flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-[8px] border border-border bg-card px-3 text-[13px] font-medium text-foreground transition hover:bg-muted"
          >
            <Download className="h-3.5 w-3.5" aria-hidden />
            Sample CSV
          </a>
          <button
            type="button"
            disabled={filteredTransactions.length === 0}
            onClick={() =>
              downloadCsv(
                "transactions-export.csv",
                transactionsToCsv(filteredTransactions),
              )
            }
            className="inline-flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-[8px] bg-accent px-3 text-[13px] font-medium text-white transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download className="h-3.5 w-3.5" aria-hidden />
            Export CSV
          </button>
        </div>
      </div>
      <DateRangeFilter />
      <TransactionsTable />
    </div>
  );
}
