"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { buildToolDefinitions } from "@/lib/webmcp-tools";
import ConfirmModal from "./ConfirmModal";

const WebMcpStatusContext = createContext("checking");

export function useWebMcpStatus() {
  return useContext(WebMcpStatusContext);
}

// Registers all Merchant HQ WebMCP tools on document.modelContext (or
// navigator.modelContext on slightly older Chrome versions) as soon as
// the page mounts, so any WebMCP-capable agent visiting this tab can
// discover and call them immediately. Falls back to an "unsupported"
// status (surfaced as a pill in the header) when the browser has neither,
// e.g. Chrome without the WebMCP testing flag.
export default function WebMcpProvider({ children }) {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    // Feature detection for a browser API must stay SSR-neutral (render
    // "checking" on the server, flip to the real status after mount) —
    // that inherently means a synchronous setState here.
    const modelContext =
      typeof document !== "undefined" &&
      (document.modelContext || navigator.modelContext);
    if (!modelContext) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus("unsupported");
      return;
    }

    const controller = new AbortController();
    buildToolDefinitions().forEach((toolDef) =>
      modelContext.registerTool(toolDef, { signal: controller.signal })
    );
    setStatus("live");

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <WebMcpStatusContext.Provider value={status}>
      {children}
      <ConfirmModal />
    </WebMcpStatusContext.Provider>
  );
}
