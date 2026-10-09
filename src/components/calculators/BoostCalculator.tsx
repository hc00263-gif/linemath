"use client";

import { useState } from "react";
import { OddsFormat } from "@/lib/odds/convert";
import { retextOdds } from "@/lib/odds/reformat";
import { parsePositive, tryParseOdds } from "@/lib/odds/tryParse";
import { OddsFormatToggle } from "@/components/ui/OddsFormatToggle";
import { OddsInput } from "@/components/ui/OddsInput";
import { StakeInput } from "@/components/ui/StakeInput";
import { StatField } from "@/components/ui/StatField";
import { ShareButton } from "@/components/ui/ShareButton";
import { ResultCard } from "@/components/ui/ResultCard";
import { useInitialInputs } from "@/hooks/useInitialInputs";
import { useOddsFormat } from "@/hooks/useOddsFormat";

import { profitBoost } from "@/lib/odds/boost";
import { formatAmerican, formatCurrency, formatImplied } from "@/lib/odds/format";

export function BoostCalculator() {
  const [format, setFormat] = useOddsFormat();
  const initial = useInitialInputs();
  const [stakeValue, setStakeValue] = useState(() => initial("stake", "100"));
  const [oddsValue, setOddsValue] = useState(() => initial("odds", "-110"));
  const [boostValue, setBoostValue] = useState(() => initial("boost", "25"));

  function handleFormatChange(next: OddsFormat) {
    setOddsValue((prev) => retextOdds(prev, format, next));
    setFormat(next);
  }

  const stake = parsePositive(stakeValue);
  const odds = tryParseOdds(oddsValue, format);
  const boost = parsePositive(boostValue);
  const result = stake && odds && boost && boost <= 1000 ? profitBoost(stake, odds, boost) : null;

  return (
    <div className="flex flex-col gap-4">
      <OddsFormatToggle value={format} onChange={handleFormatChange} />
      <div className="grid gap-4 sm:grid-cols-3">
        <StakeInput value={stakeValue} onChange={setStakeValue} />
        <OddsInput label="Original odds" format={format} value={oddsValue} onChange={setOddsValue} />
        <StatField label="Boost (%)" value={boostValue} onChange={setBoostValue} />
      </div>
      <ResultCard
        primary={{ label: "Boosted profit", value: result ? formatCurrency(result.boostedProfit) : "—", tone: "positive" }}
        rows={[
          { label: "Extra profit from the boost", value: result ? formatCurrency(result.extraProfit) : "—", emphasis: true, tone: "positive" },
          { label: "Effective boosted odds", value: result ? formatAmerican(result.boostedOdds.american) : "—" },
          { label: "Total payout if it wins", value: result ? formatCurrency(result.boostedPayout) : "—" },
          { label: "Break-even win % before → after", value: result ? `${formatImplied(result.breakEvenBefore)} → ${formatImplied(result.breakEvenAfter)}` : "—" },
        ]}
        note="A profit boost raises the profit on a bet you place with your own money — your stake is returned on a win. It is not a bonus bet."
      />
      <ShareButton params={{ stake: stakeValue, odds: oddsValue, boost: boostValue, fmt: format }} />
    </div>
  );
}
