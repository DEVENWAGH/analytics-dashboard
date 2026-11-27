import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { DollarSign } from "lucide-react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, test, vi } from "vitest";
import TransactionsPage from "@/app/transactions/page";
import { DateRangeFilter } from "@/components/filters/DateRangeFilter";
import { TopNavbar } from "@/components/layout/TopNavbar";
import { StatCard } from "@/components/stats/StatCard";
import { StatusBadge } from "@/components/transactions/StatusBadge";
import { TransactionsTable } from "@/components/transactions/TransactionsTable";
import { DashboardProvider } from "@/context/DashboardContext";
import * as csvLib from "@/lib/csv";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("StatCard", () => {
  test("renders label, value, and positive percentage change", () => {
    render(<StatCard label="Revenue" value="$715,540" change={3.2} icon={DollarSign} />);

    expect(screen.getByText("Revenue")).toBeInTheDocument();
    expect(screen.getByText("$715,540")).toBeInTheDocument();
    expect(screen.getByText("+3.2%")).toBeInTheDocument();
    expect(screen.getByText("vs prior period")).toBeInTheDocument();
  });

  test("renders negative percentage change", () => {
    render(<StatCard label="Growth" value="-3.1%" change={-2.4} icon={DollarSign} />);
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

describe("TransactionsPage & TransactionsTable", () => {
  test("resets pagination when filters change and exports only the active filtered rows", () => {
    const downloadSpy = vi.spyOn(csvLib, "downloadCsv").mockImplementation(() => {});

    render(
      <MemoryRouter>
        <DashboardProvider>
          <TransactionsPage />
        </DashboardProvider>
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: /next page/i }));
    expect(screen.getByText(/^Page 2 of /)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/filter by status/i), {
      target: { value: "failed" },
    });
    expect(screen.getByText(/^Page 1 of /)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /export csv/i }));
    expect(downloadSpy).toHaveBeenCalledTimes(1);
    const csvContent = downloadSpy.mock.calls[0][1];
    const dataLines = csvContent.trim().split("\n").slice(1);
    expect(dataLines.length).toBeGreaterThan(0);
    expect(dataLines.every((line) => line.includes(",failed,"))).toBe(true);
  });
});

describe("TopNavbar", () => {
  test("syncs global search with TransactionsTable and toggles notifications dialog", () => {
    render(
      <MemoryRouter initialEntries={["/transactions"]}>
        <DashboardProvider>
          <TopNavbar title="Transactions" onMenuClick={() => {}} />
          <TransactionsTable />
        </DashboardProvider>
      </MemoryRouter>,
    );

    const navSearch = screen.getByLabelText(/search orders or customers/i);
    fireEvent.change(navSearch, { target: { value: "Ava Patel" } });
    expect(screen.getByLabelText(/search by customer or order id/i)).toHaveValue(
      "Ava Patel",
    );

    fireEvent.click(screen.getByRole("button", { name: /notifications/i }));
    expect(
      screen.getByRole("dialog", { name: /workspace notifications/i }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /mark all read/i }));
    expect(screen.getByText(/caught up/i)).toBeInTheDocument();
  });
});
