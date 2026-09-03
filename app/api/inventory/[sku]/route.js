import { getSessionId } from "@/lib/session";
import { getEntities, setEntities } from "@/lib/store";
import { jsonOk, jsonError } from "@/lib/api-helpers";

export async function PATCH(request, { params }) {
  const { sku } = await params;
  const sessionId = await getSessionId();

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonError("Request body must be valid JSON");
  }

  const { addQty } = body ?? {};
  if (typeof addQty !== "number" || !Number.isFinite(addQty) || addQty <= 0) {
    return jsonError('"addQty" is required and must be a positive number');
  }

  const items = await getEntities("inventory", sessionId);
  const index = items.findIndex((i) => i.sku === sku);
  if (index === -1) {
    return jsonError(`No inventory item found with sku "${sku}"`, 404);
  }

  const updated = { ...items[index], stock: items[index].stock + addQty };
  const nextItems = [...items];
  nextItems[index] = updated;
  await setEntities("inventory", sessionId, nextItems);

  return jsonOk({ item: updated });
}
