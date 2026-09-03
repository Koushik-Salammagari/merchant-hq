"use client";

import { useSyncExternalStore } from "react";

// Tracks short-lived "recently changed" markers so panels can flash the
// specific row/card that just changed, whether the write came from a
// human click or a WebMCP tool call. Keyed by "<entity>:<id>" so ids
// never collide across entity types (e.g. an order id vs. a sku).
//
// The marker itself is just bookkeeping — who changed what, and when.
// The actual fade is a CSS @keyframes animation (see globals.css);
// this store only decides when to mount/unmount the flash class, not
// how it animates.

const FLASH_DURATION_MS = 2000;

let highlights = {};
const listeners = new Set();

export function markChanged(entity, id, who) {
  const key = `${entity}:${id}`;
  highlights = { ...highlights, [key]: { who, at: Date.now() } };
  listeners.forEach((listener) => listener(highlights));

  setTimeout(() => {
    if (!(key in highlights)) return;
    const next = { ...highlights };
    delete next[key];
    highlights = next;
    listeners.forEach((listener) => listener(highlights));
  }, FLASH_DURATION_MS);
}

export function getHighlights() {
  return highlights;
}

export function subscribeHighlights(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// Reads the marker (if any) for one row. `getHighlights` returns the same
// object reference until an actual change happens, so passing it directly
// (not wrapped in an inline arrow) satisfies useSyncExternalStore without
// needing a separate stable "empty" constant.
export function useHighlight(entity, id) {
  const highlights = useSyncExternalStore(subscribeHighlights, getHighlights, getHighlights);
  return highlights[`${entity}:${id}`];
}

// Maps a marker to the CSS class that plays its flash animation.
export function flashClassName(highlight) {
  if (!highlight) return "";
  return highlight.who === "agent" ? "flash-agent" : "flash-human";
}
