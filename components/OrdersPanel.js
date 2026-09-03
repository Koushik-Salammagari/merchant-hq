import Panel from "./Panel";
import StatusBadge from "./StatusBadge";
import { formatCurrency, formatDate } from "@/lib/format";

const STATUS_OPTIONS = ["unfulfilled", "fulfilled", "refund_requested"];

export default function OrdersPanel({ orders, onUpdateStatus, busyKeys }) {
  return (
    <Panel title="Orders" subtitle={`${orders.length} order${orders.length === 1 ? "" : "s"}`}>
      {orders.length === 0 && <p className="px-5 py-6 text-sm text-gray-400">No orders.</p>}
      {orders.map((order) => {
        const busy = busyKeys.has(`order:${order.id}`);
        return (
          <div key={order.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">{order.customerName}</span>
                <StatusBadge status={order.status} />
              </div>
              <p className="mt-0.5 truncate text-xs text-gray-500">
                {order.items.map((i) => `${i.qty}× ${i.name}`).join(", ")} · {formatCurrency(order.total)} ·{" "}
                {formatDate(order.placedAt)}
              </p>
            </div>
            <select
              className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700 disabled:opacity-50"
              value={order.status}
              disabled={busy}
              onChange={(e) => onUpdateStatus(order.id, e.target.value)}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>
        );
      })}
    </Panel>
  );
}
