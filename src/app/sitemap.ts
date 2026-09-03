import type { MetadataRoute } from "next";

const SITE_URL = "https://www.linemath.com";

/** Static, indexable routes. Dynamic per-match/per-player detail pages are intentionally
 * omitted — there's no stable, enumerable list of them, and search engines discover them fine
 * through normal crawling of the /matches and /players lookup pages. */
const ROUTES: { path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }[] = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/odds-converter", changeFrequency: "monthly", priority: 0.8 },
  { path: "/betting-odds-calculator", changeFrequency: "monthly", priority: 0.8 },
  { path: "/parlay-calculator", changeFrequency: "monthly", priority: 0.8 },
  { path: "/hedge-calculator", changeFrequency: "monthly", priority: 0.8 },
  { path: "/bonus-bet-calculator", changeFrequency: "monthly", priority: 0.8 },
  { path: "/fantasy-points-calculator", changeFrequency: "monthly", priority: 0.7 },
  { path: "/draft-pick-calculator", changeFrequency: "monthly", priority: 0.7 },
  { path: "/calendar", changeFrequency: "daily", priority: 0.6 },
  { path: "/matches", changeFrequency: "daily", priority: 0.6 },
  { path: "/players", changeFrequency: "weekly", priority: 0.5 },
  { path: "/news", changeFrequency: "hourly", priority: 0.9 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
