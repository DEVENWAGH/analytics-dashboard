import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { DollarSign } from "lucide-react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { DateRangeFilter } from "@/components/filters/DateRangeFilter";
import { StatCard } from "@/components/stats/StatCard";
import { StatusBadge } from "@/components/transactions/StatusBadge";
import { DashboardProvider } from "@/context/DashboardContext";
import { customersList, monthlySeries, transactions } from "@/data/mock";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("StatCard", () => {
  test("renders label, value, and positive percentage change", () => {
    render(
      <StatCard label="Revenue" value="$715,540" change={3.2} icon={DollarSign} />,
    );

    expect(screen.getByText("Revenue")).toBeInTheDocument();
    expect(screen.getByText("$715,540")).toBeInTheDocument();
    expect(screen.getByText("+3.2%")).toBeInTheDocument();
    expect(screen.getByText("vs prior period")).toBeInTheDocument();
  });

  test("renders negative percentage change", () => {
    render(
      <StatCard label="Growth" value="-3.1%" change={-2.4} icon={DollarSign} />,
    );
    expect(screen.getByText("-3.1%")).toBeInTheDocument();
    expect(screen.getByText("-2.4%")).toBeInTheDocument();
  });
});

describe("StatusBadge", () => {
  test("renders transaction status text", () => {
    render(<StatusBadge status="completed" />);
    expect(screen.getByText("completed")).toBeInTheDocument();
  });
});

describe("DateRangeFilter", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          series: monthlySeries,
          transactions,
          customers: customersList,
          source: "mock",
        }),
      }),
    );
  });

  test("shows validation error when start date is after end date and resets cleanly", () => {
    render(
      <DashboardProvider>
        <DateRangeFilter />
      </DashboardProvider>,
    );

    const startInput = screen.getByLabelText("Start");
    const endInput = screen.getByLabelText("End");

    fireEvent.change(startInput, { target: { value: "2026-08-01" } });
    fireEvent.change(endInput, { target: { value: "2026-02-01" } });

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Start date cannot be after end date.",
    );

    fireEvent.click(screen.getByRole("button", { name: /reset/i }));
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
