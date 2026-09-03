"use client";

import { useState } from "react";
import Panel from "./Panel";
import { formatCurrency } from "@/lib/format";

export default function InventoryPanel({ items, onRestock, busyKeys }) {
  const [qtyBySku, setQtyBySku] = useState({});

  return (
    <Panel title="Inventory" subtitle={`${items.length} item${items.length === 1 ? "" : "s"}`}>
      {items.length === 0 && <p className="px-5 py-6 text-sm text-gray-400">No items.</p>}
      {items.map((item) => {
        const busy = busyKeys.has(`inventory:${item.sku}`);
        const lowStock = item.stock < item.threshold;
        const qty = qtyBySku[item.sku] ?? 10;

        return (
          <div key={item.sku} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">{item.name}</span>
                {lowStock && (
                  <span className="inline-flex items-center rounded-full border border-red-200 bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                    Low stock
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-xs text-gray-500">
                {item.sku} · {formatCurrency(item.price)} ·{" "}
                <span className={lowStock ? "font-medium text-red-700" : ""}>
                  {item.stock} in stock
                </span>{" "}
                (threshold {item.threshold})
              </p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                className="w-16 rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-700 disabled:opacity-50"
                value={qty}
                disabled={busy}
                onChange={(e) =>
                  setQtyBySku((prev) => ({ ...prev, [item.sku]: Number(e.target.value) }))
                }
              />
              <button
                type="button"
                className="rounded-md bg-gray-900 px-3 py-1 text-xs font-medium text-white hover:bg-gray-700 disabled:opacity-50"
                disabled={busy || !qty || qty <= 0}
                onClick={() => onRestock(item.sku, qty)}
              >
                {busy ? "Restocking…" : "Restock"}
              </button>
            </div>
          </div>
        );
      })}
    </Panel>
  );
}
