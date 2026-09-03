import { cookies } from "next/headers";
import { randomUUID } from "crypto";

const COOKIE_NAME = "merchanthq_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

// Reads the session id from the request cookie, creating and persisting a
// new one if this is the visitor's first request. Must be called from a
// Route Handler (has write access to cookies), not from a Server Component.
export async function getSessionId() {
  const store = await cookies();
  const existing = store.get(COOKIE_NAME)?.value;
  if (existing) return existing;

  const sessionId = randomUUID();
  store.set(COOKIE_NAME, sessionId, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
  return sessionId;
}
