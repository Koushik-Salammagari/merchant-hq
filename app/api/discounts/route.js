import { getSessionId } from "@/lib/session";
import { getEntities, setEntities } from "@/lib/store";
import { jsonOk, jsonError } from "@/lib/api-helpers";

function generateCode(percentOff) {
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `SAVE${percentOff}-${suffix}`;
}

export async function GET() {
  const sessionId = await getSessionId();
  const discounts = await getEntities("discounts", sessionId);
  return jsonOk({ discounts });
}

export async function POST(request) {
  const sessionId = await getSessionId();

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonError("Request body must be valid JSON");
  }

  const { percentOff, code } = body ?? {};
  if (typeof percentOff !== "number" || !Number.isFinite(percentOff) || percentOff <= 0 || percentOff > 100) {
    return jsonError('"percentOff" is required and must be a number between 1 and 100');
  }
  if (code !== undefined && (typeof code !== "string" || code.trim().length === 0)) {
    return jsonError('"code" must be a non-empty string when provided');
  }

  const discounts = await getEntities("discounts", sessionId);

  const finalCode = code ? code.trim().toUpperCase() : generateCode(percentOff);
  if (discounts.some((d) => d.code === finalCode)) {
    return jsonError(`A discount code "${finalCode}" already exists`, 409);
  }

  const newDiscount = {
    code: finalCode,
    percentOff,
    active: true,
    createdAt: new Date().toISOString(),
  };

  await setEntities("discounts", sessionId, [...discounts, newDiscount]);
  return jsonOk({ discount: newDiscount }, { status: 201 });
}
