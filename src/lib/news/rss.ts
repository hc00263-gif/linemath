import Parser from "rss-parser";
import { NEWS_SOURCES, NewsSource } from "./sources";
import { NewsItem } from "./types";

const parser = new Parser({ timeout: 10_000 });
const FETCH_TIMEOUT_MS = 12_000;

/** Deterministic id from a link, so the same story is never stored twice. */
export function newsItemId(link: string): string {
  // A simple, dependency-free string hash (FNV-1a) — good enough for a dedup key,
  // not for anything security-sensitive.
  let hash = 0x811c9dc5;
  for (let i = 0; i < link.length; i++) {
    hash ^= link.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16);
}

async function fetchOneSource(source: NewsSource, now: string): Promise<NewsItem[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(source.url, {
      signal: controller.signal,
      headers: { "User-Agent": "LineMathNewsBot/1.0 (+https://linemath.com)" },
    });
    if (!res.ok) {
      console.error(`[news] ${source.name}: HTTP ${res.status}`);
      return [];
    }
    const xml = await res.text();
    const feed = await parser.parseString(xml);
    return (feed.items ?? [])
      .filter((item): item is typeof item & { link: string; title: string } => Boolean(item.link && item.title))
      .map((item) => ({
        id: newsItemId(item.link),
        sport: source.sport,
        source: source.name,
        title: item.title.trim(),
        link: item.link,
        publishedAt: item.isoDate ?? item.pubDate ?? now,
        ingestedAt: now,
      }));
  } catch (err) {
    console.error(`[news] ${source.name}: ${err instanceof Error ? err.message : String(err)}`);
    return [];
  } finally {
    clearTimeout(timeout);
  }
}

/** Fetches every configured source in parallel. Failures are logged and skipped, not thrown. */
export async function fetchAllSources(): Promise<NewsItem[]> {
  const now = new Date().toISOString();
  const results = await Promise.all(NEWS_SOURCES.map((source) => fetchOneSource(source, now)));
  return results.flat();
}
