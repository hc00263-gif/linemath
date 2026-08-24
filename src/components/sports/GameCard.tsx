import Link from "next/link";
import { Game } from "@/lib/sports/types";
import { formatGameTime } from "@/lib/sports/format";

const STATUS_LABEL: Record<Game["status"], string> = {
  scheduled: "",
  live: "LIVE",
  final: "FINAL",
  postponed: "PPD",
};

export function GameCard({ game }: { game: Game }) {
  const hasScore = game.homeScore !== null && game.awayScore !== null;
  return (
    <Link
      href={`/matches/${game.sport}/${game.id}`}
      className="flex items-center justify-between gap-4 rounded-xl border border-black/10 p-4 transition-colors hover:border-black/30 dark:border-white/15 dark:hover:border-white/40"
    >
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium uppercase tracking-wide text-black/40 dark:text-white/40">
          {game.league}
        </span>
        <span className="font-medium">
          {game.awayTeam.name} @ {game.homeTeam.name}
        </span>
        <span className="text-sm text-black/60 dark:text-white/60">{formatGameTime(game.startTime)}</span>
      </div>
      <div className="flex flex-col items-end gap-1">
        {game.status === "live" && (
          <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-semibold text-red-600 dark:text-red-400">
            {STATUS_LABEL.live}
          </span>
        )}
        {game.status === "final" && (
          <span className="text-xs font-semibold text-black/40 dark:text-white/40">
            {STATUS_LABEL.final}
          </span>
        )}
        {hasScore && (
          <span className="tabular-nums text-sm font-semibold">
            {game.awayScore}-{game.homeScore}
          </span>
        )}
      </div>
    </Link>
  );
}
