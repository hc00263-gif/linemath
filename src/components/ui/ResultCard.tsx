export interface ResultCardRow {
  label: string;
  value: string;
  emphasis?: boolean;
}

export interface ResultCardProps {
  primary: { label: string; value: string };
  rows?: ResultCardRow[];
  note?: string;
}

/**
 * Big, instant result display — no submit button, computed live on every keystroke by
 * the calculator that renders it. Reserves its own height so results appearing/changing
 * never shifts layout (CLS).
 */
export function ResultCard({ primary, rows, note }: ResultCardProps) {
  return (
    <div className="rounded-xl border border-black/10 bg-black/[.02] p-5 dark:border-white/15 dark:bg-white/[.04]">
      <div className="text-sm font-medium text-black/60 dark:text-white/60">{primary.label}</div>
      <div className="mt-1 text-4xl font-bold tabular-nums tracking-tight">{primary.value}</div>
      {rows && rows.length > 0 && (
        <dl className="mt-4 flex flex-col gap-2 border-t border-black/10 pt-4 dark:border-white/15">
          {rows.map((row) => (
            <div key={row.label} className="flex items-baseline justify-between gap-4">
              <dt className="text-sm text-black/60 dark:text-white/60">{row.label}</dt>
              <dd
                className={`tabular-nums ${row.emphasis ? "text-base font-semibold" : "text-sm"}`}
              >
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      )}
      {note && <p className="mt-4 text-xs text-black/50 dark:text-white/50">{note}</p>}
    </div>
  );
}
