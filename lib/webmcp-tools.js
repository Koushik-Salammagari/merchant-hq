import { traced } from "./trace";

const ORDER_STATUSES = ["unfulfilled", "fulfilled", "refund_requested"];
const MESSAGE_STATUSES = ["open", "replied"];

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

// WebMCP tool results follow the MCP-style content convention so any
// WebMCP-capable agent can read them the same way it reads MCP tool output.
function toolResult(data) {
  return { content: [{ type: "text", text: JSON.stringify(data) }] };
}

function tool(name, description, inputSchema, run, describeResult) {
  return {
    name,
    description,
    inputSchema,
    async execute(args) {
      const data = await traced({
        who: "agent",
        tool: name,
        args,
        action: () => run(args ?? {}),
        describeResult: describeResult ?? (() => "ok"),
      });
      return toolResult(data);
    },
  };
}

export function buildToolDefinitions() {
  return [
    tool(
      "get_dashboard_summary",
      "Returns quick counts of what needs the merchant's attention right now: unfulfilled orders, low-stock inventory items, and open customer messages. Good first call to orient on the state of the store.",
      { type: "object", properties: {}, required: [] },
      () => fetchJson("/api/summary"),
      (d) => `${d.unfulfilledOrders} unfulfilled, ${d.lowStockItems} low stock, ${d.openMessages} open messages`
    ),

    tool(
      "list_orders",
      "Lists orders, optionally filtered by status. Call this before update_order_status to find a valid orderId.",
      {
        type: "object",
        properties: {
          status: { type: "string", enum: ORDER_STATUSES, description: "Filter to orders with this status. Omit to list all orders." },
        },
        required: [],
      },
      ({ status }) => fetchJson(`/api/orders${status ? `?status=${encodeURIComponent(status)}` : ""}`),
      (d) => `${d.orders.length} order(s)`
    ),

    tool(
      "update_order_status",
      'Marks an order as fulfilled, refund_requested, or unfulfilled. Requires a valid orderId from list_orders.',
      {
        type: "object",
        properties: {
          orderId: { type: "string", description: "The order id, e.g. ord_1001. Get this from list_orders." },
          status: { type: "string", enum: ORDER_STATUSES, description: "The new status to set." },
        },
        required: ["orderId", "status"],
      },
      ({ orderId, status }) =>
        fetchJson(`/api/orders/${encodeURIComponent(orderId)}`, {
          method: "PATCH",
          body: JSON.stringify({ status }),
        }),
      (d) => `order ${d.order.id} -> ${d.order.status}`
    ),

    tool(
      "list_inventory",
      "Lists inventory items, optionally filtered to only items whose stock is below their restock threshold.",
      {
        type: "object",
        properties: {
          lowStockOnly: { type: "boolean", description: "If true, only return items with stock below their threshold." },
        },
        required: [],
      },
      ({ lowStockOnly }) => fetchJson(`/api/inventory${lowStockOnly ? "?lowStockOnly=true" : ""}`),
      (d) => `${d.inventory.length} item(s)`
    ),

    tool(
      "restock_item",
      "Increases an inventory item's stock by a given quantity. Requires a valid sku from list_inventory.",
      {
        type: "object",
        properties: {
          sku: { type: "string", description: "The item's sku, e.g. MUG-001. Get this from list_inventory." },
          addQty: { type: "number", description: "How many units to add to current stock. Must be a positive number." },
        },
        required: ["sku", "addQty"],
      },
      ({ sku, addQty }) =>
        fetchJson(`/api/inventory/${encodeURIComponent(sku)}`, {
          method: "PATCH",
          body: JSON.stringify({ addQty }),
        }),
      (d) => `${d.item.sku} stock -> ${d.item.stock}`
    ),

    tool(
      "list_messages",
      "Lists customer messages, optionally filtered by status.",
      {
        type: "object",
        properties: {
          status: { type: "string", enum: MESSAGE_STATUSES, description: "Filter to messages with this status. Omit to list all messages." },
        },
        required: [],
      },
      ({ status }) => fetchJson(`/api/messages${status ? `?status=${encodeURIComponent(status)}` : ""}`),
      (d) => `${d.messages.length} message(s)`
    ),

    tool(
      "draft_message_reply",
      "Saves a draft reply to a customer message and marks it replied. Requires a valid messageId from list_messages.",
      {
        type: "object",
        properties: {
          messageId: { type: "string", description: "The message id, e.g. msg_2001. Get this from list_messages." },
          replyText: { type: "string", description: "The reply text to save as the draft." },
        },
        required: ["messageId", "replyText"],
      },
      ({ messageId, replyText }) =>
        fetchJson(`/api/messages/${encodeURIComponent(messageId)}`, {
          method: "PATCH",
          body: JSON.stringify({ replyText }),
        }),
      (d) => `replied to ${d.message.id}`
    ),

    tool(
      "create_discount_code",
      "Creates a new active discount code for the store. If code is omitted, one is auto-generated from the percentage off.",
      {
        type: "object",
        properties: {
          percentOff: { type: "number", description: "The discount percentage, between 1 and 100." },
          code: { type: "string", description: "Optional custom code. Auto-generated if omitted." },
        },
        required: ["percentOff"],
      },
      ({ percentOff, code }) =>
        fetchJson("/api/discounts", {
          method: "POST",
          body: JSON.stringify({ percentOff, ...(code ? { code } : {}) }),
        }),
      (d) => `created ${d.discount.code} (${d.discount.percentOff}% off)`
    ),
  ];
}
