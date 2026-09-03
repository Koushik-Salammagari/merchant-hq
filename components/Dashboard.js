"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import SummaryStrip from "./SummaryStrip";
import OrdersPanel from "./OrdersPanel";
import InventoryPanel from "./InventoryPanel";
import MessagesPanel from "./MessagesPanel";
import DiscountsPanel from "./DiscountsPanel";
import TraceDrawer from "./TraceDrawer";
import { api } from "@/lib/api-client";
import { traced, subscribeTrace, getTraceEntries, EMPTY_TRACE } from "@/lib/trace";
import { ordersStore, inventoryStore, messagesStore, discountsStore, summaryStore } from "@/lib/entity-store";

const VIEW_COPY = {
  overview: { title: "Dashboard", subtitle: "What needs your attention right now" },
  orders: { title: "Orders", subtitle: "Fulfill orders and manage refunds" },
  inventory: { title: "Inventory", subtitle: "Track stock and restock low items" },
  messages: { title: "Messages", subtitle: "Reply to customer questions" },
  discounts: { title: "Discounts", subtitle: "Create and manage discount codes" },
};

export default function Dashboard() {
  // Reads straight from the shared stores that lib/api-client.js writes
  // to — whether a human click or a WebMCP tool call triggered the write,
  // this component re-renders as soon as it happens. No local copies to
  // fall out of sync.
  const orders = useSyncExternalStore(ordersStore.subscribe, ordersStore.get, ordersStore.get);
  const inventory = useSyncExternalStore(inventoryStore.subscribe, inventoryStore.get, inventoryStore.get);
  const messages = useSyncExternalStore(messagesStore.subscribe, messagesStore.get, messagesStore.get);
  const discounts = useSyncExternalStore(discountsStore.subscribe, discountsStore.get, discountsStore.get);
  const summary = useSyncExternalStore(summaryStore.subscribe, summaryStore.get, summaryStore.get);
  const traceEntries = useSyncExternalStore(subscribeTrace, getTraceEntries, () => EMPTY_TRACE);

  const [loading, setLoading] = useState(true);
  const [lastError, setLastError] = useState(null);
  const [busyKeys, setBusyKeys] = useState(new Set());
  const [activeView, setActiveView] = useState("overview");
  const [traceOpen, setTraceOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await Promise.all([
          api.listOrders(),
          api.listInventory(),
          api.listMessages(),
          api.listDiscounts(),
        ]);
      } catch (err) {
        if (!cancelled) setLastError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function runAction(key, { action, describeResult }) {
    setBusyKeys((prev) => new Set(prev).add(key));
    setLastError(null);
    try {
      await traced({ who: "human", tool: null, args: null, action, describeResult });
    } catch (err) {
      setLastError(err.message);
    } finally {
      setBusyKeys((prev) => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    }
  }

  function handleUpdateOrderStatus(orderId, status) {
    runAction(`order:${orderId}`, {
      action: async () => {
        const { order } = await api.updateOrderStatus(orderId, status);
        return order;
      },
      describeResult: (order) => `Marked order ${order.id} as ${order.status.replace("_", " ")}`,
    });
  }

  function handleRestock(sku, addQty) {
    runAction(`inventory:${sku}`, {
      action: async () => {
        const { item } = await api.restockItem(sku, addQty);
        return item;
      },
      describeResult: (item) => `Restocked ${item.sku} by ${addQty} (now ${item.stock})`,
    });
  }

  function handleReply(messageId, replyText) {
    runAction(`message:${messageId}`, {
      action: async () => {
        const { message } = await api.draftMessageReply(messageId, replyText);
        return message;
      },
      describeResult: (message) => `Replied to ${message.customerName}'s message`,
    });
  }

  function handleCreateDiscount(percentOff, code) {
    runAction("discount:create", {
      action: async () => {
        const { discount } = await api.createDiscountCode(percentOff, code);
        return discount;
      },
      describeResult: (discount) => `Created discount code ${discount.code} (${discount.percentOff}% off)`,
    });
  }

  const traceErrorCount = traceEntries.filter((e) => e.status === "error").length;
  const copy = VIEW_COPY[activeView];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 text-gray-900">
      <Sidebar activeView={activeView} onNavigate={setActiveView} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar
          onToggleTrace={() => setTraceOpen((v) => !v)}
          traceCount={traceEntries.length}
          traceErrorCount={traceErrorCount}
        />

        <main className="flex-1 overflow-y-auto px-10 py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">{copy.title}</h1>
            <p className="mt-1 text-sm text-gray-400">{copy.subtitle}</p>
          </div>

          {lastError && (
            <div className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-800">
              <span>{lastError}</span>
              <button type="button" onClick={() => setLastError(null)} className="text-red-500 hover:text-red-700">
                Dismiss
              </button>
            </div>
          )}

          {activeView === "overview" && (
            <SummaryStrip summary={summary} loading={loading} onNavigate={setActiveView} />
          )}
          {activeView === "orders" && (
            <OrdersPanel orders={orders} onUpdateStatus={handleUpdateOrderStatus} busyKeys={busyKeys} />
          )}
          {activeView === "inventory" && (
            <InventoryPanel items={inventory} onRestock={handleRestock} busyKeys={busyKeys} />
          )}
          {activeView === "messages" && (
            <MessagesPanel messages={messages} onReply={handleReply} busyKeys={busyKeys} />
          )}
          {activeView === "discounts" && (
            <DiscountsPanel
              discounts={discounts}
              onCreate={handleCreateDiscount}
              busy={busyKeys.has("discount:create")}
            />
          )}
        </main>
      </div>

      <TraceDrawer open={traceOpen} onClose={() => setTraceOpen(false)} />
    </div>
  );
}
