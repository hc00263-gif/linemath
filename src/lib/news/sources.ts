import { NewsSportId } from "./types";

export interface NewsSource {
  sport: NewsSportId;
  name: string;
  url: string;
}

/**
 * Official outlet RSS feeds, verified reachable at build time (see project notes).
 * No API key required for any of these — deliberately free-tier only for Phase 1.
 *
 * Known gaps (flagged rather than silently missing coverage):
 * - UFC.com's own feed blocks non-browser requests (403); Sherdog + ESPN MMA cover it instead.
 * - No dedicated MLS/USMNT/USWNT feed exists from a major outlet; "soccer-usa" relies on
 *   ESPN's general soccer feed, which is US-audience-facing but not MLS-exclusive.
 * - "soccer-euro" leans on UK outlets (BBC, Sky Sports), which skew toward the Premier League.
 */
export const NEWS_SOURCES: NewsSource[] = [
  { sport: "nfl", name: "ESPN NFL", url: "https://www.espn.com/espn/rss/nfl/news" },
  { sport: "nfl", name: "BBC American Football", url: "https://feeds.bbci.co.uk/sport/american-football/rss.xml" },

  { sport: "nba", name: "ESPN NBA", url: "https://www.espn.com/espn/rss/nba/news" },

  { sport: "nhl", name: "ESPN NHL", url: "https://www.espn.com/espn/rss/nhl/news" },

  { sport: "tennis", name: "ESPN Tennis", url: "https://www.espn.com/espn/rss/tennis/news" },
  { sport: "tennis", name: "BBC Tennis", url: "https://feeds.bbci.co.uk/sport/tennis/rss.xml" },

  { sport: "ufc", name: "Sherdog", url: "https://www.sherdog.com/rss/news.xml" },
  { sport: "ufc", name: "ESPN MMA", url: "https://www.espn.com/espn/rss/mma/news" },

  { sport: "soccer-euro", name: "BBC Football", url: "https://feeds.bbci.co.uk/sport/football/rss.xml" },
  { sport: "soccer-euro", name: "Sky Sports News", url: "https://www.skysports.com/rss/12040" },
  { sport: "soccer-euro", name: "Sky Sports Transfer Centre", url: "https://www.skysports.com/rss/12691" },

  { sport: "soccer-usa", name: "ESPN Soccer", url: "https://www.espn.com/espn/rss/soccer/news" },
];
