import { kvGet, kvSet } from "./kv";
import { seedOrders, seedInventory, seedMessages, seedDiscounts } from "./seed";

const SEEDERS = {
  orders: seedOrders,
  inventory: seedInventory,
  messages: seedMessages,
  discounts: seedDiscounts,
};

function keyFor(entity, sessionId) {
  return `${entity}:${sessionId}`;
}

// Reads an entity list for a session, seeding it with fixture data on
// first access so every new visitor gets the same realistic starting store.
export async function getEntities(entity, sessionId) {
  const seeder = SEEDERS[entity];
  if (!seeder) throw new Error(`Unknown entity: ${entity}`);

  const key = keyFor(entity, sessionId);
  const existing = await kvGet(key);
  if (existing) return existing;

  const seeded = seeder();
  await kvSet(key, seeded);
  return seeded;
}

export async function setEntities(entity, sessionId, data) {
  if (!SEEDERS[entity]) throw new Error(`Unknown entity: ${entity}`);
  await kvSet(keyFor(entity, sessionId), data);
}
