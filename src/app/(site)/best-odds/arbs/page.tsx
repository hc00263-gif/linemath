import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { getHubLeague, bookLabel } from "@/lib/hub/leagues";
import { getAllHubBoards, isHubConfigured, isStale } from "@/lib/hub/store";
import { findArbs } from "@/lib/hub/analysis";
import { formatEt, formatLine, formatPrice } from "@/lib/hub/format";
import { Freshness, NoData, PriceDisclaimer } from "@/components/odds/Freshness";
import { OddsSubnav } from "@/components/odds/OddsSubnav";

export const revalidate = 300;

export const metadata: Metadata = pageMetadata({
  title: "Sports Betting Arbitrage Finder — Arbs Across Sportsbooks",
  description:
    "Games where the best prices at different sportsbooks add up to a guaranteed profit, as of the last odds update, with the stake split worked out.",
  path: "/best-odds/arbs",
});

const MARKET_LABEL: Record<string, string> = { h2h: "Moneyline", spreads: "Spread", totals: "Total" };

export default async function ArbsPage() {
  const boards = (await getAllHubBoards()).filter((b) => !isStale(b.updated));
  const arbs = boards.flatMap((b) => findArbs(b.games).map((a) => ({ ...a, league: b.league })));
  arbs.sort((x, y) => y.profitPercent - x.profitPercent);
  const updated = boards.map((b) => b.updated).sort().at(-1);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">Arbitrage Finder</h1>
        <p className="text-sm text-ink-dim">
          An arbitrage is a set of bets at different books whose combined payout beats the total stake whichever side wins. These are
          arbs found at the last update, not live alerts.
        </p>
      </div>

      <OddsSubnav current="/best-odds/arbs" />
      {updated ? <Freshness updated={updated} /> : null}

      {arbs.length === 0 ? (
        boards.length === 0 ? (
          <NoData configured={isHubConfigured()} />
        ) : (
          <p className="rounded-xl border border-line bg-surface p-4 text-sm text-ink-dim">
            No arbitrage in the latest prices. That is normal: books price against each other closely, and real arbs usually close within
            minutes.
          </p>
        )
      ) : (
        <ul className="flex flex-col gap-3.5">
          {arbs.map((a) => (
            <li key={`${a.league}-${a.gameId}-${a.market}-${a.legs.map((l) => l.point).join("/")}`} className="rounded-xl border border-line bg-surface p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h2 className="text-base font-semibold tracking-tight">
                  {a.away} <span className="font-normal text-ink-dim">at</span> {a.home}
                </h2>
                <span className="font-mono text-sm font-semibold text-positive">+{a.profitPercent.toFixed(2)}%</span>
              </div>
              <p className="mt-0.5 font-mono text-xs text-ink-dim">
                {getHubLeague(a.league)?.label ?? a.league.toUpperCase()} · {MARKET_LABEL[a.market] ?? a.market} · {formatEt(a.start)}
              </p>
              <ul className="mt-3 divide-y divide-line">
                {a.legs.map((l) => (
                  <li key={`${l.selection}-${l.point}`} className="flex items-center justify-between gap-3 py-2 text-sm">
                    <span className="font-medium">
                      {l.selection} {a.market === "h2h" ? "" : formatLine(l.point, a.market === "spreads")}
                    </span>
                    <span className="flex items-center gap-2.5">
                      <span className="text-xs text-ink-dim">{bookLabel(l.book)}</span>
                      <span className="min-w-16 rounded-md bg-fill px-2 py-1 text-center font-mono font-semibold text-accent">
                        {formatPrice(l.decimal, "american")}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-xs text-ink-dim">
                Work out exact stakes with the{" "}
                <Link href="/arbitrage-calculator" className="text-accent underline-offset-2 hover:underline">
                  arbitrage calculator
                </Link>
                .
              </p>
            </li>
          ))}
        </ul>
      )}

      <section className="flex flex-col gap-2 text-sm leading-relaxed text-ink-dim">
        <h2 className="font-display text-xl font-bold tracking-tight text-ink uppercase">Read this before acting</h2>
        <p>
          Prices on this page are a few hours old at best. By the time you open a sportsbook, the line has usually moved. Books can also
          void bets placed on obvious errors, limit or close accounts that arb regularly, and settle spreads and totals under their own
          rules. Most listed arbs are small and disappear quickly.
        </p>
      </section>

      <PriceDisclaimer />
    </div>
  );
}
