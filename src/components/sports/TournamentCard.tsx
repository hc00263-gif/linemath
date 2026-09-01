import { TennisMajor } from "@/lib/sports/types";
import { formatDateRange } from "@/lib/sports/format";

export function TournamentCard({ major }: { major: TennisMajor }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-line bg-surface p-4">
      <div className="flex flex-col gap-1">
        <span className="font-mono text-xs font-medium tracking-wide text-ink-dim uppercase">
          Tennis · {major.tour}
        </span>
        <span className="font-medium">{major.name}</span>
        <span className="text-sm text-ink-dim">{major.location}</span>
      </div>
      <span className="font-mono text-sm font-semibold tabular-nums">
        {formatDateRange(major.startDate, major.endDate)}
      </span>
    </div>
  );
}
