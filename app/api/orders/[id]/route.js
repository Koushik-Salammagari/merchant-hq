import { getSessionId } from "@/lib/session";
import { getEntities, setEntities } from "@/lib/store";
import { jsonOk, jsonError } from "@/lib/api-helpers";

const VALID_STATUSES = ["unfulfilled", "fulfilled", "refund_requested"];

export async function PATCH(request, { params }) {
  const { id } = await params;
  const sessionId = await getSessionId();

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonError("Request body must be valid JSON");
  }

  const { status } = body ?? {};
  if (!status || !VALID_STATUSES.includes(status)) {
    return jsonError(`"status" is required and must be one of: ${VALID_STATUSES.join(", ")}`);
  }

  const orders = await getEntities("orders", sessionId);
  const index = orders.findIndex((o) => o.id === id);
  if (index === -1) {
    return jsonError(`No order found with id "${id}"`, 404);
  }

  const updated = { ...orders[index], status };
  const nextOrders = [...orders];
  nextOrders[index] = updated;
  await setEntities("orders", sessionId, nextOrders);

  return jsonOk({ order: updated });
}
