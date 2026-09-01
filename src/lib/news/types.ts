export type NewsSportId =
  | "nfl"
  | "nba"
  | "nhl"
  | "tennis"
  | "ufc"
  | "soccer-euro"
  | "soccer-usa";

export const NEWS_SPORT_LABELS: Record<NewsSportId, string> = {
  nfl: "NFL",
  nba: "NBA",
  nhl: "NHL",
  tennis: "Tennis",
  ufc: "UFC",
  "soccer-euro": "European Soccer",
  "soccer-usa": "USA Soccer",
};

/** A single normalized news item, before or after LLM classification. */
export interface NewsItem {
  /** Stable id derived from the source link — used for dedup. */
  id: string;
  sport: NewsSportId;
  source: string;
  title: string;
  link: string;
  /** ISO 8601 publish time as reported by the feed, or ingest time if the feed omits it. */
  publishedAt: string;
  /** When this item was first stored by our ingest job. */
  ingestedAt: string;
  /** Set once the classification step has run; undefined for not-yet-classified items. */
  isMajor?: boolean;
  /** One-line, LLM-written summary of why this matters, or null if classification was skipped. */
  summary?: string | null;
}
