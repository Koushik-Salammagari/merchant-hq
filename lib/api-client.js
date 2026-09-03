import {
  setOrders,
  upsertOrder,
  setInventory,
  upsertInventoryItem,
  setMessages,
  upsertMessage,
  setDiscounts,
  addDiscount,
} from "./entity-store";

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

// Single choke point for every read/write to store data: both the
// dashboard UI and the WebMCP tools call these, so every successful
// mutation writes through to the shared entity stores (lib/entity-store.js)
// no matter which path triggered it. get_dashboard_summary is the one
// exception — it's a pure read with nothing to write back, since the
// dashboard's own summary is derived from the other three stores instead.
export const api = {
  getSummary: () => fetchJson("/api/summary"),

  async listOrders() {
    const data = await fetchJson("/api/orders");
    setOrders(data.orders);
    return data;
  },
  async updateOrderStatus(orderId, status) {
    const data = await fetchJson(`/api/orders/${encodeURIComponent(orderId)}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    upsertOrder(data.order);
    return data;
  },

  async listInventory() {
    const data = await fetchJson("/api/inventory");
    setInventory(data.inventory);
    return data;
  },
  async restockItem(sku, addQty) {
    const data = await fetchJson(`/api/inventory/${encodeURIComponent(sku)}`, {
      method: "PATCH",
      body: JSON.stringify({ addQty }),
    });
    upsertInventoryItem(data.item);
    return data;
  },

  async listMessages() {
    const data = await fetchJson("/api/messages");
    setMessages(data.messages);
    return data;
  },
  async draftMessageReply(messageId, replyText) {
    const data = await fetchJson(`/api/messages/${encodeURIComponent(messageId)}`, {
      method: "PATCH",
      body: JSON.stringify({ replyText }),
    });
    upsertMessage(data.message);
    return data;
  },

  async listDiscounts() {
    const data = await fetchJson("/api/discounts");
    setDiscounts(data.discounts);
    return data;
  },
  async createDiscountCode(percentOff, code) {
    const data = await fetchJson("/api/discounts", {
      method: "POST",
      body: JSON.stringify({ percentOff, ...(code ? { code } : {}) }),
    });
    addDiscount(data.discount);
    return data;
  },
};
