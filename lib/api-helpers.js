import { NextResponse } from "next/server";

export function jsonOk(data, init) {
  return NextResponse.json(data, { status: 200, ...init });
}

export function jsonError(message, status = 400) {
  return NextResponse.json({ error: message }, { status });
}
