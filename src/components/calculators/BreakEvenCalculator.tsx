"use client";

import { useState } from "react";
import { OddsFormat } from "@/lib/odds/convert";
import { retextOdds } from "@/lib/odds/reformat";
import { tryParseOdds } from "@/lib/odds/tryParse";
import { OddsFormatToggle } from "@/components/ui/OddsFormatToggle";
import { OddsInput } from "@/components/ui/OddsInput";
import { StatField } from "@/components/ui/StatField";
import { ShareButton } from "@/components/ui/ShareButton";
import { ResultCard } from "@/components/ui/ResultCard";
import { useInitialInputs } from "@/hooks/useInitialInputs";
import { useOddsFormat } from "@/hooks/useOddsFormat";

import { recordResult } from "@/lib/odds/breakeven";
import { formatImplied } from "@/lib/odds/format";

function wholeNumber(value: string): number | null {
  const n = Number(value);
  return Number.isInteger(n) && n >= 0 ? n : null;
}

export function BreakEvenCalculator() {
  const [format, setFormat] = useOddsFormat();
  const initial = useInitialInputs();
  const [oddsValue, setOddsValue] = useState(() => initial("odds", "-110"));
  const [winsValue, setWinsValue] = useState(() => initial("w", "55"));
  const [lossesValue, setLossesValue] = useState(() => initial("l", "45"));

  function handleFormatChange(next: OddsFormat) {
    setOddsValue((prev) => retextOdds(prev, format, next));
    setFormat(next);
  }

  const odds = tryParseOdds(oddsValue, format);
  const wins = wholeNumber(winsValue);
  const losses = wholeNumber(lossesValue);
  const result = odds && wins !== null && losses !== null && wins + losses > 0 ? recordResult(odds, wins, losses) : null;
  const units = result ? result.profitUnits : 0;

  return (
    <div className="flex flex-col gap-4">
      <OddsFormatToggle value={format} onChange={handleFormatChange} />
      <div className="grid gap-4 sm:grid-cols-3">
        <OddsInput label="Average odds" format={format} value={oddsValue} onChange={setOddsValue} />
        <StatField label="Wins" value={winsValue} onChange={setWinsValue} />
        <StatField label="Losses" value={lossesValue} onChange={setLossesValue} />
      </div>
      <ResultCard
        primary={{ label: "Break-even win rate", value: result ? formatImplied(result.breakEvenPercent) : "—" }}
        rows={[
          { label: "Your win rate", value: result ? formatImplied(result.winPercent) : "—" },
          { label: "Fewest wins to profit over this many bets", value: result ? String(result.minWinsToProfit) : "—" },
          {
            label: "Profit (1 unit per bet)",
            value: result ? `${units >= 0 ? "+" : "−"}${Math.abs(units).toFixed(2)} units` : "—",
            emphasis: true,
            tone: result ? (units >= 0 ? "positive" : "negative") : "neutral",
          },
          { label: "ROI", value: result ? `${result.roiPercent.toFixed(2)}%` : "—", tone: result ? (units >= 0 ? "positive" : "negative") : "neutral" },
        ]}
        note="Assumes flat stakes at the same odds on every bet; pushes should be left out of the record."
      />
      <ShareButton params={{ odds: oddsValue, w: winsValue, l: lossesValue, fmt: format }} />
    </div>
  );
}
