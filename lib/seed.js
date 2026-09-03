// Fixture data used to seed a brand-new session's store. Each function
// returns a fresh array — callers own the copy they get back.

export function seedOrders() {
  return [
    {
      id: "ord_1001",
      customerName: "Priya Nair",
      items: [{ sku: "MUG-001", name: "Ceramic Camp Mug", qty: 2 }],
      total: 27.98,
      status: "unfulfilled",
      placedAt: "2026-08-30T14:12:00.000Z",
    },
    {
      id: "ord_1002",
      customerName: "Diego Ramirez",
      items: [
        { sku: "TOTE-004", name: "Canvas Tote Bag", qty: 1 },
        { sku: "CAND-002", name: "Cedar & Sage Candle", qty: 3 },
      ],
      total: 64.5,
      status: "unfulfilled",
      placedAt: "2026-08-31T09:03:00.000Z",
    },
    {
      id: "ord_1003",
      customerName: "Hannah Kim",
      items: [{ sku: "NOTE-003", name: "Linen Notebook", qty: 1 }],
      total: 18.0,
      status: "fulfilled",
      placedAt: "2026-08-28T17:45:00.000Z",
    },
    {
      id: "ord_1004",
      customerName: "Marcus Webb",
      items: [{ sku: "MUG-001", name: "Ceramic Camp Mug", qty: 1 }],
      total: 13.99,
      status: "refund_requested",
      placedAt: "2026-08-27T11:20:00.000Z",
    },
    {
      id: "ord_1005",
      customerName: "Aiko Tanaka",
      items: [
        { sku: "CAND-002", name: "Cedar & Sage Candle", qty: 2 },
        { sku: "SOAP-005", name: "Oat Milk Soap Bar", qty: 4 },
      ],
      total: 48.75,
      status: "unfulfilled",
      placedAt: "2026-09-01T08:30:00.000Z",
    },
    {
      id: "ord_1006",
      customerName: "Leo Fischer",
      items: [{ sku: "TOTE-004", name: "Canvas Tote Bag", qty: 2 }],
      total: 51.0,
      status: "fulfilled",
      placedAt: "2026-08-25T13:10:00.000Z",
    },
  ];
}

export function seedInventory() {
  return [
    { sku: "MUG-001", name: "Ceramic Camp Mug", stock: 4, threshold: 10, price: 13.99 },
    { sku: "TOTE-004", name: "Canvas Tote Bag", stock: 22, threshold: 8, price: 25.5 },
    { sku: "CAND-002", name: "Cedar & Sage Candle", stock: 2, threshold: 6, price: 16.25 },
    { sku: "NOTE-003", name: "Linen Notebook", stock: 15, threshold: 5, price: 18.0 },
    { sku: "SOAP-005", name: "Oat Milk Soap Bar", stock: 30, threshold: 10, price: 8.5 },
    { sku: "SCRF-006", name: "Wool Blend Scarf", stock: 9, threshold: 4, price: 34.0 },
    { sku: "PLNT-007", name: "Terracotta Planter", stock: 12, threshold: 5, price: 21.0 },
    { sku: "TEA-008", name: "Loose Leaf Tea Tin", stock: 18, threshold: 6, price: 14.75 },
  ];
}

export function seedMessages() {
  return [
    {
      id: "msg_2001",
      customerName: "Priya Nair",
      subject: "When will my order ship?",
      body: "Hi! I ordered two camp mugs a couple days ago and haven't seen a shipping update yet. Can you check on it?",
      status: "open",
      draftReply: null,
    },
    {
      id: "msg_2002",
      customerName: "Marcus Webb",
      subject: "Requesting a refund",
      body: "The mug I received arrived with a chip on the rim. I'd like a refund for this order please.",
      status: "open",
      draftReply: null,
    },
    {
      id: "msg_2003",
      customerName: "Hannah Kim",
      subject: "Loved the notebook!",
      body: "Just wanted to say the linen notebook is even nicer in person. Will definitely order again.",
      status: "replied",
      draftReply: "Thank you so much, Hannah! We're thrilled you love it — can't wait to have you back.",
    },
    {
      id: "msg_2004",
      customerName: "Leo Fischer",
      subject: "Bulk order question",
      body: "Do you offer a discount if I order 10+ tote bags for a team event?",
      status: "open",
      draftReply: null,
    },
  ];
}

export function seedDiscounts() {
  return [];
}
