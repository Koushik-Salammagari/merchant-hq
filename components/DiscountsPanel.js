"use client";

import { useState } from "react";
import Panel from "./Panel";
import { formatDate } from "@/lib/format";

export default function DiscountsPanel({ discounts, onCreate, busy }) {
  const [percentOff, setPercentOff] = useState(10);
  const [code, setCode] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!percentOff || percentOff <= 0 || percentOff > 100) return;
    onCreate(percentOff, code.trim() || undefined);
    setCode("");
  }

  return (
    <Panel title="Discounts" subtitle={`${discounts.length} active code${discounts.length === 1 ? "" : "s"}`}>
      <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3 px-6 py-4">
        <label className="flex flex-col gap-1">
          <span className="text-xs text-gray-500">% off</span>
          <input
            type="number"
            min="1"
            max="100"
            className="w-20 rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-700 disabled:opacity-50"
            value={percentOff}
            disabled={busy}
            onChange={(e) => setPercentOff(Number(e.target.value))}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-gray-500">Code (optional)</span>
          <input
            type="text"
            placeholder="Auto-generated"
            className="w-36 rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-700 disabled:opacity-50"
            value={code}
            disabled={busy}
            onChange={(e) => setCode(e.target.value)}
          />
        </label>
        <button
          type="submit"
          className="rounded-md bg-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-700 disabled:opacity-50"
          disabled={busy || !percentOff || percentOff <= 0 || percentOff > 100}
        >
          {busy ? "Creating…" : "Create code"}
        </button>
      </form>

      {discounts.length === 0 ? (
        <p className="px-6 py-8 text-sm text-gray-400">No discount codes yet.</p>
      ) : (
        <div className="flex flex-wrap gap-2 px-6 py-4">
          {discounts.map((d) => (
            <span
              key={d.code}
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700"
              title={`Created ${formatDate(d.createdAt)}`}
            >
              {d.code} · {d.percentOff}% off
            </span>
          ))}
        </div>
      )}
    </Panel>
  );
}
