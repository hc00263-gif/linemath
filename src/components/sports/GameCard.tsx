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
      className="flex items-center justify-between gap-4 rounded-xl border border-line bg-surface p-4 transition-colors hover:border-accent/50"
    >
      <div className="flex flex-col gap-1">
        <span className="font-mono text-xs font-medium tracking-wide text-ink-dim uppercase">
          {game.league}
        </span>
        <span className="font-medium">
          {game.awayTeam.name} @ {game.homeTeam.name}
        </span>
        <span className="text-sm text-ink-dim">{formatGameTime(game.startTime)}</span>
      </div>
      <div className="flex flex-col items-end gap-1">
        {game.status === "live" && (
          <span className="flex items-center gap-1.5 rounded-full bg-positive-soft px-2 py-0.5 font-mono text-[10.5px] font-semibold tracking-wide text-positive">
            <span className="h-1.5 w-1.5 rounded-full bg-positive" />
            {STATUS_LABEL.live}
          </span>
        )}
        {game.status === "final" && (
          <span className="font-mono text-xs font-semibold text-ink-dim">{STATUS_LABEL.final}</span>
        )}
        {hasScore && (
          <span className="font-mono text-sm font-semibold tabular-nums">
            {game.awayScore}-{game.homeScore}
          </span>
        )}
      </div>
    </Link>
  );
}
