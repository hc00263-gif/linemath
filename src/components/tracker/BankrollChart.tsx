import { SeriesPoint } from "@/lib/tracker/stats";
import { formatCurrency } from "@/lib/odds/format";

const W = 600;
const H = 200;
const PAD = { top: 16, right: 16, bottom: 22, left: 16 };

/** Cumulative profit over settled bets. Zero line is dashed; the endpoint is colored by sign. */
export function BankrollChart({ series }: { series: SeriesPoint[] }) {
  if (series.length < 2) {
    return (
      <div className="flex h-[200px] items-center justify-center rounded-xl border border-line bg-surface px-4 text-center text-sm text-ink-dim">
        Settle at least two bets to see your profit curve.
      </div>
    );
  }
  const values = [0, ...series.map((p) => p.cumulative)];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const x = (i: number) => PAD.left + (i / (series.length - 1)) * (W - PAD.left - PAD.right);
  const y = (v: number) => PAD.top + (1 - (v - min) / span) * (H - PAD.top - PAD.bottom);
  const line = series.map((p, i) => `${x(i).toFixed(1)},${y(p.cumulative).toFixed(1)}`).join(" ");
  const area = `${x(0)},${y(0)} ${line} ${x(series.length - 1)},${y(0)}`;
  const last = series[series.length - 1];
  const positive = last.cumulative >= 0;
  return (
    <figure className="rounded-xl border border-line bg-surface p-4">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Cumulative profit over ${series.length} settled bets, ending at ${formatCurrency(last.cumulative)}`}
        className="h-auto w-full"
      >
        <line x1={PAD.left} x2={W - PAD.right} y1={y(0)} y2={y(0)} stroke="var(--line)" strokeDasharray="4 4" />
        <polygon points={area} fill="var(--accent)" opacity="0.08" />
        <polyline points={line} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        <circle cx={x(series.length - 1)} cy={y(last.cumulative)} r="4.5" fill={positive ? "var(--positive)" : "var(--negative)"} />
        <text x={PAD.left} y={H - 6} fontSize="11" fill="var(--ink-dim)" fontFamily="var(--font-plex-mono)">
          {series[0].date}
        </text>
        <text x={W - PAD.right} y={H - 6} fontSize="11" textAnchor="end" fill="var(--ink-dim)" fontFamily="var(--font-plex-mono)">
          {last.date}
        </text>
      </svg>
      <figcaption className="mt-1 flex justify-between font-mono text-xs text-ink-dim">
        <span>Low {formatCurrency(min)}</span>
        <span>High {formatCurrency(max)}</span>
      </figcaption>
    </figure>
  );
}
