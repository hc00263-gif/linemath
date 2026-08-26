"use client";

import { useEffect, useState, useTransition } from "react";
import { Player, TeamSportId } from "@/lib/sports/types";
import { SPORT_LABELS, TEAM_SPORTS } from "@/lib/sports/provider";
import { usingMockPlayers } from "@/lib/sports";
import { searchPlayersAction } from "@/lib/sports/actions";
import { useSportFilter } from "@/hooks/useSportFilter";
import { SportTabs } from "./SportTabs";
import { PlayerCard } from "./PlayerCard";
import { DemoDataBanner } from "./DemoDataBanner";

type Filter = "all" | TeamSportId;

const OPTIONS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  ...TEAM_SPORTS.map((sport) => ({ value: sport, label: SPORT_LABELS[sport] })),
];

const MIN_QUERY_LENGTH = 3;
const DEBOUNCE_MS = 500;

export function PlayerSearch() {
  const [sport, setSport] = useSportFilter<Filter>(
    OPTIONS.map((o) => o.value),
    "all"
  );
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Player[]>([]);
  const [isPending, startTransition] = useTransition();

  const queryTooShort = query.trim().length < MIN_QUERY_LENGTH;

  useEffect(() => {
    if (queryTooShort) return;
    const handle = setTimeout(() => {
      const sportsToQuery = sport === "all" ? TEAM_SPORTS : [sport];
      startTransition(async () => {
        const lists = await Promise.all(sportsToQuery.map((s) => searchPlayersAction(s, query)));
        setResults(lists.flat());
      });
    }, DEBOUNCE_MS);
    return () => clearTimeout(handle);
  }, [sport, query, queryTooShort]);

  const visibleResults = queryTooShort ? [] : results;

  const showDemoBanner =
    sport === "all" ? TEAM_SPORTS.some(usingMockPlayers) : usingMockPlayers(sport);

  return (
    <div className="flex flex-col gap-4">
      <SportTabs options={OPTIONS} value={sport} onChange={setSport} />
      <DemoDataBanner
        show={showDemoBanner}
        note={
          sport === "all"
            ? "NHL and MLB player search is still demo data — NFL and NBA are live."
            : undefined
        }
      />
      <input
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search players by name… (3+ letters)"
        className="rounded-lg border border-black/15 bg-transparent px-3 py-2 text-base outline-none transition-colors focus:border-black/40 focus:ring-2 focus:ring-black/10 dark:border-white/20 dark:focus:border-white/50 dark:focus:ring-white/10"
      />
      <div className="flex flex-col gap-3">
        {isPending && <p className="text-sm text-black/50 dark:text-white/50">Searching…</p>}
        {!isPending && queryTooShort && (
          <p className="text-sm text-black/50 dark:text-white/50">Type at least 3 letters to search.</p>
        )}
        {!isPending && !queryTooShort && visibleResults.length === 0 && (
          <p className="text-sm text-black/50 dark:text-white/50">No players found.</p>
        )}
        {visibleResults.map((player) => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </div>
    </div>
  );
}
