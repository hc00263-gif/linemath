"use client";

import { useMemo, useState } from "react";
import { NewsItem, NewsSportId, NEWS_SPORT_LABELS } from "@/lib/news/types";

function timeAgo(iso: string): string {
  const diffMs = Date.now() - Date.parse(iso);
  const minutes = Math.round(diffMs / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

function NewsRow({ item }: { item: NewsItem }) {
  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="flex flex-col gap-1.5 rounded-xl border border-line bg-surface p-4 transition-colors hover:border-accent/50"
    >
      <div className="flex items-center gap-2">
        <span className="font-mono text-xs font-medium tracking-wide text-ink-dim uppercase">
          {NEWS_SPORT_LABELS[item.sport]} · {item.source}
        </span>
        {item.isMajor && (
          <span className="rounded-full bg-positive-soft px-2 py-0.5 font-mono text-[10.5px] font-semibold tracking-wide text-positive">
            MAJOR
          </span>
        )}
        <span className="ml-auto shrink-0 text-xs text-ink-dim">{timeAgo(item.publishedAt)}</span>
      </div>
      <span className="font-medium">{item.title}</span>
      {item.summary && <span className="text-sm text-ink-dim">{item.summary}</span>}
    </a>
  );
}

export function NewsFeed({ items }: { items: NewsItem[] }) {
  const [sport, setSport] = useState<NewsSportId | "all">("all");
  const [majorOnly, setMajorOnly] = useState(false);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (sport !== "all" && item.sport !== sport) return false;
      if (majorOnly && item.isMajor !== true) return false;
      return true;
    });
  }, [items, sport, majorOnly]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={sport}
          onChange={(e) => setSport(e.target.value as NewsSportId | "all")}
          className="rounded-md border border-line bg-surface px-2.5 py-1.5 text-sm"
        >
          <option value="all">All sports</option>
          {(Object.keys(NEWS_SPORT_LABELS) as NewsSportId[]).map((id) => (
            <option key={id} value={id}>
              {NEWS_SPORT_LABELS[id]}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => setMajorOnly((v) => !v)}
          className={`rounded-md border px-2.5 py-1.5 text-sm transition-colors ${
            majorOnly ? "border-accent bg-accent/10 text-accent" : "border-line text-ink-dim hover:text-ink"
          }`}
        >
          Major only
        </button>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-ink-dim">No stories match these filters yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((item) => (
            <NewsRow key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
