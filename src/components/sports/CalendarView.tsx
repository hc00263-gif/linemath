"use client";

import { useMemo } from "react";
import { Game, TennisMajor } from "@/lib/sports/types";
import { useSportFilter } from "@/hooks/useSportFilter";
import { SportTabs } from "./SportTabs";
import { GameCard } from "./GameCard";
import { TournamentCard } from "./TournamentCard";

type CalendarSport = "all" | "nba" | "nfl" | "nhl" | "mlb" | "tennis";

const OPTIONS: { value: CalendarSport; label: string }[] = [
  { value: "all", label: "All" },
  { value: "nba", label: "NBA" },
  { value: "nfl", label: "NFL" },
  { value: "nhl", label: "NHL" },
  { value: "mlb", label: "MLB" },
  { value: "tennis", label: "Tennis" },
];

export function CalendarView({ games, tennisMajors }: { games: Game[]; tennisMajors: TennisMajor[] }) {
  const [sport, setSport] = useSportFilter<CalendarSport>(
    OPTIONS.map((o) => o.value),
    "all"
  );

  const sortedGames = useMemo(
    () => [...games].sort((a, b) => a.startTime.localeCompare(b.startTime)),
    [games]
  );

  const showTennis = sport === "all" || sport === "tennis";
  const filteredGames =
    sport === "tennis" ? [] : sport === "all" ? sortedGames : sortedGames.filter((g) => g.sport === sport);

  const isEmpty = filteredGames.length === 0 && (!showTennis || tennisMajors.length === 0);

  return (
    <div className="flex flex-col gap-4">
      <SportTabs options={OPTIONS} value={sport} onChange={setSport} />
      <div className="flex flex-col gap-3">
        {showTennis && tennisMajors.map((major) => <TournamentCard key={major.id} major={major} />)}
        {filteredGames.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
        {isEmpty && <p className="text-sm text-ink-dim">No upcoming events found.</p>}
      </div>
    </div>
  );
}
