import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { GUIDES } from "@/lib/guides";
import { InfoPage } from "@/components/layout/InfoPage";

export const metadata: Metadata = pageMetadata({
  title: "Sports Betting Math Guides",
  description: "Plain-English guides to American odds, vig, parlays, and the math behind every LineMath calculator.",
  path: "/guides",
});

export default function GuidesPage() {
  return (
    <InfoPage title="Betting Math Guides" intro="The ideas behind the calculators, explained with worked examples.">
      <div className="grid gap-3.5">
        {GUIDES.map((guide) => (
          <Link key={guide.slug} href={`/guides/${guide.slug}`} className="rounded-xl border border-line bg-surface p-5 transition-colors hover:border-accent/50">
            <h2 className="text-base font-semibold text-ink">{guide.title}</h2>
            <p className="mt-1 text-[13px] text-ink-dim">{guide.description}</p>
          </Link>
        ))}
      </div>
    </InfoPage>
  );
}
