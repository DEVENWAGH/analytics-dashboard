"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Customer, MonthlyPoint, Transaction } from "@/data/mock";
import {
  computeStats,
  filterMonthlySeries,
  filterTransactions,
  validateDateRange,
  type DateRange,
} from "@/lib/filters";

type DataSource = "mongodb" | "mock";

type DashboardContextValue = {
  range: DateRange;
  setRange: (range: DateRange) => void;
  resetRange: () => void;
  rangeError: string | null;
  loading: boolean;
  error: string | null;
  retry: () => void;
  simulateError: () => void;
  source: DataSource | null;
  series: MonthlyPoint[];
  transactions: Transaction[];
  customers: Customer[];
  stats: ReturnType<typeof computeStats>;
};

type Payload = {
  series: MonthlyPoint[];
  transactions: Transaction[];
  customers: Customer[];
  source: DataSource;
};

const DashboardContext = createContext<DashboardContextValue | null>(null);

const emptyRange: DateRange = { start: "", end: "" };
const STORAGE_KEY = "northline-dashboard-snapshot";

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [range, setRange] = useState<DateRange>(emptyRange);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Payload | null>(null);
  const [requestKey, setRequestKey] = useState(0);

  useEffect(() => {
    let hasSnapshot = false;
    if (requestKey === 0) {
      try {
        const cached = sessionStorage.getItem(STORAGE_KEY);
        if (cached) {
          setData(JSON.parse(cached) as Payload);
          setLoading(false);
          hasSnapshot = true;
        }
      } catch {
        // ignore storage access issues
      }
    }

    const controller = new AbortController();
    if (!hasSnapshot) {
      setLoading(true);
    }
    setError(null);

    fetch("/api/dashboard", { signal: controller.signal, cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
        return res.json() as Promise<Payload>;
      })
      .then((payload) => {
        setData(payload);
        setLoading(false);
        try {
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        } catch {
          // ignore storage quota issues
        }
      })
      .catch((err: Error) => {
        if (err.name === "AbortError") return;
        if (!hasSnapshot) {
          setError(
            "Could not load dashboard data. Check that the dev server is running and try again.",
          );
        }
        setLoading(false);
      });

    return () => controller.abort();
  }, [requestKey]);

  const rangeError = useMemo(
    () => validateDateRange(range.start, range.end),
    [range.end, range.start],
  );

  const allSeries = data?.series;
  const allTransactions = data?.transactions;

  const series = useMemo(() => {
    if (!allSeries) return [];
    return rangeError ? allSeries : filterMonthlySeries(allSeries, range);
  }, [allSeries, range, rangeError]);

  const transactions = useMemo(() => {
    if (!allTransactions) return [];
    return rangeError
      ? allTransactions
      : filterTransactions(allTransactions, range, "", "all");
  }, [allTransactions, range, rangeError]);

  const stats = useMemo(() => computeStats(series, transactions), [series, transactions]);

  const resetRange = useCallback(() => setRange(emptyRange), []);

  const retry = useCallback(() => {
    setRequestKey((key) => key + 1);
  }, []);

  const simulateError = useCallback(() => {
    setError("Could not load dashboard data. Check your connection and try again.");
    setLoading(false);
  }, []);

  const value = useMemo(
    () => ({
      range,
      setRange,
      resetRange,
      rangeError,
      loading,
      error,
      retry,
      simulateError,
      source: data?.source ?? null,
      series,
      transactions,
      customers: data?.customers ?? [],
      stats,
    }),
    [
      data,
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
  if (!ctx) {
    throw new Error("useDashboard must be used within DashboardProvider");
  }
  return ctx;
}
