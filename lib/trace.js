"use client";

// Minimal client-side pub/sub store for the trace/observability panel.
// Shared by the WebMCP tools (who: "agent") and the dashboard UI
// (who: "human") so both write to one unified timeline.

let entries = [];
const listeners = new Set();

export function addTraceEntry(entry) {
  const full = {
    id: crypto.randomUUID(),
    at: new Date(),
    ...entry,
  };
  entries = [full, ...entries];
  listeners.forEach((listener) => listener(entries));
  return full;
}

export function getTraceEntries() {
  return entries;
}

export function subscribeTrace(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// Wraps an async action, timing it and recording a trace entry regardless
// of success or failure. `describeResult` turns the resolved value into
// the short human-readable `result` string shown in the collapsed row.
export async function traced({ who, tool, args, action, describeResult }) {
  const start = performance.now();
  try {
    const value = await action();
    addTraceEntry({
      who,
      tool: tool ?? null,
      args: args ?? null,
      result: describeResult ? describeResult(value) : "ok",
      durationMs: Math.round(performance.now() - start),
      status: "ok",
    });
    return value;
  } catch (err) {
    addTraceEntry({
      who,
      tool: tool ?? null,
      args: args ?? null,
      result: err instanceof Error ? err.message : String(err),
      durationMs: Math.round(performance.now() - start),
      status: "error",
    });
    throw err;
  }
}
