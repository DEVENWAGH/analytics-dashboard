import {
  endOfDay,
  endOfMonth,
  isAfter,
  isBefore,
  isValid,
  parseISO,
  startOfDay,
  startOfMonth,
} from "date-fns";
import type { Customer, MonthlyPoint, Transaction } from "@/data/mock";

export type DateRange = {
  start: string;
  end: string;
};

export function parseDate(value: string) {
  if (!value) return null;
  const parsed = parseISO(value);
  return isValid(parsed) ? parsed : null;
}

export function validateDateRange(start: string, end: string): string | null {
  if (!start && !end) return null;
  if ((start && !end) || (!start && end)) {
    return "Select both a start and end date.";
  }

  const startDate = parseDate(start);
  const endDate = parseDate(end);

  if (!startDate || !endDate) {
    return "Enter valid dates.";
  }

  if (isAfter(startOfDay(startDate), startOfDay(endDate))) {
    return "Start date cannot be after end date.";
  }

  return null;
}

export function filterMonthlySeries(series: MonthlyPoint[], range: DateRange) {
  const error = validateDateRange(range.start, range.end);
  if (error || !range.start || !range.end) return series;

  const start = startOfDay(parseDate(range.start)!);
  const end = endOfDay(parseDate(range.end)!);

  return series.filter((point) => {
    const date = parseDate(point.date)!;
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    return !isBefore(monthEnd, start) && !isAfter(monthStart, end);
  });
}

export function filterTransactions(
  rows: Transaction[],
  range: DateRange,
  search: string,
  status: string,
) {
  const query = search.trim().toLowerCase();
  const rangeError = validateDateRange(range.start, range.end);
  const hasRange = !rangeError && range.start && range.end;
  const start = hasRange ? startOfDay(parseDate(range.start)!) : null;
  const end = hasRange ? endOfDay(parseDate(range.end)!) : null;

  return rows.filter((row) => {
    if (status !== "all" && row.status !== status) return false;

    if (query) {
      const matchesCustomer = row.customer.toLowerCase().includes(query);
      const matchesId = row.id.toLowerCase().includes(query);
      const matchesEmail = row.email.toLowerCase().includes(query);
      if (!matchesCustomer && !matchesId && !matchesEmail) return false;
    }

    if (start && end) {
      const date = parseDate(row.date)!;
      if (isBefore(date, start) || isAfter(date, end)) return false;
    }

    return true;
  });
}

export function filterCustomers(rows: Customer[], search: string, status: string) {
  const query = search.trim().toLowerCase();

  return rows.filter((row) => {
    if (status !== "all" && row.status !== status) return false;

    if (query) {
      const matchesName = row.name.toLowerCase().includes(query);
      const matchesEmail = row.email.toLowerCase().includes(query);
      const matchesId = row.id.toLowerCase().includes(query);
      if (!matchesName && !matchesEmail && !matchesId) return false;
    }

    return true;
  });
}

function computeSeriesAverageChange(values: number[]) {
  if (values.length < 2) return 0;
  const overallAvg = values.reduce((sum, value) => sum + value, 0) / values.length;
  const priorValues = values.slice(0, -1);
  const priorAvg =
    priorValues.reduce((sum, value) => sum + value, 0) / priorValues.length;
  if (priorAvg === 0) return 0;
  const change = ((overallAvg - priorAvg) / priorAvg) * 100;
  return Number.isFinite(change) ? change : 0;
}

export function computeStats(series: MonthlyPoint[], transactions: Transaction[]) {
  const revenue = series.reduce((sum, point) => sum + point.revenue, 0);
  const orders = series.reduce((sum, point) => sum + point.orders, 0);
  const users = series.length ? series[series.length - 1].users : 0;

  const completed = transactions.filter((t) => t.status === "completed").length;
  const growth =
    series.length >= 2 && series[series.length - 2].revenue !== 0
      ? ((series[series.length - 1].revenue - series[series.length - 2].revenue) /
          series[series.length - 2].revenue) *
        100
      : 0;

  const revenueChange = computeSeriesAverageChange(series.map((point) => point.revenue));
  const usersChange = computeSeriesAverageChange(series.map((point) => point.users));
  const ordersChange = computeSeriesAverageChange(series.map((point) => point.orders));

  return {
    revenue,
    users,
    orders,
    growth,
    revenueChange,
    usersChange,
    ordersChange,
    growthChange: growth,
    completedRate: transactions.length ? (completed / transactions.length) * 100 : 0,
  };
}
