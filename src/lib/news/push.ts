import { createHash } from "crypto";
import webpush from "web-push";
import { Redis } from "@upstash/redis";
import { NewsItem } from "./types";

const SUBSCRIBERS_KEY = "news:push-subscribers";

export interface PushSubscriptionJson {
  endpoint: string;
  keys: { p256dh: string; auth: string };
}

let client: Redis | null = null;
let vapidConfigured = false;

export function isPushConfigured(): boolean {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL &&
      process.env.UPSTASH_REDIS_REST_TOKEN &&
      process.env.VAPID_PUBLIC_KEY &&
      process.env.VAPID_PRIVATE_KEY &&
      process.env.VAPID_SUBJECT
  );
}

function getClient(): Redis {
  if (!client) {
    client = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  }
  return client;
}

function ensureVapid(): void {
  if (vapidConfigured) return;
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT!,
    process.env.VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  );
  vapidConfigured = true;
}

/** Derives a short, stable Redis field key from a subscription's endpoint URL (which is unique
 * per browser+device registration). Pure function so it's easy to unit test. */
export function subscriptionKey(endpoint: string): string {
  return createHash("sha256").update(endpoint).digest("hex").slice(0, 32);
}

export async function addSubscription(subscription: PushSubscriptionJson): Promise<void> {
  const redis = getClient();
  await redis.hset(SUBSCRIBERS_KEY, { [subscriptionKey(subscription.endpoint)]: JSON.stringify(subscription) });
}

export async function removeSubscription(endpoint: string): Promise<void> {
  const redis = getClient();
  await redis.hdel(SUBSCRIBERS_KEY, subscriptionKey(endpoint));
}

/** Sends a push notification for each major item to every subscriber, pruning any subscription
 * the push service reports as gone (404/410 — the user uninstalled, cleared data, etc). */
export async function notifyMajorItems(items: NewsItem[]): Promise<void> {
  const majorItems = items.filter((item) => item.isMajor === true);
  if (majorItems.length === 0 || !isPushConfigured()) return;

  ensureVapid();
  const redis = getClient();
  const subscribers = await redis.hgetall<Record<string, string>>(SUBSCRIBERS_KEY);
  if (!subscribers) return;
  const entries = Object.entries(subscribers);
  if (entries.length === 0) return;

  for (const item of majorItems) {
    const payload = JSON.stringify({
      title: `${item.sport.toUpperCase()}: ${item.title}`,
      body: item.summary || item.source,
      url: item.link,
    });

    await Promise.all(
      entries.map(async ([key, raw]) => {
        try {
          const subscription: PushSubscriptionJson =
            typeof raw === "string" ? JSON.parse(raw) : (raw as unknown as PushSubscriptionJson);
          await webpush.sendNotification(subscription, payload);
        } catch (err) {
          const statusCode = (err as { statusCode?: number })?.statusCode;
          if (statusCode === 404 || statusCode === 410) {
            await redis.hdel(SUBSCRIBERS_KEY, key);
          } else {
            console.error(`[news] push send failed for subscriber ${key}: ${err instanceof Error ? err.message : String(err)}`);
          }
        }
      })
    );
  }
}
