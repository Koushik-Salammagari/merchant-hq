"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import Panel from "./Panel";
import StatusBadge from "./StatusBadge";
import { formatCurrency, formatDate } from "@/lib/format";

const STATUS_OPTIONS = ["unfulfilled", "fulfilled", "refund_requested"];

const COLUMNS = [
  { key: "customerName", label: "Customer", sortable: true },
  { key: "items", label: "Items", sortable: false },
  { key: "total", label: "Total", sortable: true },
  { key: "status", label: "Status", sortable: true },
  { key: "placedAt", label: "Placed", sortable: true },
];

function compareValues(a, b, key) {
  if (key === "placedAt") return new Date(a[key]) - new Date(b[key]);
  const av = a[key];
  const bv = b[key];
  return typeof av === "string" ? av.localeCompare(bv) : av - bv;
}

export default function OrdersPanel({ orders, onUpdateStatus, busyKeys }) {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");

  function handleSort(key) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const sortedOrders = sortKey
    ? [...orders].sort((a, b) => (sortDir === "asc" ? 1 : -1) * compareValues(a, b, sortKey))
    : orders;

  return (
    <Panel title="Orders" subtitle={`${orders.length} order${orders.length === 1 ? "" : "s"}`}>
      {orders.length === 0 ? (
        <p className="px-6 py-8 text-sm text-gray-400">No orders.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {COLUMNS.map((col) => (
                  <th
                    key={col.key}
                    className="px-6 py-3 text-left text-xs font-semibold tracking-wide text-gray-400 uppercase"
                  >
                    {col.sortable ? (
                      <button
                        type="button"
                        onClick={() => handleSort(col.key)}
                        className="inline-flex items-center gap-1 hover:text-gray-600"
                      >
                        {col.label}
                        {sortKey === col.key &&
                          (sortDir === "asc" ? (
                            <ChevronUp className="h-3 w-3" />
                          ) : (
                            <ChevronDown className="h-3 w-3" />
                          ))}
                      </button>
                    ) : (
                      col.label
                    )}
                  </th>
                ))}
                <th className="px-6 py-3 text-right text-xs font-semibold tracking-wide text-gray-400 uppercase">
                  Update
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sortedOrders.map((order) => {
                const busy = busyKeys.has(`order:${order.id}`);
                return (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="max-w-40 truncate px-6 py-4 font-medium text-gray-900">
                      {order.customerName}
                    </td>
                    <td className="max-w-xs truncate px-6 py-4 text-gray-500">
                      {order.items.map((i) => `${i.qty}× ${i.name}`).join(", ")}
                    </td>
                    <td className="px-6 py-4 tabular-nums text-gray-900">{formatCurrency(order.total)}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{formatDate(order.placedAt)}</td>
                    <td className="px-6 py-4 text-right">
                      <select
                        className="rounded-md border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700 disabled:opacity-50"
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
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  );
}
