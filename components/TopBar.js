import { Bell } from "lucide-react";
import WebMcpStatusPill from "./WebMcpStatusPill";

export default function TopBar({ onToggleTrace, traceCount, traceErrorCount }) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-10">
      <div className="flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-teal-700 text-xs font-semibold text-white">
          M
        </div>
        <span className="text-sm font-semibold tracking-tight text-gray-900">Merchant HQ</span>
      </div>

      <div className="flex items-center gap-3">
        <WebMcpStatusPill />
        <button
          type="button"
          onClick={onToggleTrace}
          className="relative inline-flex items-center gap-1.5 rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50"
        >
          <Bell className="h-3.5 w-3.5" aria-hidden="true" />
          Activity
          {traceCount > 0 && (
            <span
              className={`ml-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold text-white ${
                traceErrorCount > 0 ? "bg-red-500" : "bg-gray-400"
              }`}
            >
              {traceCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
