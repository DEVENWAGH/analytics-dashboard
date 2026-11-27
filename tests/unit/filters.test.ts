import { describe, expect, test } from "vitest";
import { customersList, monthlySeries, transactions } from "@/data/mock";
import { transactionsToCsv } from "@/lib/csv";
import {
  computeStats,
  filterCustomers,
  filterMonthlySeries,
  filterTransactions,
  validateDateRange,
} from "@/lib/filters";

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
  test("filters months overlapping inclusive date range (including mid-month ranges)", () => {
    const filtered = filterMonthlySeries(monthlySeries, {
      start: "2026-03-01",
      end: "2026-05-31",
    });
    expect(filtered.map((m) => m.month)).toEqual(["Mar", "Apr", "May"]);

    const midMonth = filterMonthlySeries(monthlySeries, {
      start: "2026-06-02",
      end: "2026-06-30",
    });
    expect(midMonth.map((m) => m.month)).toEqual(["Jun"]);
  });

  test("returns empty array for out-of-range valid dates and full series for invalid range", () => {
    const outOfRange = filterMonthlySeries(monthlySeries, {
      start: "2025-01-01",
      end: "2025-12-31",
    });
    expect(outOfRange).toEqual([]);

    const invalid = filterMonthlySeries(monthlySeries, {
      start: "2026-08-01",
      end: "2026-02-01",
    });
    expect(invalid.length).toBe(monthlySeries.length);
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

describe("filterCustomers", () => {
  test("filters by name, email, ID, and status", () => {
    const activeOnly = filterCustomers(customersList, "", "active");
    expect(activeOnly.length).toBeGreaterThan(0);
    expect(activeOnly.every((c) => c.status === "active")).toBe(true);

    const byName = filterCustomers(customersList, "Ava", "all");
    expect(byName.some((c) => c.name === "Ava Patel")).toBe(true);
  });
});

describe("computeStats", () => {
  test("computes totals, dynamic deltas, and completion rate", () => {
    const stats = computeStats(monthlySeries, transactions);
    expect(stats.revenue).toBe(
      monthlySeries.reduce((sum, item) => sum + item.revenue, 0),
    );
    expect(stats.orders).toBe(monthlySeries.reduce((sum, item) => sum + item.orders, 0));
    expect(stats.users).toBe(monthlySeries[monthlySeries.length - 1].users);
    expect(stats.usersChange).toBeGreaterThan(0);
    expect(stats.ordersChange).toBeGreaterThan(0);
    expect(stats.completedRate).toBeGreaterThan(0);
  });

  test("handles empty and single-month inputs without hardcoded deltas", () => {
    const empty = computeStats([], []);
    expect(empty.revenue).toBe(0);
    expect(empty.orders).toBe(0);
    expect(empty.users).toBe(0);
    expect(empty.revenueChange).toBe(0);
    expect(empty.usersChange).toBe(0);
    expect(empty.ordersChange).toBe(0);
    expect(empty.completedRate).toBe(0);

    const single = computeStats([monthlySeries[0]], []);
    expect(single.revenueChange).toBe(0);
    expect(single.usersChange).toBe(0);
    expect(single.ordersChange).toBe(0);
    expect(single.growth).toBe(0);
  });
});

describe("transactionsToCsv", () => {
  test("escapes quotes, commas, and formula prefixes", () => {
    const csv = transactionsToCsv([
      {
        id: "ORD-1",
        customer: '=HYPERLINK("x")',
        email: "a@example.com",
        amount: 120,
        status: "completed",
        date: "2026-01-15",
        method: "Visa, Corp",
      },
    ]);
    const lines = csv.split("\n");
    expect(lines[0]).toBe("Order ID,Customer,Email,Date,Method,Status,Amount");
    expect(lines[1]).toContain('"\'=HYPERLINK(""x"")"');
    expect(lines[1]).toContain('"Visa, Corp"');
  });
});
