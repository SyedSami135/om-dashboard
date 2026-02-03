"use client";

import { useCallback, useState } from "react";
import { DownloadCsv } from "./DownloadCsv";
import { OmUpdateModal } from "./OmUpdateModal";
import type { OemReturn } from "@/lib/types";

const STATUS_OPTIONS = ["Open", "In Progress", "Inprogress", "Closed"] as const;

const COLS = [
  { key: "ticket_link", label: "Ticket link" },
  { key: "order_number", label: "Order #" },
  { key: "sku", label: "SKU" },
  { key: "customer_name", label: "Customer" },
  { key: "priority", label: "Priority" },
  { key: "om_request", label: "OM Request" },
  { key: "status", label: "Status" },
  { key: "om_update", label: "OM Update" },
  { key: "last_follow_up", label: "Last follow up" },
  { key: "request_date", label: "Request date" },
  { key: "designated_om_agent", label: "Designated OM agent" },
] as const;

interface ReturnsTableProps {
  rows: OemReturn[];
  total: number;
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onSortChange: (sortBy: string, sortOrder: "asc" | "desc") => void;
  onUpdate: (
    ticketLink: string,
    payload: { status?: string; om_update?: string; designated_om_agent?: string | null }
  ) => Promise<void>;
  loading?: boolean;
}

function formatCell(value: string | null): string {
  if (value == null || value === "") return "—";
  return value;
}

function formatTimestamp(value: string | null): string {
  if (value == null || value === "") return "—";
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleString(undefined, {
      dateStyle: "short",
      timeStyle: "short",
    });
  } catch {
    return value;
  }
}

