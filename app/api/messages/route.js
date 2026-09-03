import { getSessionId } from "@/lib/session";
import { getEntities } from "@/lib/store";
import { jsonOk, jsonError } from "@/lib/api-helpers";

const VALID_STATUSES = ["open", "replied"];

export async function GET(request) {
  const sessionId = await getSessionId();
  const status = request.nextUrl.searchParams.get("status");

  if (status && !VALID_STATUSES.includes(status)) {
    return jsonError(`Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`);
  }

  const messages = await getEntities("messages", sessionId);
  const filtered = status ? messages.filter((m) => m.status === status) : messages;
  return jsonOk({ messages: filtered });
}
