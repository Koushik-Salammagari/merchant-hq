import { getSessionId } from "@/lib/session";
import { getEntities } from "@/lib/store";
import { jsonOk } from "@/lib/api-helpers";

export async function GET(request) {
  const sessionId = await getSessionId();
  const lowStockOnly = request.nextUrl.searchParams.get("lowStockOnly") === "true";

  const items = await getEntities("inventory", sessionId);
  const filtered = lowStockOnly ? items.filter((i) => i.stock < i.threshold) : items;
  return jsonOk({ inventory: filtered });
}
