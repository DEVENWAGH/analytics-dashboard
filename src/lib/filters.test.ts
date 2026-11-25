import { describe, expect, test } from "vitest";
import { monthlySeries, transactions } from "@/data/mock";
import { transactionsToCsv } from "./csv";
import {
  computeStats,
  filterMonthlySeries,
  filterTransactions,
  validateDateRange,
} from "./filters";

describe("validateDateRange", () => {
  test("returns null for empty or valid ranges", () => {
    expect(validateDateRange("", "")).toBeNull();
    expect(validateDateRange("2026-01-01", "2026-03-31")).toBeNull();
  });

  test("requires both start and end dates", () => {
    expect(validateDateRange("2026-01-01", "")).toBe("Select both a start and end date.");
    expect(validateDateRange("", "2026-03-31")).toBe("Select both a start and end date.");
  });

  test("rejects start date after end date and invalid strings", () => {
    expect(validateDateRange("2026-05-01", "2026-01-01")).toBe(
      "Start date cannot be after end date.",
    );
    expect(validateDateRange("not-a-date", "2026-01-01")).toBe("Enter valid dates.");
  });
});

describe("filterMonthlySeries", () => {
  test("filters months within inclusive date range", () => {
    const filtered = filterMonthlySeries(monthlySeries, {
      start: "2026-03-01",
      end: "2026-05-31",
    });
    expect(filtered.map((m) => m.month)).toEqual(["Mar", "Apr", "May"]);
  });

  test("returns full series when range is invalid", () => {
    const filtered = filterMonthlySeries(monthlySeries, {
      start: "2026-08-01",
      end: "2026-02-01",
    });
    expect(filtered.length).toBe(monthlySeries.length);
  });
});

describe("filterTransactions", () => {
  test("filters by customer name, order ID, status, and date range", () => {
    const byStatus = filterTransactions(
      transactions,
      { start: "", end: "" },
      "",
      "completed",
    );
    expect(byStatus.length).toBeGreaterThan(0);
    expect(byStatus.every((row) => row.status === "completed")).toBe(true);

    const first = transactions[0];
    const byId = filterTransactions(
      transactions,
      { start: "", end: "" },
      first.id,
      "all",
    );
    expect(byId.length).toBe(1);
    expect(byId[0].id).toBe(first.id);
  });
});

describe("computeStats", () => {
  test("computes totals and completion rate", () => {
    const stats = computeStats(monthlySeries, transactions);
    expect(stats.revenue).toBe(
      monthlySeries.reduce((sum, item) => sum + item.revenue, 0),
    );
    expect(stats.orders).toBe(
      monthlySeries.reduce((sum, item) => sum + item.orders, 0),
    );
    expect(stats.users).toBe(monthlySeries[monthlySeries.length - 1].users);
    expect(stats.completedRate).toBeGreaterThan(0);
  });

  test("handles empty inputs safely", () => {
    const stats = computeStats([], []);
    expect(stats.revenue).toBe(0);
    expect(stats.orders).toBe(0);
    expect(stats.users).toBe(0);
    expect(stats.completedRate).toBe(0);
  });
});

describe("transactionsToCsv", () => {
  test("escapes quotes, commas, and formula prefixes", () => {
    const csv = transactionsToCsv([
      {
        id: "ORD-1",
        customer: "=HYPERLINK(\"x\")",
        email: "a@example.com",
        amount: 120,
        status: "completed",
        date: "2026-01-15",
        method: "Visa, Corp",
      },
    ]);
    const lines = csv.split("\n");
    expect(lines[0]).toBe("Order ID,Customer,Email,Date,Method,Status,Amount");
    expect(lines[1]).toContain("\"'=HYPERLINK(\"\"x\"\")\"");
    expect(lines[1]).toContain("\"Visa, Corp\"");
  });
});
