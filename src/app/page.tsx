import type { Metadata } from "next";
import Link from "next/link";
import { CALCULATORS } from "@/lib/calculators";

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
    </div>
  );
}
