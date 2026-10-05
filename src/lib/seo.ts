import type { Metadata } from "next";

export const SITE_URL = "https://www.linemath.com";

interface PageMetadataInput {
  title: string;
  description: string;
  /** Path starting with "/", e.g. "/parlay-calculator". */
  path: string;
  /** Keep the page out of search results (demo data, thin or unbounded detail pages). */
  noindex?: boolean;
}

/**
 * Per-page metadata with canonical URL and matching Open Graph / Twitter fields. Next shallow-
 * merges `openGraph` from the root layout, so a page that sets none inherits the HOMEPAGE's
 * title and URL — every page must set its own.
 */
export function pageMetadata({ title, description, path, noindex }: PageMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", title, description, url: `${SITE_URL}${path}`, siteName: "LineMath" },
    twitter: { card: "summary_large_image", title, description },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}
