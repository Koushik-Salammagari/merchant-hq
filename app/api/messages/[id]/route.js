import { getSessionId } from "@/lib/session";
import { getEntities, setEntities } from "@/lib/store";
import { jsonOk, jsonError } from "@/lib/api-helpers";

export async function PATCH(request, { params }) {
  const { id } = await params;
  const sessionId = await getSessionId();

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonError("Request body must be valid JSON");
  }

  const { replyText } = body ?? {};
  if (typeof replyText !== "string" || replyText.trim().length === 0) {
    return jsonError('"replyText" is required and must be a non-empty string');
  }

  const messages = await getEntities("messages", sessionId);
  const index = messages.findIndex((m) => m.id === id);
  if (index === -1) {
    return jsonError(`No message found with id "${id}"`, 404);
  }

  const updated = { ...messages[index], draftReply: replyText, status: "replied" };
  const nextMessages = [...messages];
  nextMessages[index] = updated;
  await setEntities("messages", sessionId, nextMessages);

  return jsonOk({ message: updated });
}
