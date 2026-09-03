const STYLES = {
  unfulfilled: "bg-amber-50 text-amber-700",
  fulfilled: "bg-emerald-50 text-emerald-700",
  refund_requested: "bg-red-50 text-red-700",
  open: "bg-amber-50 text-amber-700",
  replied: "bg-emerald-50 text-emerald-700",
  active: "bg-emerald-50 text-emerald-700",
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
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${
        STYLES[status] ?? "bg-gray-100 text-gray-700"
      }`}
    >
      {LABELS[status] ?? status}
    </span>
  );
}
