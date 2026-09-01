import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getSportsProvider, usingMockGames } from "@/lib/sports";
import { TeamSportId } from "@/lib/sports/types";
import { SPORT_LABELS, TEAM_SPORTS } from "@/lib/sports/provider";
import { formatGameTime } from "@/lib/sports/format";
import { DemoDataBanner } from "@/components/sports/DemoDataBanner";

export const revalidate = 3600;

type Params = { sport: string; id: string };

function isTeamSport(value: string): value is TeamSportId {
  return (TEAM_SPORTS as string[]).includes(value);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { sport, id } = await params;
  if (!isTeamSport(sport)) return {};
  const game = await getSportsProvider().getGame(sport, id);
  if (!game) return {};
  return {
    title: `${game.awayTeam.name} @ ${game.homeTeam.name} — ${SPORT_LABELS[sport]}`,
    description: `${game.awayTeam.name} at ${game.homeTeam.name}, ${formatGameTime(game.startTime)}.`,
  };
}

export default async function MatchDetailPage({ params }: { params: Promise<Params> }) {
  const { sport, id } = await params;
  if (!isTeamSport(sport)) notFound();
  const game = await getSportsProvider().getGame(sport, id);
  if (!game) notFound();

  const hasScore = game.homeScore !== null && game.awayScore !== null;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-8">
      <DemoDataBanner show={usingMockGames()} />
      <div className="flex flex-col gap-2">
        <span className="font-mono text-xs font-medium uppercase tracking-wide text-ink-dim">
          {game.league}
        </span>
        <h1 className="font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">
          {game.awayTeam.name} @ {game.homeTeam.name}
        </h1>
        <p className="text-ink-dim">{formatGameTime(game.startTime)}</p>
      </div>

      {hasScore && (
        <div className="rounded-xl border border-line bg-surface p-5">
          <div className="flex items-center justify-between text-lg font-semibold tabular-nums">
            <span>{game.awayTeam.name}</span>
            <span>{game.awayScore}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-lg font-semibold tabular-nums">
            <span>{game.homeTeam.name}</span>
            <span>{game.homeScore}</span>
          </div>
        </div>
      )}

      <Link
        href="/betting-odds-calculator"
        className="self-start rounded-lg border border-line px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-accent/50"
      >
        Calculate odds for this game →
      </Link>
    </div>
  );
}
