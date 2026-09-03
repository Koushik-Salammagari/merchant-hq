"use client";

import { useWebMcpStatus } from "./WebMcpProvider";

const CONFIG = {
  checking: { label: "Checking WebMCP…", dot: "bg-gray-400", text: "text-gray-600 bg-gray-100 border-gray-200" },
  live: { label: "WebMCP tools live", dot: "bg-emerald-500", text: "text-emerald-800 bg-emerald-50 border-emerald-200" },
  unsupported: { label: "WebMCP unsupported", dot: "bg-red-500", text: "text-red-800 bg-red-50 border-red-200" },
};

export default function WebMcpStatusPill() {
  const status = useWebMcpStatus();
  const cfg = CONFIG[status] ?? CONFIG.checking;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${cfg.text}`}
      title={
        status === "unsupported"
          ? "Open this page in ChatGPT's in-app browser, or Chrome with chrome://flags/#enable-webmcp-testing enabled."
          : undefined
      }
    >
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}
