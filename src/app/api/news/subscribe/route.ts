import { NextRequest, NextResponse } from "next/server";
import { addSubscription, isPushConfigured, removeSubscription, PushSubscriptionJson } from "@/lib/news/push";

export const dynamic = "force-dynamic";

function isValidSubscription(body: unknown): body is { subscription: PushSubscriptionJson } {
  if (!body || typeof body !== "object") return false;
  const sub = (body as { subscription?: unknown }).subscription;
  if (!sub || typeof sub !== "object") return false;
  const { endpoint, keys } = sub as { endpoint?: unknown; keys?: { p256dh?: unknown; auth?: unknown } };
  return (
    typeof endpoint === "string" &&
    endpoint.length > 0 &&
    !!keys &&
    typeof keys.p256dh === "string" &&
    typeof keys.auth === "string"
  );
}

/** Registers a browser's push subscription so it receives major breaking-news alerts. */
export async function POST(request: NextRequest) {
  if (!isPushConfigured()) {
    return NextResponse.json({ error: "Push notifications are not configured" }, { status: 500 });
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (!isValidSubscription(body)) {
    return NextResponse.json({ error: "Missing or malformed subscription" }, { status: 400 });
  }
  await addSubscription(body.subscription);
  return NextResponse.json({ ok: true });
}

/** Unregisters a browser's push subscription (called when the user turns alerts off). */
export async function DELETE(request: NextRequest) {
  if (!isPushConfigured()) {
    return NextResponse.json({ error: "Push notifications are not configured" }, { status: 500 });
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const endpoint = (body as { endpoint?: unknown })?.endpoint;
  if (typeof endpoint !== "string" || endpoint.length === 0) {
    return NextResponse.json({ error: "Missing endpoint" }, { status: 400 });
  }
  await removeSubscription(endpoint);
  return NextResponse.json({ ok: true });
}
