import type { Transaction } from "@/data/mock";

const FORMULA_PREFIX = /^(?:\s*[=+\-@]|[\t\r\n])/;

function csvCell(value: string | number) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? String(value) : "";
  }

  let text = String(value);
  if (FORMULA_PREFIX.test(text)) {
    text = `'${text}`;
  }
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function sanitizeFilename(filename: string) {
  const cleaned = filename.replace(/[^a-zA-Z0-9._-]/g, "_").replace(/^\.+/, "");
  return cleaned.length > 0 ? cleaned : "export.csv";
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
  link.download = sanitizeFilename(filename);
  link.rel = "noopener";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
