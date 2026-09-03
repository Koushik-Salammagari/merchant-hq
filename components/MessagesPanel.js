"use client";

import { useState } from "react";
import Panel from "./Panel";
import StatusBadge from "./StatusBadge";

export default function MessagesPanel({ messages, onReply, busyKeys }) {
  const [draftById, setDraftById] = useState({});

  return (
    <Panel title="Messages" subtitle={`${messages.length} message${messages.length === 1 ? "" : "s"}`}>
      {messages.length === 0 && <p className="px-6 py-8 text-sm text-gray-400">No messages.</p>}
      {messages.map((message) => {
        const busy = busyKeys.has(`message:${message.id}`);
        const draft = draftById[message.id] ?? "";

        return (
          <div key={message.id} className="px-6 py-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900">{message.customerName}</span>
              <StatusBadge status={message.status} />
            </div>
            <p className="mt-0.5 text-sm font-medium text-gray-700">{message.subject}</p>
            <p className="mt-0.5 text-xs text-gray-500">{message.body}</p>

            {message.status === "replied" ? (
              <p className="mt-2 rounded-md bg-gray-50 px-3 py-2 text-xs text-gray-600">
                <span className="font-medium text-gray-500">Reply: </span>
                {message.draftReply}
              </p>
            ) : (
              <div className="mt-2 flex items-start gap-2">
                <textarea
                  rows={2}
                  placeholder="Write a reply…"
                  className="flex-1 rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-700 disabled:opacity-50"
                  value={draft}
                  disabled={busy}
                  onChange={(e) =>
                    setDraftById((prev) => ({ ...prev, [message.id]: e.target.value }))
                  }
                />
                <button
                  type="button"
                  className="rounded-md bg-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-700 disabled:opacity-50"
                  disabled={busy || draft.trim().length === 0}
                  onClick={() => onReply(message.id, draft)}
                >
                  {busy ? "Sending…" : "Send reply"}
                </button>
              </div>
            )}
          </div>
        );
      })}
    </Panel>
  );
}
