import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { getSportsTool } from "@/lib/sportsTools";
import { HUB_LEAGUES } from "@/lib/hub/leagues";
import { getHubIndex, isHubConfigured } from "@/lib/hub/store";
import { formatEt } from "@/lib/hub/format";
import { Freshness, NoData, PriceDisclaimer } from "@/components/odds/Freshness";
import { OddsSubnav } from "@/components/odds/OddsSubnav";

export const revalidate = 300;

const meta = getSportsTool("best-odds")!;

export const metadata: Metadata = pageMetadata({ title: meta.title, description: meta.description, path: `/${meta.slug}` });

export default async function BestOddsPage() {
  const index = await getHubIndex();
  const available = index ? HUB_LEAGUES.filter((l) => index.leagues[l.slug]) : [];

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">Best Odds Today</h1>
        <p className="text-sm text-ink-dim">
          The best available price on every side of every game, with all books side by side. Switch between American, decimal and
          fractional odds, and between moneyline, spread and total.
        </p>
      </div>

      <OddsSubnav current="/best-odds" />

      {index ? <Freshness updated={index.updated} /> : null}

      {available.length === 0 ? (
        <NoData configured={isHubConfigured()} />
      ) : (
        <ul className="grid gap-3.5 sm:grid-cols-2">
          {available.map((l) => {
            const info = index!.leagues[l.slug];
            return (
              <li key={l.slug}>
                <Link
                  href={`/best-odds/${l.slug}`}
                  className="flex flex-col gap-1 rounded-xl border border-line bg-surface p-5 transition-all hover:-translate-y-0.5 hover:border-accent/50"
                >
                  <span className="text-base font-semibold tracking-tight">{l.label} odds</span>
                  <span className="text-[13px] text-ink-dim">
                    {info.games} {info.games === 1 ? "game" : "games"} · updated {formatEt(info.updated)}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      <div className="grid gap-3.5 sm:grid-cols-2">
        <Link href="/best-odds/arbs" className="rounded-xl border border-line bg-surface p-5 transition-all hover:border-accent/50">
          <h2 className="text-base font-semibold tracking-tight">Arbitrage finder</h2>
          <p className="mt-1 text-[13px] leading-relaxed text-ink-dim">
            Games where the best prices at different books add up to a guaranteed profit, as of the last update.
          </p>
        </Link>
        <Link href="/best-odds/outliers" className="rounded-xl border border-line bg-surface p-5 transition-all hover:border-accent/50">
          <h2 className="text-base font-semibold tracking-tight">Outlier lines</h2>
          <p className="mt-1 text-[13px] leading-relaxed text-ink-dim">
            Prices far better than the rest of the market, which are often stale lines or early moves.
          </p>
        </Link>
      </div>

      <section className="flex flex-col gap-3 text-[15px] leading-relaxed text-ink-dim">
        <h2 className="font-display text-xl font-bold tracking-tight text-ink uppercase">How to use this</h2>
        <p>
          Line shopping means taking the best price on the side you already like. Over a season, the difference between -110 and -105
          on the same bet adds up. Use the board to see which book is paying the most, then place the bet there.
        </p>
        <p>
          To judge whether a price is actually good, strip the sportsbook margin out with the{" "}
          <Link href="/no-vig-calculator" className="text-accent underline-offset-2 hover:underline">
            no-vig calculator
          </Link>{" "}
          and size it with the{" "}
          <Link href="/kelly-calculator" className="text-accent underline-offset-2 hover:underline">
            Kelly calculator
          </Link>
          .
        </p>
      </section>

      <PriceDisclaimer />
    </div>
  );
}
