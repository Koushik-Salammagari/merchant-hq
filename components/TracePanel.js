"use client";

import { useState, useSyncExternalStore } from "react";
import { subscribeTrace, getTraceEntries, EMPTY_TRACE } from "@/lib/trace";
import { formatDateTime } from "@/lib/format";

export default function TracePanel() {
  const entries = useSyncExternalStore(subscribeTrace, getTraceEntries, () => EMPTY_TRACE);
  const [expandedId, setExpandedId] = useState(null);
  const errorCount = entries.filter((e) => e.status === "error").length;

  return (
    <aside className="flex h-fit flex-col rounded-xl border border-gray-200 bg-white shadow-sm lg:sticky lg:top-6">
      <div className="border-b border-gray-100 px-5 py-3">
        <h2 className="text-sm font-semibold text-gray-900">Activity trace</h2>
        <p className="text-xs text-gray-500">
          {entries.length} call{entries.length === 1 ? "" : "s"} · {errorCount} error
          {errorCount === 1 ? "" : "s"}
        </p>
      </div>
      <div className="max-h-[70vh] divide-y divide-gray-100 overflow-y-auto">
        {entries.length === 0 && (
          <p className="px-5 py-6 text-sm text-gray-400">
            No activity yet. Actions you or an agent take will show up here.
          </p>
        )}
        {entries.map((entry) => {
          const isOpen = expandedId === entry.id;
          const label = entry.tool ?? entry.result;
          return (
            <div key={entry.id}>
              <button
                type="button"
                onClick={() => setExpandedId(isOpen ? null : entry.id)}
                className="flex w-full items-center justify-between gap-2 px-5 py-2 text-left hover:bg-gray-50"
              >
                <span className="flex min-w-0 items-center gap-2 text-xs">
                  <span
                    className={`inline-flex shrink-0 items-center rounded-full px-1.5 py-0.5 font-medium ${
                      entry.who === "agent"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {entry.who}
                  </span>
                  <span className="truncate text-gray-700">{label}</span>
                </span>
                <span
                  className={`shrink-0 text-xs font-medium ${
                    entry.status === "error" ? "text-red-600" : "text-gray-400"
                  }`}
                >
                  {entry.durationMs}ms · {entry.status}
                </span>
              </button>
              {isOpen && (
                <div className="space-y-2 bg-gray-50 px-5 py-3 text-xs">
                  <div className="text-gray-400">{formatDateTime(entry.at)}</div>
                  {entry.args && (
                    <div>
                      <div className="font-medium text-gray-500">args</div>
                      <pre className="overflow-x-auto rounded bg-white p-2 text-[11px] text-gray-700">
                        {JSON.stringify(entry.args, null, 2)}
                      </pre>
                    </div>
                  )}
                  <div>
                    <div className="font-medium text-gray-500">result</div>
                    <pre className="overflow-x-auto rounded bg-white p-2 text-[11px] whitespace-pre-wrap text-gray-700">
                      {entry.result}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
