"use client";

import Link from "next/link";
import { useState } from "react";
import type { OddsFormat } from "@/lib/odds/convert";
import { OddsFormatToggle } from "@/components/ui/OddsFormatToggle";
import { bookLabel } from "@/lib/hub/leagues";
import { formatEt, formatPrice } from "@/lib/hub/format";
import type { TodayLeague } from "@/lib/hub/today";

export function TodayGames({ leagues, updatedLabel }: { leagues: TodayLeague[]; updatedLabel: string }) {
  const [active, setActive] = useState(leagues[0]?.slug ?? "");
  const [format, setFormat] = useState<OddsFormat>("american");
  const league = leagues.find((l) => l.slug === active) ?? leagues[0];
  if (!league) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="tablist" aria-label="League" className="flex flex-wrap gap-1.5">
          {leagues.map((l) => (
            <button
              key={l.slug}
              type="button"
              role="tab"
              aria-selected={league.slug === l.slug}
              onClick={() => setActive(l.slug)}
              className={`min-h-9 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                league.slug === l.slug ? "border-accent/60 bg-fill text-ink" : "border-line text-ink-dim hover:text-ink"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
        <OddsFormatToggle value={format} onChange={setFormat} />
      </div>

      <p className="font-mono text-xs text-ink-dim">
        {league.isToday ? "Today's games" : `No more games today. Next up: ${league.dayLabel}`} &middot; best price at any book &middot; {updatedLabel}
      </p>

      <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {league.games.map((g) => (
          <li key={g.id} className="rounded-xl border border-line bg-surface p-4">
            <div className="mb-2.5 flex items-baseline justify-between gap-3">
              <h3 className="text-sm font-semibold tracking-tight">
                {g.away} <span className="font-normal text-ink-dim">at</span> {g.home}
              </h3>
              <span className="shrink-0 font-mono text-xs text-ink-dim">{formatEt(g.start)}</span>
            </div>
            <ul className="divide-y divide-line">
              {g.sides.map((s) => (
                <li key={s.label} className="flex items-center justify-between gap-3 py-1.5 text-sm">
                  <span className="truncate">{s.label}</span>
                  <span className="flex shrink-0 items-center gap-2">
                    <span className="text-xs text-ink-dim">{bookLabel(s.book)}</span>
                    <span className="min-w-16 rounded-md bg-fill px-2 py-1 text-center font-mono text-sm font-semibold text-accent">
                      {formatPrice(s.decimal, format)}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <Link href={`/best-odds/${league.slug}`} className="font-medium text-accent underline-offset-2 hover:underline">
          {league.more > 0 ? `See all ${league.games.length + league.more} ${league.label} games, spreads and totals →` : `${league.label} spreads, totals and every book →`}
        </Link>
        <Link href="/best-odds/arbs" className="text-ink-dim underline-offset-2 hover:text-ink hover:underline">
          Arbs &amp; outliers
        </Link>
      </div>
    </div>
  );
}
