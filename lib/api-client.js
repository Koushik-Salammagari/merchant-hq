async function fetchJson(path, options) {
  const res = await fetch(path, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options?.headers ?? {}) },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request to ${path} failed with status ${res.status}`);
  }
  return data;
}

export const api = {
  getSummary: () => fetchJson("/api/summary"),

  listOrders: () => fetchJson("/api/orders"),
  updateOrderStatus: (orderId, status) =>
    fetchJson(`/api/orders/${encodeURIComponent(orderId)}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  listInventory: () => fetchJson("/api/inventory"),
  restockItem: (sku, addQty) =>
    fetchJson(`/api/inventory/${encodeURIComponent(sku)}`, {
      method: "PATCH",
      body: JSON.stringify({ addQty }),
    }),

  listMessages: () => fetchJson("/api/messages"),
  draftMessageReply: (messageId, replyText) =>
    fetchJson(`/api/messages/${encodeURIComponent(messageId)}`, {
      method: "PATCH",
      body: JSON.stringify({ replyText }),
    }),

  listDiscounts: () => fetchJson("/api/discounts"),
  createDiscountCode: (percentOff, code) =>
    fetchJson("/api/discounts", {
      method: "POST",
      body: JSON.stringify({ percentOff, ...(code ? { code } : {}) }),
    }),
};
