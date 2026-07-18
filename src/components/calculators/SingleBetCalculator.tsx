"use client";

import { useState } from "react";
import { Odds, OddsFormat, parseOdds } from "@/lib/odds/convert";
import { formatCurrency, formatImplied } from "@/lib/odds/format";
import { retextOdds } from "@/lib/odds/reformat";
import { OddsFormatToggle } from "@/components/ui/OddsFormatToggle";
import { OddsInput } from "@/components/ui/OddsInput";
import { StakeInput } from "@/components/ui/StakeInput";
import { ResultCard } from "@/components/ui/ResultCard";
import { useOddsFormat } from "@/hooks/useOddsFormat";

export function SingleBetCalculator() {
  const [format, setFormat] = useOddsFormat();
  const [oddsValue, setOddsValue] = useState("-110");
  const [stakeValue, setStakeValue] = useState("100");

  function handleFormatChange(next: OddsFormat) {
    setOddsValue((prev) => retextOdds(prev, format, next));
    setFormat(next);
  }

  let odds: Odds | null = null;
  if (oddsValue.trim() !== "") {
    try {
      odds = parseOdds(oddsValue, format);
    } catch {
      odds = null;
    }
  }

  const stake = Number(stakeValue);
  const validStake = Number.isFinite(stake) && stake > 0;

  const payout = odds && validStake ? stake * odds.decimal : null;
  const profit = payout !== null ? payout - stake : null;

  return (
    <div className="flex flex-col gap-4">
      <OddsFormatToggle value={format} onChange={handleFormatChange} />
      <div className="grid gap-4 sm:grid-cols-2">
        <StakeInput value={stakeValue} onChange={setStakeValue} />
        <OddsInput label="Odds" format={format} value={oddsValue} onChange={setOddsValue} />
      </div>
      <ResultCard
        primary={{ label: "Payout", value: payout !== null ? formatCurrency(payout) : "—" }}
        rows={[
          { label: "Profit", value: profit !== null ? formatCurrency(profit) : "—", emphasis: true },
          { label: "Implied Probability", value: odds ? formatImplied(odds.implied) : "—" },
        ]}
      />
    </div>
  );
}
