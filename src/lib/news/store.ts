import { Redis } from "@upstash/redis";
import { NewsItem } from "./types";

const SEEN_SET_KEY = "news:seen-ids";
const FEED_KEY = "news:feed";
/** Maps a story's stable id to the exact string currently stored as its news:feed zset member,
 * so a re-fetch of the same story (even with a retitled headline) replaces its existing feed
 * entry in place instead of creating a second one. */
const MEMBER_MAP_KEY = "news:feed-members";
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

/** Collapses items sharing the same id (e.g. an RSS entry re-fetched mid-poll with a retitled
 * headline) down to one — the last occurrence wins — so a single incoming batch can never itself
 * contain duplicate ids by the time it reaches Redis. */
function dedupeById(items: NewsItem[]): NewsItem[] {
  const byId = new Map<string, NewsItem>();
  for (const item of items) {
    byId.set(item.id, item);
  }
  return [...byId.values()];
}

/** Splits a batch of items into ones never seen before and ones already stored. Also dedupes
 * same-id items against each other within the batch itself, not just against Redis — previously
 * two same-id items in one batch could both slip through in parallel since neither had been
 * marked seen yet at check-time. */
export async function filterUnseen(items: NewsItem[]): Promise<NewsItem[]> {
  if (items.length === 0) return [];
  const deduped = dedupeById(items);
  const redis = getClient();
  const alreadySeenFlags = await Promise.all(deduped.map((item) => redis.sismember(SEEN_SET_KEY, item.id)));
  return deduped.filter((_, index) => alreadySeenFlags[index] === 0);
}

/** Persists classified items: marks their ids seen, upserts each into the time-ordered feed
 * (replacing any prior entry for the same id rather than adding a second one), and trims the
 * feed. */
export async function saveItems(items: NewsItem[]): Promise<void> {
  if (items.length === 0) return;
  const deduped = dedupeById(items);
  const redis = getClient();
  const ids = deduped.map((item) => item.id) as [string, ...string[]];
  await redis.sadd(SEEN_SET_KEY, ...ids);

  const previousMembers = await redis.hmget<Record<string, string>>(MEMBER_MAP_KEY, ...ids);

  const newMemberMap: Record<string, string> = {};
  const staleMembers: string[] = [];
  const scored: [number, string][] = [];
  for (const item of deduped) {
    const newMember = JSON.stringify(item);
    const previous = previousMembers?.[item.id];
    if (previous != null && previous !== newMember) {
      staleMembers.push(previous);
    }
    newMemberMap[item.id] = newMember;
    scored.push([Date.parse(item.publishedAt) || Date.now(), newMember]);
  }

  if (staleMembers.length > 0) {
    await redis.zrem(FEED_KEY, ...(staleMembers as [string, ...string[]]));
  }
  await Promise.all(scored.map(([score, member]) => redis.zadd(FEED_KEY, { score, member })));
  await redis.hset(MEMBER_MAP_KEY, newMemberMap);

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
