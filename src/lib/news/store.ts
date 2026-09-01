import { Redis } from "@upstash/redis";
import { NewsItem } from "./types";

const SEEN_SET_KEY = "news:seen-ids";
const FEED_KEY = "news:feed";
/** Bound the feed so Redis usage (and the news page) stay small — Tier 1 is a rolling window, not an archive. */
const MAX_FEED_SIZE = 500;

let client: Redis | null = null;

export function isStoreConfigured(): boolean {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

function getClient(): Redis {
  if (!isStoreConfigured()) {
    throw new Error(
      "News store is not configured: set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN " +
        "(from an Upstash Redis database) as environment variables."
    );
  }
  if (!client) {
    client = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  }
  return client;
}

/** Splits a batch of items into ones never seen before and ones already stored. */
export async function filterUnseen(items: NewsItem[]): Promise<NewsItem[]> {
  if (items.length === 0) return [];
  const redis = getClient();
  const alreadySeenFlags = await Promise.all(items.map((item) => redis.sismember(SEEN_SET_KEY, item.id)));
  return items.filter((_, index) => alreadySeenFlags[index] === 0);
}

/** Persists classified items: marks their ids seen, adds them to the time-ordered feed, and trims the feed. */
export async function saveItems(items: NewsItem[]): Promise<void> {
  if (items.length === 0) return;
  const redis = getClient();
  const ids = items.map((item) => item.id) as [string, ...string[]];
  await redis.sadd(SEEN_SET_KEY, ...ids);

  const scored: [number, string][] = items.map((item) => [
    Date.parse(item.publishedAt) || Date.now(),
    JSON.stringify(item),
  ]);
  await Promise.all(scored.map(([score, member]) => redis.zadd(FEED_KEY, { score, member })));

  // Trim to the most recent MAX_FEED_SIZE entries.
  await redis.zremrangebyrank(FEED_KEY, 0, -(MAX_FEED_SIZE + 1));
}

/** Returns the most recent items, newest first, optionally filtered to a single sport. */
export async function getRecentItems(limit = 100): Promise<NewsItem[]> {
  const redis = getClient();
  const raw = await redis.zrange<string[]>(FEED_KEY, 0, limit - 1, { rev: true });
  return raw
    .map((entry) => {
      try {
        // The Upstash client sometimes auto-parses JSON members; guard against both shapes.
        return typeof entry === "string" ? (JSON.parse(entry) as NewsItem) : (entry as unknown as NewsItem);
      } catch {
        return null;
      }
    })
    .filter((item): item is NewsItem => item !== null);
}
