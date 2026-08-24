import Link from "next/link";
import { Player } from "@/lib/sports/types";
import { SPORT_LABELS } from "@/lib/sports/provider";

export function PlayerCard({ player }: { player: Player }) {
  return (
    <Link
      href={`/players/${player.sport}/${player.id}`}
      className="flex items-center justify-between gap-4 rounded-xl border border-black/10 p-4 transition-colors hover:border-black/30 dark:border-white/15 dark:hover:border-white/40"
    >
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium uppercase tracking-wide text-black/40 dark:text-white/40">
          {SPORT_LABELS[player.sport]}
          {player.position ? ` · ${player.position}` : ""}
        </span>
        <span className="font-medium">{player.name}</span>
        {player.team && <span className="text-sm text-black/60 dark:text-white/60">{player.team.name}</span>}
      </div>
    </Link>
  );
}
