"use client";

import { Tag } from "lucide-react";
import { useConfirmState, approveConfirm, declineConfirm } from "@/lib/confirm-store";

export default function ConfirmModal() {
  const state = useConfirmState();
  if (!state) return null;

  const { input } = state;
  const codeLabel = input.code || "auto-generated";

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-gray-900/30" aria-hidden="true" />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        className="fixed inset-0 z-[61] flex items-center justify-center p-4"
      >
        <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.15)]">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
              <Tag className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            </span>
            <h2 id="confirm-modal-title" className="text-sm font-semibold text-gray-900">
              Confirm agent action
            </h2>
          </div>

          <p className="mt-4 text-sm text-gray-600">
            Agent wants to create a discount code:{" "}
            <span className="font-semibold text-gray-900">
              {input.percentOff}% off {codeLabel}
            </span>
          </p>

          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={declineConfirm}
              className="rounded-md border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              Deny
            </button>
            <button
              type="button"
              onClick={approveConfirm}
              className="rounded-md bg-teal-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-teal-800"
            >
              Approve
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
