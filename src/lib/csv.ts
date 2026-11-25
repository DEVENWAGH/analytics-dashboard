import type { Transaction } from "@/data/mock";

const FORMULA_PREFIX = /^[=+\-@\t\r]/;

function csvCell(value: string | number) {
  let text = String(value);
  if (typeof value === "string" && FORMULA_PREFIX.test(text)) {
    text = `'${text}`;
  }
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function transactionsToCsv(rows: Transaction[]) {
  const header = ["Order ID", "Customer", "Email", "Date", "Method", "Status", "Amount"];
  const lines = rows.map((row) =>
    [row.id, row.customer, row.email, row.date, row.method, row.status, row.amount]
      .map(csvCell)
      .join(","),
  );

  return [header.join(","), ...lines].join("\n");
}

export function downloadCsv(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
