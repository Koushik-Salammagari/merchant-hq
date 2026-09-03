# Merchant HQ

**An agent co-pilot for the back office of a small e-commerce store.**

Built for the [WebMCP Challenge](https://webmcphackathon.devpost.com/) (Sep 2026), sponsored by OpenAI with Shopify, Vercel, Cloudflare, Google Chrome, and Netlify.

## What it is

Merchant HQ is a Shopify-style operations dashboard for a solo or small-team merchant — today's orders, stock levels, customer messages, and discount codes, all on one screen. A human merchant works the dashboard normally: mark an order fulfilled, restock an item, reply to a customer, spin up a discount code.

A **WebMCP-capable agent visiting the same page** can do the exact same things — live, on the same data, through the same UI. It calls tools registered directly on the page via `document.modelContext.registerTool(...)`, no screen-scraping or DOM guessing involved. Every action either the human or the agent takes — an order's status badge flipping, a stock number dropping, a draft reply appearing, a new discount chip showing up — is visible on screen and logged to a structured trace panel, so cause and effect are never just taken on faith.

## Why WebMCP fits this problem

Almost every public WebMCP commerce example is **shopper-facing**: search a catalog, manage a cart, check out. None of them are built for the person actually running the store. But the back office of a small merchant is exactly the kind of repetitive, structured, multi-step work an agent is good at — triaging unfulfilled orders, catching low stock before it becomes a stockout, drafting replies to customer messages, creating a discount code for a promo — and WebMCP is what lets an agent do that *directly on the merchant's own dashboard*, with structured inputs and outputs, instead of a bespoke backend integration. The merchant keeps the UI they already trust; the agent gets a well-typed contract for acting on it.

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

- **Frontend:** Next.js (App Router, JavaScript), deployed on Vercel.
- **Backend:** Next.js API routes (Route Handlers) under `/api/*`.
- **Persistence:** Vercel KV (Upstash Redis), scoped by a per-visitor session cookie, with an in-memory fallback so the app runs locally with no KV store attached. Every session is seeded on first read with the same realistic fixture data — its own private sandbox store.
- **WebMCP tools:** registered client-side on mount and backed by the same API routes the dashboard UI calls, so there's one source of truth for state regardless of whether a human or an agent changed it.
- **Tracing:** every tool call and every human action writes a structured entry — who did it, what tool, what args, what result, how long it took, whether it errored — rendered as an expandable, unified timeline in the dashboard's side panel.

## WebMCP tools

Registered on `document.modelContext` by the dashboard on mount:

| Tool | Inputs | What it does |
|---|---|---|
| `get_dashboard_summary` | *(none)* | Returns `{ unfulfilledOrders, lowStockItems, openMessages }` — quick counts for "what needs my attention." |
| `list_orders` | `status?` | Returns matching orders. Call before `update_order_status` to get valid ids. |
| `update_order_status` | `orderId`, `status` | Marks an order `fulfilled`, `refund_requested`, or `unfulfilled`. |
| `list_inventory` | `lowStockOnly?` | Returns inventory items, optionally filtered to below-threshold. |
| `restock_item` | `sku`, `addQty` | Increases an item's stock. |
| `list_messages` | `status?` | Returns customer messages. |
| `draft_message_reply` | `messageId`, `replyText` | Saves a draft reply and marks the message `replied`. |
| `create_discount_code` | `percentOff`, `code?` | Creates a new discount code (auto-generates a code if omitted). |

## Running locally

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

No Vercel KV / Upstash store is required locally — if `KV_REST_API_URL` and `KV_REST_API_TOKEN` aren't set, the app transparently falls back to an in-memory store for the life of the dev server process. To use real persistence, attach a Vercel KV (Upstash Redis) integration in the Vercel dashboard and pull the resulting env vars with `vercel env pull`.

To exercise the WebMCP tools, open the app in a WebMCP-capable browser — ChatGPT's in-app browser, or Google Chrome with the `chrome://flags/#enable-webmcp-testing` flag enabled.

## License

MIT — see [LICENSE](./LICENSE).
