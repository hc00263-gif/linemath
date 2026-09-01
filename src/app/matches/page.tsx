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
      <h1 className="font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">{meta.title}</h1>
      <DemoDataBanner show={usingMockGames()} />
      <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-fill" />}>
        <MatchSearch games={games} />
      </Suspense>
    </div>
  );
}
