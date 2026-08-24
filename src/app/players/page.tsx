import type { Metadata } from "next";
import { Suspense } from "react";
import { getSportsProvider, TEAM_SPORTS } from "@/lib/sports";
import { PlayerSearch } from "@/components/sports/PlayerSearch";
import { DemoDataBanner } from "@/components/sports/DemoDataBanner";
import { getSportsTool } from "@/lib/sportsTools";

export const revalidate = 3600;

const meta = getSportsTool("players")!;

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: `/${meta.slug}` },
};

export default async function PlayersPage() {
  const provider = getSportsProvider();
  const playersBySport = await Promise.all(
    TEAM_SPORTS.map((sport) => provider.searchPlayers(sport, ""))
  );
  const players = playersBySport.flat();

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-8">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{meta.title}</h1>
      <DemoDataBanner />
      <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-black/[.03] dark:bg-white/[.04]" />}>
        <PlayerSearch players={players} />
      </Suspense>
    </div>
  );
}
