"use client";

import { useState } from "react";
import { OddsFormat } from "@/lib/odds/convert";
import { KellyMultiplier, kellyFraction } from "@/lib/odds/kelly";
import { formatCurrency, formatImplied } from "@/lib/odds/format";
import { retextOdds } from "@/lib/odds/reformat";
import { parsePercentFraction, parsePositive, tryParseOdds } from "@/lib/odds/tryParse";
import { OddsFormatToggle } from "@/components/ui/OddsFormatToggle";
import { OddsInput } from "@/components/ui/OddsInput";
import { StakeInput } from "@/components/ui/StakeInput";
import { StatField } from "@/components/ui/StatField";
import { ResultCard } from "@/components/ui/ResultCard";
import { useOddsFormat } from "@/hooks/useOddsFormat";

const MULTIPLIERS: { value: KellyMultiplier; label: string }[] = [
  { value: 1, label: "Full Kelly" },
  { value: 0.5, label: "Half Kelly" },
  { value: 0.25, label: "Quarter Kelly" },
];

export function KellyCalculator() {
  const [format, setFormat] = useOddsFormat();
  const [bankrollValue, setBankrollValue] = useState("1000");
  const [oddsValue, setOddsValue] = useState("150");
  const [probValue, setProbValue] = useState("45");
  const [multiplier, setMultiplier] = useState<KellyMultiplier>(0.5);

  function handleFormatChange(next: OddsFormat) {
    setOddsValue((prev) => retextOdds(prev, format, next));
    setFormat(next);
  }

  const bankroll = parsePositive(bankrollValue);
  const odds = tryParseOdds(oddsValue, format);
  const p = parsePercentFraction(probValue);
  const result = odds && p ? kellyFraction(odds, p, multiplier) : null;

  return (
    <div className="flex flex-col gap-4">
      <OddsFormatToggle value={format} onChange={handleFormatChange} />
      <div className="grid gap-4 sm:grid-cols-3">
        <StakeInput label="Bankroll" value={bankrollValue} onChange={setBankrollValue} />
        <OddsInput label="Odds" format={format} value={oddsValue} onChange={setOddsValue} />
        <StatField label="Your win probability (%)" value={probValue} onChange={setProbValue} />
      </div>
      <div role="radiogroup" aria-label="Kelly fraction" className="inline-flex self-start rounded-lg border border-line bg-fill p-1">
        {MULTIPLIERS.map((m) => (
          <button
            key={m.value}
            type="button"
            role="radio"
            aria-checked={multiplier === m.value}
            onClick={() => setMultiplier(m.value)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              multiplier === m.value ? "bg-surface-raised text-ink shadow-sm" : "text-ink-dim hover:text-ink"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>
      <ResultCard
        primary={{
          label: "Recommended stake",
          value: result && bankroll ? formatCurrency(bankroll * result.fraction) : "—",
          tone: result?.hasEdge ? "positive" : "neutral",
        }}
        rows={[
          { label: "Share of bankroll", value: result ? formatImplied(result.fraction * 100) : "—", emphasis: true },
          { label: "Full Kelly", value: result ? formatImplied(result.fullKelly * 100) : "—" },
        ]}
        note={
          result && !result.hasEdge
            ? "No edge at these odds and probability — Kelly says don't bet (0%)."
            : "Kelly sizing assumes your win probability is right. Most bettors use half or quarter Kelly because their estimates are noisy."
        }
      />
    </div>
  );
}
