import { TennisMajor } from "@/lib/sports/types";
import { formatDateRange } from "@/lib/sports/format";

export function TournamentCard({ major }: { major: TennisMajor }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-black/10 p-4 dark:border-white/15">
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium uppercase tracking-wide text-black/40 dark:text-white/40">
          Tennis · {major.tour}
        </span>
        <span className="font-medium">{major.name}</span>
        <span className="text-sm text-black/60 dark:text-white/60">{major.location}</span>
      </div>
      <span className="text-sm font-semibold tabular-nums">
        {formatDateRange(major.startDate, major.endDate)}
      </span>
    </div>
  );
}
