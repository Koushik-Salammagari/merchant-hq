"use client";

import { markChanged } from "./highlight-store";

// Shared client-side stores for orders/inventory/messages/discounts — the
// entity-side counterpart to lib/trace.js's pub/sub pattern. Both the
// dashboard UI and the WebMCP tools write through the same functions
// (via lib/api-client.js), so a change from either path is immediately
// visible to every subscribed component. No manual refetch, no reload.

function createStore(initial) {
  let state = initial;
  const listeners = new Set();

  function get() {
    return state;
  }

  function set(next) {
    state = next;
    listeners.forEach((listener) => listener(state));
  }

  function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  return { get, set, subscribe };
}

// A read-only store recomputed from other stores on every read, memoized
// so unchanged inputs return the exact same reference — required by
// useSyncExternalStore to avoid re-rendering (or looping) on no-op reads.
function createDerivedStore(sources, compute) {
  let inputs;
  let result;

  function get() {
    const next = sources.map((s) => s.get());
    if (!inputs || next.some((v, i) => v !== inputs[i])) {
      inputs = next;
      result = compute(...next);
    }
    return result;
  }

  function subscribe(listener) {
    const unsubs = sources.map((s) => s.subscribe(listener));
    return () => unsubs.forEach((unsub) => unsub());
  }

  return { get, subscribe };
}

export const ordersStore = createStore([]);
export const inventoryStore = createStore([]);
export const messagesStore = createStore([]);
export const discountsStore = createStore([]);

// Derived rather than fetched separately, so it can never drift out of
// sync with the lists it's summarizing — whoever changed an order,
// inventory item, or message already updated the store it reads from.
export const summaryStore = createDerivedStore(
  [ordersStore, inventoryStore, messagesStore],
  (orders, inventory, messages) => ({
    unfulfilledOrders: orders.filter((o) => o.status === "unfulfilled").length,
    lowStockItems: inventory.filter((i) => i.stock < i.threshold).length,
    openMessages: messages.filter((m) => m.status === "open").length,
  })
);

export function setOrders(orders) {
  ordersStore.set(orders);
}
export function upsertOrder(order, who) {
  ordersStore.set(ordersStore.get().map((o) => (o.id === order.id ? order : o)));
  if (who) markChanged("orders", order.id, who);
}

export function setInventory(items) {
  inventoryStore.set(items);
}
export function upsertInventoryItem(item, who) {
  inventoryStore.set(inventoryStore.get().map((i) => (i.sku === item.sku ? item : i)));
  if (who) markChanged("inventory", item.sku, who);
}

export function setMessages(messages) {
  messagesStore.set(messages);
}
export function upsertMessage(message, who) {
  messagesStore.set(messagesStore.get().map((m) => (m.id === message.id ? message : m)));
  if (who) markChanged("messages", message.id, who);
}

export function setDiscounts(discounts) {
  discountsStore.set(discounts);
}
export function addDiscount(discount, who) {
  discountsStore.set([...discountsStore.get(), discount]);
  if (who) markChanged("discounts", discount.code, who);
}
