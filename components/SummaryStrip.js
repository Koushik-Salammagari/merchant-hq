const STATS = [
  { key: "unfulfilledOrders", label: "Unfulfilled orders", accent: "text-amber-700" },
  { key: "lowStockItems", label: "Low stock items", accent: "text-red-700" },
  { key: "openMessages", label: "Open messages", accent: "text-blue-700" },
];

export default function SummaryStrip({ summary, loading }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {STATS.map((stat) => (
        <div key={stat.key} className="rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
          <div className={`text-3xl font-semibold tabular-nums ${stat.accent}`}>
            {loading ? "–" : (summary?.[stat.key] ?? 0)}
          </div>
          <div className="mt-1 text-sm text-gray-500">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
