"use client";

interface StatsCardsProps {
  totalRequests: number;
  byStatus: Record<string, number>;
  byPriority: Record<string, number>;
  loading?: boolean;
}

export function StatsCards({ totalRequests, byStatus, byPriority, loading }: StatsCardsProps) {
  const statusEntries = Object.entries(byStatus).sort((a, b) => b[1] - a[1]);
  const priorityEntries = Object.entries(byPriority).sort((a, b) => b[1] - a[1]);

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="animate-pulse rounded-xl border border-slate-700 bg-slate-800/80 p-4"
          >
            <div className="h-4 w-24 rounded bg-slate-600" />
            <div className="mt-2 h-8 w-16 rounded bg-slate-600" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-xl border border-slate-700 bg-slate-800/80 p-4 shadow-lg">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
          Total requests
        </p>
        <p className="mt-1 text-2xl font-bold text-cyan-400">{totalRequests.toLocaleString()}</p>
      </div>
      <div className="rounded-xl border border-slate-700 bg-slate-800/80 p-4 shadow-lg">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
          By status
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {statusEntries.slice(0, 5).map(([name, count]) => (
            <span
              key={name}
              className="rounded-md bg-slate-700 px-2 py-0.5 text-sm text-slate-200"
            >
              {name}: {count}
            </span>
          ))}
          {statusEntries.length === 0 && (
            <span className="text-sm text-slate-500">—</span>
          )}
        </div>
      </div>
      <div className="rounded-xl border border-slate-700 bg-slate-800/80 p-4 shadow-lg">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
          By priority
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {priorityEntries.slice(0, 5).map(([name, count]) => (
            <span
              key={name}
              className="rounded-md bg-slate-700 px-2 py-0.5 text-sm text-slate-200"
            >
              {name}: {count}
            </span>
          ))}
          {priorityEntries.length === 0 && (
            <span className="text-sm text-slate-500">—</span>
          )}
        </div>
      </div>
      <div className="rounded-xl border border-slate-700 bg-slate-800/80 p-4 shadow-lg">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
          Statuses
        </p>
        <p className="mt-1 text-2xl font-bold text-slate-300">
          {statusEntries.length}
        </p>
      </div>
    </div>
  );
}
