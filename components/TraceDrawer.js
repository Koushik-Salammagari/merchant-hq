"use client";

import { X } from "lucide-react";
import TracePanel from "./TracePanel";

export default function TraceDrawer({ open, onClose }) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/20"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Activity trace"
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-md transform border-l border-gray-200 bg-white shadow-xl transition-transform duration-200 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col overflow-y-auto p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400">Live activity</span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close activity panel"
              className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <TracePanel />
        </div>
      </div>
    </>
  );
}
