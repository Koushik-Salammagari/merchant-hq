const STYLES = {
  unfulfilled: "bg-amber-100 text-amber-800 border-amber-200",
  fulfilled: "bg-emerald-100 text-emerald-800 border-emerald-200",
  refund_requested: "bg-red-100 text-red-800 border-red-200",
  open: "bg-amber-100 text-amber-800 border-amber-200",
  replied: "bg-emerald-100 text-emerald-800 border-emerald-200",
  active: "bg-emerald-100 text-emerald-800 border-emerald-200",
};

const LABELS = {
  unfulfilled: "Unfulfilled",
  fulfilled: "Fulfilled",
  refund_requested: "Refund requested",
  open: "Open",
  replied: "Replied",
  active: "Active",
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap ${
        STYLES[status] ?? "bg-gray-100 text-gray-800 border-gray-200"
      }`}
    >
      {LABELS[status] ?? status}
    </span>
  );
}
