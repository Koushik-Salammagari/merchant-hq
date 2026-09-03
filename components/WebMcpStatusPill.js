"use client";

import { useWebMcpStatus } from "./WebMcpProvider";

const CONFIG = {
  checking: { label: "Checking WebMCP…", dot: "bg-gray-400" },
  live: { label: "WebMCP tools live", dot: "bg-emerald-500" },
  unsupported: { label: "WebMCP unsupported", dot: "bg-red-500" },
};

export default function WebMcpStatusPill() {
  const status = useWebMcpStatus();
  const cfg = CONFIG[status] ?? CONFIG.checking;

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600"
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
