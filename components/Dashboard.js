"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Header from "./Header";
import SummaryStrip from "./SummaryStrip";
import OrdersPanel from "./OrdersPanel";
import InventoryPanel from "./InventoryPanel";
import MessagesPanel from "./MessagesPanel";
import DiscountsPanel from "./DiscountsPanel";
import TracePanel from "./TracePanel";
import { api } from "@/lib/api-client";
import { traced } from "@/lib/trace";
import { ordersStore, inventoryStore, messagesStore, discountsStore, summaryStore } from "@/lib/entity-store";

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

  const [loading, setLoading] = useState(true);
  const [lastError, setLastError] = useState(null);
  const [busyKeys, setBusyKeys] = useState(new Set());

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

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />
      <main className="mx-auto w-full max-w-[1400px] flex-1 px-6 py-6">
        {lastError && (
          <div className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-800">
            <span>{lastError}</span>
            <button type="button" onClick={() => setLastError(null)} className="text-red-500 hover:text-red-700">
              Dismiss
            </button>
          </div>
        )}

        <SummaryStrip summary={summary} loading={loading} />

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <OrdersPanel orders={orders} onUpdateStatus={handleUpdateOrderStatus} busyKeys={busyKeys} />
            <InventoryPanel items={inventory} onRestock={handleRestock} busyKeys={busyKeys} />
            <MessagesPanel messages={messages} onReply={handleReply} busyKeys={busyKeys} />
            <DiscountsPanel
              discounts={discounts}
              onCreate={handleCreateDiscount}
              busy={busyKeys.has("discount:create")}
            />
          </div>
          <TracePanel />
        </div>
      </main>
    </div>
  );
}
