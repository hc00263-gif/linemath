export type ResultTone = "neutral" | "positive" | "negative";

export interface ResultCardRow {
  label: string;
  value: string;
  emphasis?: boolean;
  tone?: ResultTone;
}

export interface ResultCardProps {
  primary: { label: string; value: string; tone?: ResultTone };
  rows?: ResultCardRow[];
  note?: string;
}

const TONE_CLASS: Record<ResultTone, string> = {
  neutral: "text-ink",
  positive: "text-positive",
  negative: "text-negative",
};

/**
 * Big, instant result display — no submit button, computed live on every keystroke by
 * the calculator that renders it. Reserves its own height so results appearing/changing
 * never shifts layout (CLS). `tone` is semantic — reserve "positive" for a genuine gain
 * (profit, guaranteed cash), never as decoration.
 */
export function ResultCard({ primary, rows, note }: ResultCardProps) {
  return (
    <div className="rounded-xl border border-line bg-surface p-5">
      <div className="text-sm font-medium text-ink-dim">{primary.label}</div>
      <div
        className={`mt-1 font-mono text-4xl font-semibold tracking-tight tabular-nums ${TONE_CLASS[primary.tone ?? "neutral"]}`}
      >
        {primary.value}
      </div>
      {rows && rows.length > 0 && (
        <dl className="mt-4 flex flex-col gap-2 border-t border-line pt-4">
          {rows.map((row) => (
            <div key={row.label} className="flex items-baseline justify-between gap-4">
              <dt className="text-sm text-ink-dim">{row.label}</dt>
              <dd
                className={`font-mono tabular-nums ${row.emphasis ? "text-base font-semibold" : "text-sm"} ${TONE_CLASS[row.tone ?? "neutral"]}`}
              >
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      )}
      {note && <p className="mt-4 text-xs text-ink-dim">{note}</p>}
    </div>
  );
}
