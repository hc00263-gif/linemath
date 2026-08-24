import type { Metadata } from "next";
import Link from "next/link";
import { CALCULATORS } from "@/lib/calculators";
import { SPORTS_TOOLS } from "@/lib/sportsTools";

export const metadata: Metadata = {
  title: "Free Sports Betting Calculators — American Odds Native",
  description:
    "Fast, free, no-signup betting calculators for US bettors. Odds converter, parlay, hedge, and bonus bet — all client-side, no ads, no clutter.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-10 px-4 py-12">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Free sports betting calculators, built for speed
        </h1>
        <p className="max-w-xl text-black/70 dark:text-white/70">
          No signup walls, no ad clutter, no slow media-site bloat. American odds native, with
          sharp-bettor tools alongside the calculators every bettor needs.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {CALCULATORS.map((calc) => (
          <Link
            key={calc.slug}
            href={`/${calc.slug}`}
            className="flex flex-col gap-1.5 rounded-xl border border-black/10 p-5 transition-colors hover:border-black/30 dark:border-white/15 dark:hover:border-white/40"
          >
            <span className="text-lg font-semibold">{calc.shortTitle}</span>
            <span className="text-sm text-black/60 dark:text-white/60">{calc.description}</span>
          </Link>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold tracking-tight">Sports data</h2>
        <p className="max-w-xl text-sm text-black/60 dark:text-white/60">
          Schedules, matches, and player lookup across NBA, NFL, NHL, MLB, and the four tennis
          majors — to go with your betting math.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {SPORTS_TOOLS.map((tool) => (
            <Link
              key={tool.slug}
              href={`/${tool.slug}`}
              className="flex flex-col gap-1.5 rounded-xl border border-black/10 p-5 transition-colors hover:border-black/30 dark:border-white/15 dark:hover:border-white/40"
            >
              <span className="text-lg font-semibold">{tool.shortTitle}</span>
              <span className="text-sm text-black/60 dark:text-white/60">{tool.description}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
