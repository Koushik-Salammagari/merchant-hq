import { ClipboardList, Package, MessageSquare } from "lucide-react";

const STATS = [
  {
    key: "unfulfilledOrders",
    label: "Unfulfilled orders",
    view: "orders",
    Icon: ClipboardList,
    accent: "text-amber-700",
    chip: "bg-amber-50 text-amber-600",
    bar: "bg-amber-400",
  },
  {
    key: "lowStockItems",
    label: "Low stock items",
    view: "inventory",
    Icon: Package,
    accent: "text-red-700",
    chip: "bg-red-50 text-red-600",
    bar: "bg-red-400",
  },
  {
    key: "openMessages",
    label: "Open messages",
    view: "messages",
    Icon: MessageSquare,
    accent: "text-blue-700",
    chip: "bg-blue-50 text-blue-600",
    bar: "bg-blue-400",
  },
];

export default function SummaryStrip({ summary, loading, onNavigate }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
      {STATS.map((stat) => {
        const Icon = stat.Icon;
        return (
          <button
            key={stat.key}
            type="button"
            onClick={() => onNavigate?.(stat.view)}
            className="overflow-hidden rounded-xl bg-white text-left shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-shadow hover:shadow-[0_2px_8px_rgba(0,0,0,0.10)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
          >
            <div className={`h-1 w-full ${stat.bar}`} />
            <div className="flex items-start justify-between px-6 py-5">
              <div>
                <div className={`text-4xl font-bold tabular-nums ${stat.accent}`}>
                  {loading ? "–" : (summary?.[stat.key] ?? 0)}
                </div>
                <div className="mt-1.5 text-sm font-medium text-gray-400">{stat.label}</div>
              </div>
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${stat.chip}`}>
                <Icon className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
