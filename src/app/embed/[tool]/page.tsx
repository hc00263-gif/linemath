import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { EMBED_TOOLS, getEmbedTool } from "@/lib/embeds";
import { SITE_URL } from "@/lib/seo";
import { OddsConverterCalculator } from "@/components/calculators/OddsConverterCalculator";
import { SingleBetCalculator } from "@/components/calculators/SingleBetCalculator";
import { ParlayCalculator } from "@/components/calculators/ParlayCalculator";
import { HedgeCalculator } from "@/components/calculators/HedgeCalculator";
import { EvCalculator } from "@/components/calculators/EvCalculator";
import { KellyCalculator } from "@/components/calculators/KellyCalculator";

export const dynamicParams = false;

export function generateStaticParams() {
  return EMBED_TOOLS.map((tool) => ({ tool: tool.slug }));
}

const COMPONENTS: Record<string, React.ComponentType> = {
  "odds-converter": OddsConverterCalculator,
  "betting-odds-calculator": SingleBetCalculator,
  "parlay-calculator": ParlayCalculator,
  "hedge-calculator": HedgeCalculator,
  "ev-calculator": EvCalculator,
  "kelly-calculator": KellyCalculator,
};

type Params = { tool: string };

/** Embedded copies are duplicates of the real page, so they stay out of search and point at the original. */
export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { tool } = await params;
  const entry = getEmbedTool(tool);
  if (!entry) return {};
  return {
    title: `${entry.title} (embed)`,
    robots: { index: false, follow: true },
    alternates: { canonical: `${SITE_URL}${entry.page}` },
  };
}

export default async function EmbedPage({ params }: { params: Promise<Params> }) {
  const { tool } = await params;
  const entry = getEmbedTool(tool);
  const Calculator = COMPONENTS[tool];
  if (!entry || !Calculator) notFound();
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-4 p-4">
      <Suspense fallback={<div className="h-72 animate-pulse rounded-xl bg-fill" />}>
        <Calculator />
      </Suspense>
      <p className="text-xs text-ink-dim">
        {entry.title} by{" "}
        <a href={`${SITE_URL}${entry.page}`} target="_blank" rel="noopener" className="underline underline-offset-2">
          LineMath
        </a>
        . For information only; verify payouts with your sportsbook. 21+.
      </p>
    </main>
  );
}
