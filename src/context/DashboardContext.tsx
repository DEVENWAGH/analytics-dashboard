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
} from "@/data/mock";
import {
  computeStats,
  filterMonthlySeries,
  filterTransactions,
  validateDateRange,
  type DateRange,
} from "@/lib/filters";

type DataSource = "sample";

type DashboardContextValue = {
  range: DateRange;
  setRange: (range: DateRange) => void;
  resetRange: () => void;
  rangeError: string | null;
  loading: boolean;
  error: string | null;
  retry: () => void;
  simulateError: () => void;
  source: DataSource;
  series: MonthlyPoint[];
  transactions: Transaction[];
  customers: Customer[];
  stats: ReturnType<typeof computeStats>;
};

const DashboardContext = createContext<DashboardContextValue | null>(null);

const emptyRange: DateRange = { start: "", end: "" };

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [range, setRange] = useState<DateRange>(emptyRange);
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

  const stats = useMemo(() => computeStats(series, transactions), [series, transactions]);

  const resetRange = useCallback(() => setRange(emptyRange), []);

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
      loading,
      error,
      retry,
      simulateError,
      source: "sample",
      series,
      transactions,
      customers: customersList,
      stats,
    }),
    [
      error,
      loading,
      range,
      rangeError,
      resetRange,
      retry,
      series,
      simulateError,
      stats,
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
