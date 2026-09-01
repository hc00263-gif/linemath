import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { CALCULATORS } from "@/lib/calculators";
import { SPORTS_TOOLS } from "@/lib/sportsTools";
import { OddsConverterCalculator } from "@/components/calculators/OddsConverterCalculator";

export const metadata: Metadata = {
  title: "Free Sports Betting Calculators — American Odds Native",
  description:
    "Fast, free, no-signup betting calculators for US bettors. Odds converter, parlay, hedge, and bonus bet — all client-side, no ads, no clutter.",
  alternates: { canonical: "/" },
};

/** A verified, real readout shown on each tool's card — not marketing copy, actual output. */
const READOUTS: Record<string, { input: string; output: string; tone?: "positive" }> = {
  "odds-converter": { input: "−200", output: "1.50 dec" },
  "betting-odds-calculator": { input: "$100 @ −110", output: "+$90.91", tone: "positive" },
  "parlay-calculator": { input: "3× −110", output: "+596", tone: "positive" },
  "hedge-calculator": { input: "+300 vs −150", output: "$60 locked", tone: "positive" },
  "bonus-bet-calculator": { input: "$100 free bet", output: "62.5% cash", tone: "positive" },
  "fantasy-points-calculator": { input: "8 rec, 120 yd, 1 TD", output: "26.0 pts", tone: "positive" },
  "draft-pick-calculator": { input: "Slot 4, 3RR", output: "4, 5, 9, 16" },
  calendar: { input: "NBA · NFL · NHL · MLB", output: "+ 4 majors" },
  matches: { input: "Search by team", output: "live lookup" },
  players: { input: "NFL · Mahomes", output: "QB, KC" },
};

export default function Home() {
  const allTools = [...CALCULATORS, ...SPORTS_TOOLS];

  return (
    <>
      <section className="border-b border-line">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-12 px-4 py-16 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <div className="mb-5 flex items-center gap-2.5 font-mono text-xs tracking-wide text-accent uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_0_3px_var(--accent-soft)]" />
              Free &middot; No Signup &middot; American Odds Native
            </div>
            <h1 className="text-balance font-display text-6xl leading-[0.94] font-extrabold tracking-tight uppercase sm:text-7xl">
              The Math
              <br />
              <span className="text-ink-dim">On Every Line.</span>
            </h1>
            <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-ink-dim">
              Instant, exact betting calculators — odds conversion, parlays, hedges, bonus bets,
              and fantasy scoring. No ad clutter, no slow media-site bloat, no rounding you can&apos;t
              verify.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="#tools"
                className="rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-accent-ink transition-[filter] hover:brightness-110"
              >
                Open the calculators →
              </Link>
              <Link
                href="/odds-converter"
                className="rounded-lg border border-line px-5 py-3 text-sm font-semibold text-ink transition-colors hover:bg-fill"
              >
                Try the odds converter
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-surface shadow-[0_1px_2px_rgba(0,0,0,.04),0_12px_32px_rgba(0,0,0,.06)]">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <span className="text-sm font-medium text-ink-dim">Odds Converter</span>
              <span className="flex items-center gap-1.5 rounded-full bg-positive-soft px-2.5 py-1 font-mono text-[10.5px] tracking-wide text-positive">
                <span className="h-1.5 w-1.5 rounded-full bg-positive" />
                LIVE
              </span>
            </div>
            <div className="p-5">
              <Suspense fallback={<div className="h-[196px] animate-pulse rounded-xl bg-fill" />}>
                <OddsConverterCalculator />
              </Suspense>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 px-4 py-8 sm:grid-cols-4">
          <div>
            <div className="font-mono text-2xl font-semibold tabular-nums text-accent">$695.79</div>
            <div className="mt-1 text-xs text-ink-dim">3-leg −110 parlay payout on a $100 stake</div>
          </div>
          <div>
            <div className="font-mono text-2xl font-semibold tabular-nums text-accent">$60.00</div>
            <div className="mt-1 text-xs text-ink-dim">Guaranteed profit hedging +300 against −150</div>
          </div>
          <div>
            <div className="font-mono text-2xl font-semibold tabular-nums text-accent">62.5%</div>
            <div className="mt-1 text-xs text-ink-dim">Real cash from a $100 bonus bet at +200</div>
          </div>
          <div>
            <div className="font-mono text-2xl font-semibold tabular-nums text-accent">119</div>
            <div className="mt-1 text-xs text-ink-dim">Automated tests behind every calculator</div>
          </div>
        </div>
      </section>

      <section id="tools" className="mx-auto max-w-5xl px-4 py-16">
        <div className="mb-8 max-w-[60ch]">
          <div className="mb-2.5 font-mono text-xs tracking-wide text-ink-dim uppercase">The Toolkit</div>
          <h2 className="font-display text-4xl leading-none font-bold tracking-tight uppercase">
            Ten tools. One page each.
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-dim">
            Every tool is its own fast page — enter numbers, see the answer instantly. No forms to
            submit, no accounts to lose your place.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {allTools.map((tool) => {
            const readout = READOUTS[tool.slug];
            return (
              <Link
                key={tool.slug}
                href={`/${tool.slug}`}
                className="group flex flex-col gap-3.5 rounded-xl border border-line bg-surface p-5 transition-all hover:-translate-y-0.5 hover:border-accent/50"
              >
                <div>
                  <h3 className="text-base font-semibold tracking-tight">{tool.shortTitle}</h3>
                  <p className="mt-1 text-[13px] leading-relaxed text-ink-dim">{tool.description}</p>
                </div>
                {readout && (
                  <div className="flex items-center justify-between rounded-lg border border-line bg-ground px-3 py-2 font-mono text-[12.5px]">
                    <span className="text-ink-dim">{readout.input}</span>
                    <span className={`font-semibold ${readout.tone === "positive" ? "text-positive" : "text-ink"}`}>
                      {readout.output}
                    </span>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
