import { getSessionId } from "@/lib/session";
import { getEntities } from "@/lib/store";
import { jsonOk, jsonError } from "@/lib/api-helpers";

const VALID_STATUSES = ["unfulfilled", "fulfilled", "refund_requested"];

export async function GET(request) {
  const sessionId = await getSessionId();
  const status = request.nextUrl.searchParams.get("status");

  if (status && !VALID_STATUSES.includes(status)) {
    return jsonError(`Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`);
  }

  const orders = await getEntities("orders", sessionId);
  const filtered = status ? orders.filter((o) => o.status === status) : orders;
  return jsonOk({ orders: filtered });
}
