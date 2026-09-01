"use client";

import { useMemo, useState } from "react";
import { Game, TeamSportId } from "@/lib/sports/types";
import { SPORT_LABELS, TEAM_SPORTS } from "@/lib/sports/provider";
import { useSportFilter } from "@/hooks/useSportFilter";
import { SportTabs } from "./SportTabs";
import { GameCard } from "./GameCard";

type Filter = "all" | TeamSportId;

const OPTIONS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  ...TEAM_SPORTS.map((sport) => ({ value: sport, label: SPORT_LABELS[sport] })),
];

export function MatchSearch({ games }: { games: Game[] }) {
  const [sport, setSport] = useSportFilter<Filter>(
    OPTIONS.map((o) => o.value),
    "all"
  );
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const bySport = sport === "all" ? games : games.filter((g) => g.sport === sport);
    const q = query.trim().toLowerCase();
    if (!q) return bySport;
    return bySport.filter(
      (g) => g.homeTeam.name.toLowerCase().includes(q) || g.awayTeam.name.toLowerCase().includes(q)
    );
  }, [games, sport, query]);

  return (
    <div className="flex flex-col gap-4">
      <SportTabs options={OPTIONS} value={sport} onChange={setSport} />
      <input
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search by team name…"
        className="rounded-lg border border-line bg-surface px-3 py-2 text-base text-ink outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
      />
      <div className="flex flex-col gap-3">
        {filtered.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
        {filtered.length === 0 && <p className="text-sm text-ink-dim">No matches found.</p>}
      </div>
    </div>
  );
}
