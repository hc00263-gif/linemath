import { ReactNode } from "react";
import Link from "next/link";
import { GUIDES, GuideMeta } from "@/lib/guides";
import { getCalculator } from "@/lib/calculators";
import { SITE_URL } from "@/lib/seo";
import { InfoPage } from "./InfoPage";

/** Guide page chrome: Article JSON-LD, calculator CTAs, and links to the other guides. */
export function GuideLayout({ guide, children }: { guide: GuideMeta; children: ReactNode }) {
  const ld = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    mainEntityOfPage: `${SITE_URL}/guides/${guide.slug}`,
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
  const calcs = guide.calculators.map((s) => getCalculator(s)).filter((c): c is NonNullable<typeof c> => Boolean(c));
  const others = GUIDES.filter((g) => g.slug !== guide.slug);
  return (
    <InfoPage title={guide.title} intro={guide.description}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      {children}
      <div className="mt-4 flex flex-col gap-3 rounded-xl border border-line bg-surface p-5">
        <div className="font-mono text-xs tracking-wide text-ink-dim uppercase">Try it yourself</div>
        <div className="flex flex-wrap gap-2">
          {calcs.map((c) => (
            <Link key={c.slug} href={`/${c.slug}`} className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-ink hover:brightness-110">
              {c.shortTitle} →
            </Link>
          ))}
        </div>
      </div>
      <nav aria-label="More guides" className="flex flex-wrap gap-2 text-sm">
        {others.map((g) => (
          <Link key={g.slug} href={`/guides/${g.slug}`} className="rounded-full border border-line px-3 py-1.5 hover:border-accent/50">
            {g.title}
          </Link>
        ))}
      </nav>
    </InfoPage>
  );
}
