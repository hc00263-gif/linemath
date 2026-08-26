import type { Metadata } from "next";
import { Suspense } from "react";
import { getSportsProvider, TEAM_SPORTS, usingMockGames } from "@/lib/sports";
import { MatchSearch } from "@/components/sports/MatchSearch";
import { DemoDataBanner } from "@/components/sports/DemoDataBanner";
import { getSportsTool } from "@/lib/sportsTools";

export const revalidate = 3600;

const meta = getSportsTool("matches")!;

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: `/${meta.slug}` },
};

export default async function MatchesPage() {
  const provider = getSportsProvider();
  const gamesBySport = await Promise.all(
    TEAM_SPORTS.map((sport) => provider.getUpcomingGames(sport, 30))
  );
  const games = gamesBySport.flat();

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-8">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{meta.title}</h1>
      <DemoDataBanner show={usingMockGames()} />
      <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-black/[.03] dark:bg-white/[.04]" />}>
        <MatchSearch games={games} />
      </Suspense>
    </div>
  );
}
