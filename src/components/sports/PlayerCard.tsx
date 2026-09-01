import Link from "next/link";
import { Player } from "@/lib/sports/types";
import { SPORT_LABELS } from "@/lib/sports/provider";

export function PlayerCard({ player }: { player: Player }) {
  return (
    <Link
      href={`/players/${player.sport}/${player.id}`}
      className="flex items-center justify-between gap-4 rounded-xl border border-line bg-surface p-4 transition-colors hover:border-accent/50"
    >
      <div className="flex flex-col gap-1">
        <span className="font-mono text-xs font-medium tracking-wide text-ink-dim uppercase">
          {SPORT_LABELS[player.sport]}
          {player.position ? ` · ${player.position}` : ""}
        </span>
        <span className="font-medium">{player.name}</span>
        {player.team && <span className="text-sm text-ink-dim">{player.team.name}</span>}
      </div>
    </Link>
  );
}
