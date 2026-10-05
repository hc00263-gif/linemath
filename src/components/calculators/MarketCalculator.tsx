"use client";

import { useState } from "react";
import { Odds, OddsFormat } from "@/lib/odds/convert";
import { noVig2Way, noVig3Way } from "@/lib/odds/novig";
import { holdPercent } from "@/lib/odds/vig";
import { formatAmerican, formatImplied } from "@/lib/odds/format";
import { retextOdds } from "@/lib/odds/reformat";
import { tryParseOdds } from "@/lib/odds/tryParse";
import { OddsFormatToggle } from "@/components/ui/OddsFormatToggle";
import { OddsInput } from "@/components/ui/OddsInput";
import { ResultCard } from "@/components/ui/ResultCard";
import { useOddsFormat } from "@/hooks/useOddsFormat";

const LABELS = ["Outcome A", "Outcome B", "Outcome C (draw)"];

/** Shared by the vig calculator (primary = book margin) and the no-vig calculator (primary = fair odds). */
export function MarketCalculator({ mode }: { mode: "vig" | "novig" }) {
  const [format, setFormat] = useOddsFormat();
  const [values, setValues] = useState(["-110", "-110", "+250"]);
  const [threeWay, setThreeWay] = useState(false);

  function handleFormatChange(next: OddsFormat) {
    setValues((prev) => prev.map((v) => retextOdds(v, format, next)));
    setFormat(next);
  }

  const count = threeWay ? 3 : 2;
  const parsed = values.slice(0, count).map((v) => tryParseOdds(v, format));
  const complete = parsed.every((o): o is Odds => o !== null);
  const odds = complete ? (parsed as Odds[]) : null;

  const vig = odds ? holdPercent(odds) : null;
  const fair = odds ? (threeWay ? noVig3Way(odds[0], odds[1], odds[2]) : noVig2Way(odds[0], odds[1])) : null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <OddsFormatToggle value={format} onChange={handleFormatChange} />
        <label className="flex items-center gap-2 text-sm text-ink-dim">
          <input type="checkbox" checked={threeWay} onChange={(e) => setThreeWay(e.target.checked)} />
          Three-way market (adds a draw)
        </label>
      </div>
      <div className={`grid gap-4 ${threeWay ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
        {Array.from({ length: count }, (_, i) => (
          <OddsInput
            key={i}
            label={LABELS[i]}
            format={format}
            value={values[i]}
            onChange={(v) => setValues((prev) => prev.map((p, j) => (j === i ? v : p)))}
          />
        ))}
      </div>

      {mode === "vig" ? (
        <ResultCard
          primary={{ label: "Hold (book margin)", value: vig ? formatImplied(vig.hold) : "—" }}
          rows={[
            { label: "Overround (vig)", value: vig ? formatImplied(vig.overround) : "—", emphasis: true },
            { label: "Total implied probability", value: vig ? formatImplied(vig.totalImplied) : "—" },
          ]}
          note="Hold is the book's built-in margin as a share of total handle. Overround is how far the implied probabilities exceed 100%."
        />
      ) : (
        <ResultCard
          primary={{
            label: "Fair odds, Outcome A",
            value: fair ? formatAmerican(fair.fairOdds[0].american) : "—",
          }}
          rows={[
            ...Array.from({ length: count }, (_, i) => ({
              label: `${LABELS[i].replace(" (draw)", "")} — fair win % / fair odds`,
              value: fair ? `${formatImplied(fair.fairProbabilities[i])} · ${formatAmerican(fair.fairOdds[i].american)}` : "—",
            })),
            { label: "Vig removed (hold)", value: fair ? formatImplied(fair.hold) : "—", emphasis: true },
          ]}
          note="Proportional (multiplicative) de-vig: each implied probability is scaled so the market sums to exactly 100%."
        />
      )}
    </div>
  );
}
