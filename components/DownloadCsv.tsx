"use client";

import type { OemReturn } from "@/lib/types";

function escapeCsv(value: string | null): string {
  if (value == null || value === "") return "";
  const s = String(value);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

const COLS = [
  "ticket_link",
  "order_number",
  "sku",
  "customer_name",
  "priority",
  "om_request",
  "status",
  "om_update",
  "last_follow_up",
  "request_date",
  "designated_om_agent",
] as const;

const HEADERS = [
  "Ticket link",
  "Order #",
  "SKU",
  "Customer",
  "Priority",
  "OM Request",
  "Status",
  "OM Update",
  "Last follow up",
  "Request date",
  "Designated OM agent",
];

interface DownloadCsvProps {
  rows: OemReturn[];
  disabled?: boolean;
  total?: number;
}

export function DownloadCsv({ rows, disabled }: DownloadCsvProps) {
  const handleDownload = () => {
    const header = HEADERS.join(",");
    const lines = rows.map((row) =>
      COLS.map((key) => escapeCsv(row[key] ?? null)).join(",")
    );
    const csv = [header, ...lines].join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `om-requests-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={disabled || rows.length === 0}
      className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-200 hover:bg-slate-700 disabled:opacity-50"
    >
      Download CSV ({rows.length} rows)
    </button>
  );
}
