# Merchant HQ

**An agent co-pilot for a store's back office, built for the WebMCP Challenge.**

## Why WebMCP fits this

Every public WebMCP commerce example out there is shopper-facing — search a catalog, manage a cart, check out. None of them are built for the person actually running the store. Merchant HQ is built for the merchant instead. Solo and small-team store owners with no staff to help run day-to-day operations are a real, underserved audience — and their back office — triaging orders, catching low stock, replying to customers, running a promo — is exactly the kind of structured, repetitive work an agent is good at.

## What it does

A human merchant works a normal dashboard — mark an order fulfilled, restock an item, reply to a customer, create a discount code. A WebMCP-capable agent visiting the same page can do the exact same things through registered tools, live, on the same data.

Both paths write through the same shared state, so any change — from a click or a tool call — updates every panel **instantly, with no reload**. Each changed row also flashes briefly to show who made it: teal for an agent, neutral slate for a human click.

## Architecture

```
 You  ──┐                                  ┌── /api/orders
         ▼                                  │
   ┌─────────────────────────────┐          ├── /api/inventory
   │ Browser tab (Next.js client)│          │
   │  ┌────────────┐ ┌──────────┐│  fetch() ├── /api/messages
   │  │ Dashboard  │ │ WebMCP   ││ ────────▶│
   │  │ UI         │ │ tools    ││          ├── /api/discounts
   │  └────────────┘ └──────────┘│          │
   └─────────────────────────────┘          ▼
         ▲                             Vercel KV (persisted,
 Agent ──┘                             session-scoped store)
```

Next.js (App Router) with API routes under `/api/*`, backed by Vercel KV (Upstash Redis) for orders, inventory, messages, and discounts. Storage is scoped by a per-visitor session cookie, so every visitor — including each judge — gets their own private sandbox store, seeded with the same realistic fixture data on first load.

## WebMCP tools

Registered on `document.modelContext` (or `navigator.modelContext`) on page load:

| Tool | Inputs | What it does |
|---|---|---|
| `get_dashboard_summary` | *(none)* | Quick counts of unfulfilled orders, low-stock items, and open messages — what needs attention right now. |
| `list_orders` | `status?` | Lists orders, optionally filtered by status. |
| `update_order_status` | `orderId`, `status` | Marks an order `fulfilled`, `refund_requested`, or `unfulfilled`. |
| `list_inventory` | `lowStockOnly?` | Lists inventory items, optionally filtered to below-threshold stock. |
| `restock_item` | `sku`, `addQty` | Increases an item's stock by a given quantity. |
| `list_messages` | `status?` | Lists customer messages, optionally filtered by status. |
| `draft_message_reply` | `messageId`, `replyText` | Saves a draft reply to a customer message and marks it replied. |
| `create_discount_code` | `percentOff`, `code?` | Creates a discount code (auto-generated if `code` is omitted) — gated behind merchant approval, see **Safety** below. |

## Observability

Every action — human or agent — writes a structured entry to a live trace panel: tool name, arguments, result, duration, and status. It's a unified timeline, not just an agent log, so cause and effect are never taken on faith.

## Safety

`create_discount_code` is the one tool with direct revenue impact, so it's gated behind the WebMCP `requestUserInteraction` API per spec: the agent's call blocks on a confirmation modal, and nothing is created until the merchant explicitly approves. A decline returns a clean (non-error) result and logs as its own `declined` status in the trace — distinct from both success and failure.

## Known limitations

- The activity trace is session-scoped and resets on reload; order/inventory/message/discount data persists via Vercel KV.
- `requestUserInteraction` is implemented per the W3C WebMCP spec, but some current agent environments (tested: Chrome's tool inspector, ChatGPT's built-in browser) don't yet fully support invoking it. In that case the tool fails closed — it refuses cleanly rather than skipping confirmation silently.
- This is a self-contained demo store with fixture data, not connected to a real Shopify account.

## Live URL

**[merchant-hq.vercel.app](https://merchant-hq.vercel.app)**

## Running locally

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000). No Vercel KV setup is required — if the KV env vars aren't set, the app automatically falls back to in-memory storage.

To exercise the WebMCP tools, open the app in a WebMCP-capable browser — ChatGPT's in-app browser, or Google Chrome with the `chrome://flags/#enable-webmcp-testing` flag enabled.

## License

MIT — see [LICENSE](./LICENSE).
