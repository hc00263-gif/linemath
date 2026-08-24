import type { Metadata } from "next";
import { Suspense } from "react";
import { getSportsProvider, TEAM_SPORTS } from "@/lib/sports";
import { getUpcomingTennisMajors } from "@/lib/sports/tennisMajors";
import { CalendarView } from "@/components/sports/CalendarView";
import { DemoDataBanner } from "@/components/sports/DemoDataBanner";
import { getSportsTool } from "@/lib/sportsTools";

export const revalidate = 3600;

const meta = getSportsTool("calendar")!;

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: `/${meta.slug}` },
};

export default async function CalendarPage() {
  const provider = getSportsProvider();
  const gamesBySport = await Promise.all(TEAM_SPORTS.map((sport) => provider.getUpcomingGames(sport)));
  const games = gamesBySport.flat();
  const tennisMajors = getUpcomingTennisMajors();

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-8">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{meta.title}</h1>
      <DemoDataBanner />
      <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-black/[.03] dark:bg-white/[.04]" />}>
        <CalendarView games={games} tennisMajors={tennisMajors} />
      </Suspense>
    </div>
  );
}
