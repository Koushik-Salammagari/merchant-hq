"use client";

import { useSyncExternalStore } from "react";

// Lets a WebMCP tool's execute() — which runs outside React's render
// cycle, triggered by the browser's WebMCP runtime — pop a confirmation
// modal and await the merchant's click. showConfirmModal() is the
// imperative entry point (call it from anywhere); ConfirmModal.js is the
// React component that actually renders the dialog and resolves it.

let state = null; // { input, resolve } | null
const listeners = new Set();

export function showConfirmModal(input) {
  return new Promise((resolve) => {
    state = { input, resolve };
    listeners.forEach((listener) => listener(state));
  });
}

function respond(approved) {
  if (!state) return;
  const { resolve } = state;
  state = null;
  listeners.forEach((listener) => listener(state));
  resolve(approved);
}

export function approveConfirm() {
  respond(true);
}

export function declineConfirm() {
  respond(false);
}

export function getConfirmState() {
  return state;
}

export function subscribeConfirm(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useConfirmState() {
  return useSyncExternalStore(subscribeConfirm, getConfirmState, getConfirmState);
}
