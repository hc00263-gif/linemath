import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { getHubLeague, bookLabel } from "@/lib/hub/leagues";
import { getAllHubBoards, isHubConfigured, isStale } from "@/lib/hub/store";
import { findOutliers } from "@/lib/hub/analysis";
import { formatEt, formatLine, formatPrice } from "@/lib/hub/format";
import { Freshness, NoData, PriceDisclaimer } from "@/components/odds/Freshness";
import { OddsSubnav } from "@/components/odds/OddsSubnav";

export const revalidate = 300;

export const metadata: Metadata = pageMetadata({
  title: "Outlier Odds — Prices Far Above the Market",
  description:
    "Sportsbook prices that sit well above what the rest of the market is offering on the same bet, often stale lines or early moves.",
  path: "/best-odds/outliers",
});

const MARKET_LABEL: Record<string, string> = { h2h: "Moneyline", spreads: "Spread", totals: "Total" };

export default async function OutliersPage() {
  const boards = (await getAllHubBoards()).filter((b) => !isStale(b.updated));
  const outliers = boards.flatMap((b) => findOutliers(b.games).map((o) => ({ ...o, league: b.league })));
  outliers.sort((x, y) => y.edgePercent - x.edgePercent);
  const updated = boards.map((b) => b.updated).sort().at(-1);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">Outlier Lines</h1>
        <p className="text-sm text-ink-dim">
          Prices at least 6% better than the median of the other books on the same bet. Where Pinnacle, a sharp book, also prices the
          market, the card shows the gap to its no-vig line, and prices that beat it are listed first. A big gap can mean a soft book, an
          early move, or a stale price that is about to be corrected.
        </p>
      </div>

      <OddsSubnav current="/best-odds/outliers" />
      {updated ? <Freshness updated={updated} /> : null}

      {outliers.length === 0 ? (
        boards.length === 0 ? (
          <NoData configured={isHubConfigured()} />
        ) : (
          <p className="rounded-xl border border-line bg-surface p-4 text-sm text-ink-dim">
            No outliers in the latest prices. The books are in close agreement right now.
          </p>
        )
      ) : (
        <ul className="flex flex-col gap-3.5">
          {outliers.slice(0, 40).map((o) => (
            <li key={`${o.league}-${o.gameId}-${o.market}-${o.selection}-${o.point}`} className="rounded-xl border border-line bg-surface p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h2 className="text-base font-semibold tracking-tight">
                  {o.away} <span className="font-normal text-ink-dim">at</span> {o.home}
                </h2>
                <span className="font-mono text-sm font-semibold text-positive">+{o.edgePercent.toFixed(1)}% vs market</span>
              </div>
              <p className="mt-0.5 font-mono text-xs text-ink-dim">
                {getHubLeague(o.league)?.label ?? o.league.toUpperCase()} · {MARKET_LABEL[o.market] ?? o.market} · {formatEt(o.start)}
              </p>
              <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                <span className="font-medium">
                  {o.selection} {o.market === "h2h" ? "" : formatLine(o.point, o.market === "spreads")}
                </span>
                <span className="flex items-center gap-2.5">
                  <span className="text-xs text-ink-dim">{bookLabel(o.best.book)}</span>
                  <span className="min-w-16 rounded-md bg-fill px-2 py-1 text-center font-mono font-semibold text-accent">
                    {formatPrice(o.best.decimal, "american")}
                  </span>
                </span>
              </div>
              <p className="mt-1.5 text-xs text-ink-dim">
                Market median {formatPrice(o.marketMedian, "american")} across {o.bookCount} books.
                {o.fairDecimal != null && o.evPercent != null ? (
                  <>
                    {" "}
                    Pinnacle&apos;s no-vig price is {formatPrice(o.fairDecimal, "american")}, so this price is{" "}
                    <span className={o.evPercent > 0 ? "font-semibold text-positive" : "font-semibold"}>
                      {o.evPercent >= 0 ? "+" : ""}
                      {o.evPercent.toFixed(1)}%
                    </span>{" "}
                    against the sharp line.
                  </>
                ) : null}
              </p>
            </li>
          ))}
        </ul>
      )}

      <section className="flex flex-col gap-2 text-sm leading-relaxed text-ink-dim">
        <h2 className="font-display text-xl font-bold tracking-tight text-ink uppercase">Is an outlier a good bet?</h2>
        <p>
          Not automatically. A price that disagrees with the market can be a mistake in the bettor&apos;s favor, or the market may know
          something the outlier book has not caught up to yet. Check it against a fair price with the{" "}
          <Link href="/no-vig-calculator" className="text-accent underline-offset-2 hover:underline">
            no-vig calculator
          </Link>
          .
        </p>
      </section>

      <PriceDisclaimer />
    </div>
  );
}
