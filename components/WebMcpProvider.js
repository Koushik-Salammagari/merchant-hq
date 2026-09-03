"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { buildToolDefinitions } from "@/lib/webmcp-tools";

const WebMcpStatusContext = createContext("checking");

export function useWebMcpStatus() {
  return useContext(WebMcpStatusContext);
}

// Registers all Merchant HQ WebMCP tools on document.modelContext as soon
// as the page mounts, so any WebMCP-capable agent visiting this tab can
// discover and call them immediately. Falls back to an "unsupported"
// status (surfaced as a pill in the header) when the browser has no
// document.modelContext, e.g. Chrome without the WebMCP testing flag.
export default function WebMcpProvider({ children }) {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    // Feature detection for a browser API must stay SSR-neutral (render
    // "checking" on the server, flip to the real status after mount) —
    // that inherently means a synchronous setState here.
    if (typeof document === "undefined" || !document.modelContext) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus("unsupported");
      return;
    }

    const handles = buildToolDefinitions().map((toolDef) =>
      document.modelContext.registerTool(toolDef)
    );
    setStatus("live");

    return () => {
      handles.forEach((handle) => handle?.remove?.());
    };
  }, []);

  return (
    <WebMcpStatusContext.Provider value={status}>
      {children}
    </WebMcpStatusContext.Provider>
  );
}
