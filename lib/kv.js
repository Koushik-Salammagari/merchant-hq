// Thin KV wrapper: uses Vercel KV (Upstash Redis) when credentials are
// present, otherwise falls back to an in-process in-memory store so
// `npm run dev` works before KV is attached in the Vercel dashboard.
//
// The in-memory store only lives for the life of the dev server process
// (reset on restart / hot-reload of this module) — fine for local demoing,
// not for production, where real KV env vars will be set.

const hasKvCredentials = Boolean(
  process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
);

let kvClient = null;
if (hasKvCredentials) {
  const { kv } = await import("@vercel/kv");
  kvClient = kv;
}

const memoryStore = globalThis.__merchantHqMemoryStore ?? new Map();
globalThis.__merchantHqMemoryStore = memoryStore;

export async function kvGet(key) {
  if (kvClient) {
    return (await kvClient.get(key)) ?? null;
  }
  return memoryStore.has(key) ? memoryStore.get(key) : null;
}

export async function kvSet(key, value) {
  if (kvClient) {
    await kvClient.set(key, value);
    return;
  }
  memoryStore.set(key, value);
}

export function isUsingRealKv() {
  return hasKvCredentials;
}