export function ReturnsTable({
  rows,
  total,
  page,
  limit,
  sortBy,
  sortOrder,
  onPageChange,
  onLimitChange,
  onSortChange,
  onUpdate,
  loading,
}: ReturnsTableProps) {
  const [limitInput, setLimitInput] = useState(String(limit));
  const [omUpdateRow, setOmUpdateRow] = useState<OemReturn | null>(null);
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null);
  const [agentUpdating, setAgentUpdating] = useState<string | null>(null);
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  const handleSort = useCallback(
    (col: string) => {
      const nextOrder =
        sortBy === col && sortOrder === "desc" ? "asc" : "desc";
      onSortChange(col, nextOrder);
    },
    [sortBy, sortOrder, onSortChange]
  );

  const handleLimitSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const n = parseInt(limitInput, 10);
      if (!Number.isNaN(n) && n >= 10 && n <= 200) onLimitChange(n);
    },
    [limitInput, onLimitChange]
  );

  const handleStatusChange = useCallback(
    async (ticketLink: string, newStatus: string) => {
      setStatusUpdating(ticketLink);
      try {
        await onUpdate(ticketLink, { status: newStatus });
      } finally {
        setStatusUpdating(null);
      }
    },
    [onUpdate]
  );

  const handleOmUpdateSave = useCallback(
    async (ticketLink: string, omUpdate: string) => {
      await onUpdate(ticketLink, { om_update: omUpdate });
      setOmUpdateRow(null);
    },
    [onUpdate]
  );

  const handleDesignatedAgentBlur = useCallback(
    async (ticketLink: string, value: string) => {
      setAgentUpdating(ticketLink);
      try {
        await onUpdate(ticketLink, {
          designated_om_agent: value.trim() || null,
        });
      } finally {
        setAgentUpdating(null);
      }
    },
    [onUpdate]
  );

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-700 bg-slate-800/80 p-6">
        <div className="h-8 w-48 animate-pulse rounded bg-slate-600" />
        <div className="mt-4 space-y-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-10 animate-pulse rounded bg-slate-700" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-xl border border-slate-700 bg-slate-800/80 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-700 p-4">
          <p className="text-sm text-slate-400">
            Showing <span className="font-medium text-slate-200">{from}</span>–
            <span className="font-medium text-slate-200">{to}</span> of{" "}
            <span className="font-medium text-slate-200">{total.toLocaleString()}</span> requests
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <DownloadCsv rows={rows} total={total} disabled={loading} />
            <form onSubmit={handleLimitSubmit} className="flex items-center gap-2">
              <label className="text-sm text-slate-400">Rows:</label>
              <input
                type="number"
                min={10}
                max={200}
                value={limitInput}
                onChange={(e) => setLimitInput(e.target.value)}
                className="w-16 rounded border border-slate-600 bg-slate-900 px-2 py-1 text-center text-slate-100"
              />
              <button
                type="submit"
                className="rounded bg-slate-700 px-2 py-1 text-sm text-slate-200 hover:bg-slate-600"
              >
                OK
              </button>
            </form>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onPageChange(1)}
                disabled={page <= 1}
                className="rounded border border-slate-600 px-2 py-1 text-sm disabled:opacity-40"
              >
                First
              </button>
              <button
                type="button"
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1}
                className="rounded border border-slate-600 px-2 py-1 text-sm disabled:opacity-40"
              >
                Prev
              </button>
              <span className="px-2 text-sm text-slate-400">
                Page {page} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages}
                className="rounded border border-slate-600 px-2 py-1 text-sm disabled:opacity-40"
              >
                Next
              </button>
              <button
                type="button"
                onClick={() => onPageChange(totalPages)}
                disabled={page >= totalPages}
                className="rounded border border-slate-600 px-2 py-1 text-sm disabled:opacity-40"
              >
                Last
              </button>
            </div>
          </div>
        </div>

        <div className="table-wrap overflow-x-auto p-4">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-600">
                {COLS.map(({ key, label }) => (
                  <th
                    key={key}
                    className="cursor-pointer whitespace-nowrap py-3 pr-4 font-medium text-slate-400 hover:text-cyan-400"
                    onClick={() => handleSort(key)}
                  >
                    {label}
                    {sortBy === key && (
                      <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={COLS.length} className="py-8 text-center text-slate-500">
                    No requests match the current filters.
                  </td>
                </tr>
              ) : (
                rows.map((row, i) => (
                  <tr
                    key={row.ticket_link + String(i)}
                    className="border-b border-slate-700/80 hover:bg-slate-700/40"
                  >
                    <td className="max-w-[140px] truncate py-2 pr-4 text-slate-200">
                      {formatCell(row.ticket_link)}
                    </td>
                    <td className="max-w-[120px] truncate py-2 pr-4 text-slate-200">
                      {formatCell(row.order_number)}
                    </td>
                    <td className="max-w-[120px] truncate py-2 pr-4 text-slate-200">
                      {formatCell(row.sku)}
                    </td>
                    <td className="max-w-[160px] truncate py-2 pr-4 text-slate-200">
                      {formatCell(row.customer_name)}
                    </td>
                    <td className="max-w-[100px] truncate py-2 pr-4 text-slate-200">
                      {formatCell(row.priority)}
                    </td>
                    <td className="max-w-[180px] truncate py-2 pr-4 text-slate-200">
                      {formatCell(row.om_request)}
                    </td>
                    <td className="py-2 pr-4">
                      <select
                        value={row.status || ""}
                        onChange={(e) =>
                          handleStatusChange(row.ticket_link, e.target.value)
                        }
                        disabled={statusUpdating === row.ticket_link}
                        className="min-w-[110px] rounded border border-slate-600 bg-slate-900 px-2 py-1.5 text-slate-200 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 disabled:opacity-50"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="max-w-[200px] py-2 pr-4">
                      <span className="block truncate text-slate-200">
                        {formatCell(row.om_update) === "—"
                          ? "—"
                          : formatCell(row.om_update).slice(0, 60) +
                            (formatCell(row.om_update).length > 60 ? "…" : "")}
                      </span>
                      <button
                        type="button"
                        onClick={() => setOmUpdateRow(row)}
                        className="mt-0.5 text-xs text-cyan-400 hover:underline"
                      >
                        Edit
                      </button>
                    </td>
                    <td className="max-w-[140px] py-2 pr-4 text-slate-400 text-xs">
                      {formatTimestamp(row.last_follow_up)}
                    </td>
                    <td className="max-w-[120px] truncate py-2 pr-4 text-slate-200">
                      {formatCell(row.request_date)}
                    </td>
                    <td className="min-w-[140px] py-2 pr-4">
                      <input
                        type="text"
                        defaultValue={formatCell(row.designated_om_agent) === "—" ? "" : formatCell(row.designated_om_agent)}
                        placeholder="OM agent"
                        onBlur={(e) =>
                          handleDesignatedAgentBlur(row.ticket_link, e.target.value)
                        }
                        disabled={agentUpdating === row.ticket_link}
                        className="w-full min-w-[120px] rounded border border-slate-600 bg-slate-900 px-2 py-1.5 text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 disabled:opacity-50"
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {omUpdateRow && (
        <OmUpdateModal
          ticketLink={omUpdateRow.ticket_link}
          currentValue={omUpdateRow.om_update}
          onSave={handleOmUpdateSave}
          onClose={() => setOmUpdateRow(null)}
        />
      )}
    </>
  );
}
