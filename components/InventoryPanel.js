"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import Panel from "./Panel";
import { formatCurrency } from "@/lib/format";
import { useHighlight, flashClassName } from "@/lib/highlight-store";

const COLUMNS = [
  { key: "name", label: "Item", sortable: true },
  { key: "sku", label: "SKU", sortable: false },
  { key: "price", label: "Price", sortable: true },
  { key: "stock", label: "Stock", sortable: true },
];

function compareValues(a, b, key) {
  const av = a[key];
  const bv = b[key];
  return typeof av === "string" ? av.localeCompare(bv) : av - bv;
}

function InventoryRow({ item, qty, onQtyChange, onRestock, busy }) {
  // A row-level component (not inlined in .map()) so useHighlight — a
  // hook — can be called per row without breaking the Rules of Hooks.
  const highlight = useHighlight("inventory", item.sku);
  const lowStock = item.stock < item.threshold;

  return (
    <tr key={highlight?.at ?? "base"} className={`hover:bg-gray-50 ${flashClassName(highlight)}`}>
      <td className="max-w-40 truncate px-6 py-4 font-medium text-gray-900">{item.name}</td>
      <td className="px-6 py-4 whitespace-nowrap text-gray-500">{item.sku}</td>
      <td className="px-6 py-4 tabular-nums text-gray-900">{formatCurrency(item.price)}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`tabular-nums ${lowStock ? "font-semibold text-red-600" : "text-gray-900"}`}>
          {item.stock}
        </span>
        <span className="ml-1 text-xs text-gray-400">/ {item.threshold}</span>
        {lowStock && (
          <span className="ml-2 inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">
            Low
          </span>
        )}
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="1"
            className="w-16 rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-700 disabled:opacity-50"
            value={qty}
            disabled={busy}
            onChange={(e) => onQtyChange(Number(e.target.value))}
          />
          <button
            type="button"
            className="rounded-md bg-gray-900 px-3 py-1 text-xs font-medium whitespace-nowrap text-white hover:bg-gray-700 disabled:opacity-50"
            disabled={busy || !qty || qty <= 0}
            onClick={() => onRestock(item.sku, qty)}
          >
            {busy ? "Restocking…" : "Restock"}
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function InventoryPanel({ items, onRestock, busyKeys }) {
  const [qtyBySku, setQtyBySku] = useState({});
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

  const sortedItems = sortKey
    ? [...items].sort((a, b) => (sortDir === "asc" ? 1 : -1) * compareValues(a, b, sortKey))
    : items;

  return (
    <Panel title="Inventory" subtitle={`${items.length} item${items.length === 1 ? "" : "s"}`}>
      {items.length === 0 ? (
        <p className="px-6 py-8 text-sm text-gray-400">No items.</p>
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
                <th className="px-6 py-3 text-left text-xs font-semibold tracking-wide text-gray-400 uppercase">
                  Restock
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sortedItems.map((item) => (
                <InventoryRow
                  key={item.sku}
                  item={item}
                  qty={qtyBySku[item.sku] ?? 10}
                  onQtyChange={(qty) => setQtyBySku((prev) => ({ ...prev, [item.sku]: qty }))}
                  onRestock={onRestock}
                  busy={busyKeys.has(`inventory:${item.sku}`)}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  );
}
