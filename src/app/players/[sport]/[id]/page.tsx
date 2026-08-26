import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSportsProvider, usingMockPlayers } from "@/lib/sports";
import { TeamSportId } from "@/lib/sports/types";
import { SPORT_LABELS, TEAM_SPORTS } from "@/lib/sports/provider";
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
  const player = await getSportsProvider().getPlayer(sport, id);
  if (!player) return {};
  return {
    title: `${player.name} — ${SPORT_LABELS[sport]} Player Profile`,
    description: `${player.name}${player.team ? `, ${player.team.name}` : ""}${
      player.position ? ` (${player.position})` : ""
    }.`,
  };
}

export default async function PlayerDetailPage({ params }: { params: Promise<Params> }) {
  const { sport, id } = await params;
  if (!isTeamSport(sport)) notFound();
  const player = await getSportsProvider().getPlayer(sport, id);
  if (!player) notFound();

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-8">
      <DemoDataBanner show={usingMockPlayers(sport)} />
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-black/40 dark:text-white/40">
          {SPORT_LABELS[sport]}
          {player.position ? ` · ${player.position}` : ""}
        </span>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{player.name}</h1>
        {player.team && <p className="text-black/60 dark:text-white/60">{player.team.name}</p>}
      </div>

      {player.stats && player.stats.length > 0 && (
        <div className="rounded-xl border border-black/10 p-5 dark:border-white/15">
          <dl className="flex flex-col gap-2">
            {player.stats.map((stat) => (
              <div key={stat.label} className="flex items-baseline justify-between gap-4">
                <dt className="text-sm text-black/60 dark:text-white/60">{stat.label}</dt>
                <dd className="tabular-nums text-sm font-semibold">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  );
}
