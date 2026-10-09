import type { MetadataRoute } from "next";
import { CALCULATORS } from "@/lib/calculators";
import { GUIDES } from "@/lib/guides";
import { ALL_ODDS, oddsToSlug } from "@/lib/oddsPages";
import { SITE_URL } from "@/lib/seo";

type Entry = MetadataRoute.Sitemap[number];

/** Sports pages backed by demo data are deliberately noindex and therefore left out (/calendar, /matches). */
const SPORTS_INDEXABLE = ["/players", "/news"];
const INFO_PAGES = ["/about", "/guides", "/odds", "/embed", "/responsible-gambling", "/advertising-disclosure", "/terms", "/privacy"];

/**
 * lastModified is omitted for static pages on purpose: stamping every URL with "now" on every build
 * teaches crawlers to ignore the field. Only the news feed, which genuinely changes, carries one.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const entry = (path: string, extra: Partial<Entry> = {}): Entry => ({ url: `${SITE_URL}${path}`, ...extra });
  return [
    entry("", { priority: 1 }),
    ...CALCULATORS.map((c) => entry(`/${c.slug}`, { priority: 0.8 })),
    ...GUIDES.map((g) => entry(`/guides/${g.slug}`, { priority: 0.7 })),
    ...ALL_ODDS.map((o) => entry(`/odds/${oddsToSlug(o)}`, { priority: 0.5 })),
    ...SPORTS_INDEXABLE.map((p) => (p === "/news" ? entry(p, { lastModified: new Date(), priority: 0.8 }) : entry(p, { priority: 0.5 }))),
    ...INFO_PAGES.map((p) => entry(p, { priority: 0.4 })),
  ];
}
