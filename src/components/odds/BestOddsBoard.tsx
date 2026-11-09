"use client";

import { useState } from "react";
import type { OddsFormat } from "@/lib/odds/convert";
import { OddsFormatToggle } from "@/components/ui/OddsFormatToggle";
import { bookLabel } from "@/lib/hub/leagues";
import { formatEt, formatLine, formatPrice } from "@/lib/hub/format";
import type { HubBoard, HubSide, MarketKey } from "@/lib/hub/types";

const MARKETS: { key: MarketKey; label: string }[] = [
  { key: "h2h", label: "Moneyline" },
  { key: "spreads", label: "Spread" },
  { key: "totals", label: "Total" },
];

function sideLabel(side: HubSide, market: MarketKey): string {
  if (market === "h2h") return side.selection;
  if (market === "spreads") return `${side.selection} ${formatLine(side.point, true)}`;
  return `${side.selection} ${formatLine(side.point, false)}`;
}

function orderSides(sides: HubSide[], market: MarketKey): HubSide[] {
  return [...sides].sort((a, b) => {
    if (market === "totals") {
      return (a.point ?? 0) - (b.point ?? 0) || (a.selection === "Over" ? -1 : 1);
    }
    return a.selection.localeCompare(b.selection) || (a.point ?? 0) - (b.point ?? 0);
  });
}

export function BestOddsBoard({ board }: { board: HubBoard }) {
  const [format, setFormat] = useState<OddsFormat>("american");
  const [market, setMarket] = useState<MarketKey>("h2h");

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="tablist" aria-label="Market" className="inline-flex rounded-lg border border-line bg-fill p-1">
          {MARKETS.map((m) => (
            <button
              key={m.key}
              type="button"
              role="tab"
              aria-selected={market === m.key}
              onClick={() => setMarket(m.key)}
              className={`min-h-9 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                market === m.key ? "bg-surface-raised text-ink shadow-sm" : "text-ink-dim hover:text-ink"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
        <OddsFormatToggle value={format} onChange={setFormat} />
      </div>

      <ul className="flex flex-col gap-3.5">
        {board.games.map((game) => {
          const sides = orderSides(game.markets[market] ?? [], market);
          const hold = game.vig[market];
          return (
            <li key={game.id} className="rounded-xl border border-line bg-surface p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="text-base font-semibold tracking-tight">
                  {game.away} <span className="font-normal text-ink-dim">at</span> {game.home}
                </h3>
                <span className="font-mono text-xs text-ink-dim">{formatEt(game.start)}</span>
              </div>

              {sides.length === 0 ? (
                <p className="mt-3 text-sm text-ink-dim">No lines posted for this market yet.</p>
              ) : (
                <ul className="mt-3 divide-y divide-line">
                  {sides.map((side) => {
                    const books = Object.entries(side.books).sort((a, b) => b[1] - a[1]);
                    return (
                      <li key={`${side.selection}-${side.point}`} className="py-2.5">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-sm font-medium">{sideLabel(side, market)}</span>
                          <span className="flex items-center gap-2.5 text-right">
                            <span className="text-xs text-ink-dim">{bookLabel(side.best.book)}</span>
                            <span className="min-w-16 rounded-md bg-fill px-2 py-1 text-center font-mono text-sm font-semibold text-accent">
                              {formatPrice(side.best.decimal, format)}
                            </span>
                          </span>
                        </div>
                        {books.length > 1 && (
                          <details className="mt-1.5 text-xs text-ink-dim">
                            <summary className="cursor-pointer select-none py-1 hover:text-ink">Compare {books.length} books</summary>
                            <ul className="mt-1 grid grid-cols-2 gap-x-4 gap-y-1 sm:grid-cols-3">
                              {books.map(([book, price]) => (
                                <li key={book} className="flex justify-between gap-2 font-mono">
                                  <span className="font-sans">{bookLabel(book)}</span>
                                  <span className={book === side.best.book ? "font-semibold text-accent" : undefined}>
                                    {formatPrice(price, format)}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </details>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
              {hold != null && (
                <p className="mt-2 font-mono text-xs text-ink-dim">
                  Best-price hold {(hold * 100).toFixed(1)}%{hold < 0 ? " (arbitrage)" : ""}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
