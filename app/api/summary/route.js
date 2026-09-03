import { getSessionId } from "@/lib/session";
import { getEntities } from "@/lib/store";
import { jsonOk } from "@/lib/api-helpers";

export async function GET() {
  const sessionId = await getSessionId();

  const [orders, inventory, messages] = await Promise.all([
    getEntities("orders", sessionId),
    getEntities("inventory", sessionId),
    getEntities("messages", sessionId),
  ]);

  return jsonOk({
    unfulfilledOrders: orders.filter((o) => o.status === "unfulfilled").length,
    lowStockItems: inventory.filter((i) => i.stock < i.threshold).length,
    openMessages: messages.filter((m) => m.status === "open").length,
  });
}
