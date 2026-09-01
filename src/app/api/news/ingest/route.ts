import { NextRequest, NextResponse } from "next/server";
import { fetchAllSources } from "@/lib/news/rss";
import { filterUnseen, isStoreConfigured, saveItems } from "@/lib/news/store";
import { classifyItems } from "@/lib/news/classify";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Ingest endpoint, called on a schedule (GitHub Actions, every 5 min) rather than
 * Vercel's own cron — the Hobby plan only allows once-daily cron jobs, far too slow
 * for "near real time" news. Secured with a shared secret so it can't be spammed
 * by an outsider who finds the URL.
 */
export async function POST(request: NextRequest) {
  const expected = process.env.NEWS_INGEST_SECRET;
  if (!expected) {
    return NextResponse.json({ error: "NEWS_INGEST_SECRET is not configured" }, { status: 500 });
  }
  const provided = request.headers.get("x-news-ingest-secret");
  if (provided !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isStoreConfigured()) {
    return NextResponse.json({ error: "News store is not configured (missing Upstash env vars)" }, { status: 500 });
  }

  try {
    const fetched = await fetchAllSources();
    const unseen = await filterUnseen(fetched);
    const classified = await classifyItems(unseen);
    await saveItems(classified);

    return NextResponse.json({
      ok: true,
      fetched: fetched.length,
      new: unseen.length,
      major: classified.filter((item) => item.isMajor === true).length,
    });
  } catch (err) {
    console.error(`[news] ingest run failed: ${err instanceof Error ? err.message : String(err)}`);
    return NextResponse.json({ error: "Ingest run failed" }, { status: 500 });
  }
}

// Allow a quick manual/browser check that the route is alive without triggering a full run.
export async function GET() {
  return NextResponse.json({ ok: true, message: "POST with the x-news-ingest-secret header to run ingestion." });
}
