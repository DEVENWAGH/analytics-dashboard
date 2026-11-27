import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  customersList,
  monthlySeries,
  transactions as mockTransactions,
  type Customer,
  type MonthlyPoint,
  type Transaction,
  type TransactionStatus,
} from "@/data/mock";
import {
  computeStats,
  filterMonthlySeries,
  filterTransactions,
  validateDateRange,
  type DateRange,
} from "@/lib/filters";

type DataSource = "sample";
export type TransactionStatusFilter = "all" | TransactionStatus;

type DashboardContextValue = {
  range: DateRange;
  setRange: (range: DateRange) => void;
  resetRange: () => void;
  rangeError: string | null;
  search: string;
  setSearch: (value: string) => void;
  status: TransactionStatusFilter;
  setStatus: (value: TransactionStatusFilter) => void;
  clearTransactionFilters: () => void;
  loading: boolean;
  error: string | null;
  retry: () => void;
  simulateError: () => void;
  source: DataSource;
  series: MonthlyPoint[];
  transactions: Transaction[];
  filteredTransactions: Transaction[];
  customers: Customer[];
  stats: ReturnType<typeof computeStats>;
};

const DashboardContext = createContext<DashboardContextValue | null>(null);

const emptyRange: DateRange = { start: "", end: "" };

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [range, setRange] = useState<DateRange>(emptyRange);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<TransactionStatusFilter>("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading) return;
    const timer = setTimeout(() => {
      setLoading(false);
    }, 250);
    return () => clearTimeout(timer);
  }, [loading]);

  const rangeError = useMemo(
    () => validateDateRange(range.start, range.end),
    [range.end, range.start],
  );

  const series = useMemo(() => {
    return rangeError ? monthlySeries : filterMonthlySeries(monthlySeries, range);
  }, [range, rangeError]);

  const transactions = useMemo(() => {
    return rangeError
      ? mockTransactions
      : filterTransactions(mockTransactions, range, "", "all");
  }, [range, rangeError]);

  const filteredTransactions = useMemo(() => {
    return filterTransactions(transactions, emptyRange, search, status);
  }, [search, status, transactions]);

  const stats = useMemo(() => computeStats(series, transactions), [series, transactions]);

  const resetRange = useCallback(() => setRange(emptyRange), []);

  const clearTransactionFilters = useCallback(() => {
    setSearch("");
    setStatus("all");
  }, []);

  const retry = useCallback(() => {
    setError(null);
    setLoading(true);
  }, []);

  const simulateError = useCallback(() => {
    setLoading(false);
    setError(
      "Simulated dashboard error: unable to load analytics data. Click Try again to recover.",
    );
  }, []);

  const value = useMemo<DashboardContextValue>(
    () => ({
      range,
      setRange,
      resetRange,
      rangeError,
      search,
      setSearch,
      status,
      setStatus,
      clearTransactionFilters,
      loading,
      error,
      retry,
      simulateError,
      source: "sample",
      series,
      transactions,
      filteredTransactions,
      customers: customersList,
      stats,
    }),
    [
      clearTransactionFilters,
      error,
      filteredTransactions,
      loading,
      range,
      rangeError,
      resetRange,
      retry,
      search,
      series,
      simulateError,
      stats,
      status,
      transactions,
    ],
  );

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used within DashboardProvider");
  return ctx;
}
