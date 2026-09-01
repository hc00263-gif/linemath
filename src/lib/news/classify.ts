import { NewsItem } from "./types";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
/**
 * A current OpenRouter free-tier (":free" suffix) model. The free roster changes as
 * providers adjust hosting — check https://openrouter.ai/models?max_price=0 if this
 * one disappears, and swap the constant below.
 */
const MODEL = "z-ai/glm-5.2:free";
/** Keep batches small: fewer tokens per call, and one bad item can't derail the whole batch. */
const BATCH_SIZE = 25;
const REQUEST_TIMEOUT_MS = 30_000;

interface Classification {
  id: string;
  isMajor: boolean;
  summary: string;
}

export function isClassifierConfigured(): boolean {
  return Boolean(process.env.OPENROUTER_API_KEY);
}

function buildPrompt(items: NewsItem[]): string {
  const list = items.map((item) => `- id: ${item.id}\n  sport: ${item.sport}\n  headline: ${item.title}`).join("\n");
  return (
    "You are a sports news editor. For each headline below, decide if it is MAJOR " +
    "(a real breaking story: injury to a starter/star, trade, signing, suspension, " +
    "fight/game result, coaching change, major transfer, major upset) versus ROUTINE " +
    "(previews, opinion columns, minor roster moves, recaps of games already widely known, filler).\n\n" +
    "Respond with ONLY a JSON array, one object per headline, in this exact shape:\n" +
    '[{"id": "<id>", "isMajor": true|false, "summary": "<one short plain sentence, or empty string if not major>"}]\n\n' +
    `Headlines:\n${list}`
  );
}

export function parseClassifications(raw: string): Classification[] {
  // Models occasionally wrap JSON in prose or code fences despite instructions — pull out the array.
  const match = raw.match(/\[[\s\S]*\]/);
  if (!match) return [];
  try {
    const parsed = JSON.parse(match[0]);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (entry): entry is Classification =>
        entry && typeof entry.id === "string" && typeof entry.isMajor === "boolean"
    );
  } catch {
    return [];
  }
}

async function classifyBatch(items: NewsItem[]): Promise<NewsItem[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(OPENROUTER_URL, {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://linemath.com",
        "X-Title": "LineMath News Classifier",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "user", content: buildPrompt(items) }],
        temperature: 0,
      }),
    });
    if (!res.ok) {
      console.error(`[news] OpenRouter classify failed: HTTP ${res.status} ${await res.text()}`);
      return items;
    }
    const data = await res.json();
    const content: string = data?.choices?.[0]?.message?.content ?? "";
    const classifications = parseClassifications(content);
    const byId = new Map(classifications.map((c) => [c.id, c]));
    return items.map((item) => {
      const result = byId.get(item.id);
      if (!result) return item;
      return { ...item, isMajor: result.isMajor, summary: result.summary || null };
    });
  } catch (err) {
    console.error(`[news] OpenRouter classify error: ${err instanceof Error ? err.message : String(err)}`);
    return items;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Classifies every item as major/routine with a short summary. If OPENROUTER_API_KEY
 * isn't set, or a batch call fails, items pass through unclassified (isMajor stays
 * undefined) rather than the whole ingest run failing.
 */
export async function classifyItems(items: NewsItem[]): Promise<NewsItem[]> {
  if (items.length === 0 || !isClassifierConfigured()) return items;

  const batches: NewsItem[][] = [];
  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    batches.push(items.slice(i, i + BATCH_SIZE));
  }
  const results = await Promise.all(batches.map(classifyBatch));
  return results.flat();
}
