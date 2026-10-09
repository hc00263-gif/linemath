import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { NEGATIVE_ODDS, POSITIVE_ODDS, oddsLabel, oddsToSlug } from "@/lib/oddsPages";
import { formatImplied } from "@/lib/odds/format";
import { oddsFromAmerican } from "@/lib/odds/convert";
import { InfoPage } from "@/components/layout/InfoPage";
import { H2 } from "@/components/layout/Prose";

export const metadata: Metadata = pageMetadata({
  title: "Betting Odds Explained: What Every Price Means",
  description: "Look up what any American odds mean — payout on every stake, decimal and fractional odds, and the win rate each price needs to break even.",
  path: "/odds",
});

function PriceGrid({ prices }: { prices: number[] }) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
      {prices.map((odds) => (
        <Link key={odds} href={`/odds/${oddsToSlug(odds)}`} className="rounded-lg border border-line bg-surface px-3 py-2 transition-colors hover:border-accent/50">
          <div className="font-mono text-base font-semibold text-ink">{oddsLabel(odds)}</div>
          <div className="font-mono text-xs text-ink-dim">{formatImplied(oddsFromAmerican(odds).implied)}</div>
        </Link>
      ))}
    </div>
  );
}

export default function OddsIndexPage() {
  return (
    <InfoPage title="Betting Odds Explained" intro="Pick a price to see exactly what it pays, what it converts to, and the win rate it needs to break even.">
      <H2>Favorites (negative odds)</H2>
      <PriceGrid prices={NEGATIVE_ODDS.slice().reverse()} />
      <H2>Underdogs and even money (positive odds)</H2>
      <PriceGrid prices={POSITIVE_ODDS} />
      <p className="text-sm">
        Don&apos;t see your price? Use the <Link className="underline" href="/odds-converter">odds converter</Link> for any odds, or read how to <Link className="underline" href="/guides/how-to-read-american-odds">read American odds</Link>.
      </p>
    </InfoPage>
  );
}
