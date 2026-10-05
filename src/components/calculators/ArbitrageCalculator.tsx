"use client";

import { useState } from "react";
import { Odds, OddsFormat } from "@/lib/odds/convert";
import { arbStakes } from "@/lib/odds/arbitrage";
import { formatCurrency, formatImplied } from "@/lib/odds/format";
import { retextOdds } from "@/lib/odds/reformat";
import { parsePositive, tryParseOdds } from "@/lib/odds/tryParse";
import { OddsFormatToggle } from "@/components/ui/OddsFormatToggle";
import { OddsInput } from "@/components/ui/OddsInput";
import { StakeInput } from "@/components/ui/StakeInput";
import { ResultCard } from "@/components/ui/ResultCard";
import { useOddsFormat } from "@/hooks/useOddsFormat";

const LABELS = ["Outcome A (book 1)", "Outcome B (book 2)", "Outcome C (draw, book 3)"];

export function ArbitrageCalculator() {
  const [format, setFormat] = useOddsFormat();
  const [stakeValue, setStakeValue] = useState("1000");
  const [values, setValues] = useState(["105", "-102", "+250"]);
  const [threeWay, setThreeWay] = useState(false);

  function handleFormatChange(next: OddsFormat) {
    setValues((prev) => prev.map((v) => retextOdds(v, format, next)));
    setFormat(next);
  }

  const count = threeWay ? 3 : 2;
  const parsed = values.slice(0, count).map((v) => tryParseOdds(v, format));
  const total = parsePositive(stakeValue);
  const odds = parsed.every((o): o is Odds => o !== null) ? (parsed as Odds[]) : null;
  const result = total && odds ? arbStakes(total, odds[0], odds[1], odds[2]) : null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <OddsFormatToggle value={format} onChange={handleFormatChange} />
        <label className="flex items-center gap-2 text-sm text-ink-dim">
          <input type="checkbox" checked={threeWay} onChange={(e) => setThreeWay(e.target.checked)} />
          Three-way market
        </label>
      </div>
      <StakeInput label="Total to stake" value={stakeValue} onChange={setStakeValue} />
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
      <ResultCard
        primary={{
          label: result ? (result.hasArb ? "Arbitrage found — profit" : "No arbitrage — guaranteed loss") : "Result",
          value: result ? formatCurrency(result.profit) : "—",
          tone: result ? (result.hasArb ? "positive" : "negative") : "neutral",
        }}
        rows={[
          ...Array.from({ length: count }, (_, i) => ({
            label: `Stake on ${LABELS[i].split(" (")[0]}`,
            value: result ? formatCurrency(result.stakes[i]) : "—",
          })),
          { label: "Payout either way", value: result ? formatCurrency(result.payout) : "—" },
          { label: "Combined implied probability", value: result ? formatImplied(result.arbPercent) : "—", emphasis: true },
          { label: "Return on total stake", value: result ? `${result.profitPercent.toFixed(2)}%` : "—" },
        ]}
        note="Guaranteed profit before limits, line movement, and bet cancellation risk. Under 100% combined implied probability means an arbitrage exists."
      />
    </div>
  );
}
