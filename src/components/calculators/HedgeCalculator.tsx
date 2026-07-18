"use client";

import { useState } from "react";
import { Odds, OddsFormat, parseOdds } from "@/lib/odds/convert";
import { hedgeStake } from "@/lib/odds/hedge";
import { formatCurrency } from "@/lib/odds/format";
import { retextOdds } from "@/lib/odds/reformat";
import { OddsFormatToggle } from "@/components/ui/OddsFormatToggle";
import { OddsInput } from "@/components/ui/OddsInput";
import { StakeInput } from "@/components/ui/StakeInput";
import { ResultCard } from "@/components/ui/ResultCard";
import { useOddsFormat } from "@/hooks/useOddsFormat";

function tryParseOdds(value: string, format: Parameters<typeof parseOdds>[1]): Odds | null {
  if (value.trim() === "") return null;
  try {
    return parseOdds(value, format);
  } catch {
    return null;
  }
}

export function HedgeCalculator() {
  const [format, setFormat] = useOddsFormat();
  const [stakeValue, setStakeValue] = useState("100");
  const [originalOddsValue, setOriginalOddsValue] = useState("300");
  const [hedgeOddsValue, setHedgeOddsValue] = useState("-150");

  function handleFormatChange(next: OddsFormat) {
    setOriginalOddsValue((prev) => retextOdds(prev, format, next));
    setHedgeOddsValue((prev) => retextOdds(prev, format, next));
    setFormat(next);
  }

  const originalOdds = tryParseOdds(originalOddsValue, format);
  const hedgeOdds = tryParseOdds(hedgeOddsValue, format);
  const stake = Number(stakeValue);
  const validStake = Number.isFinite(stake) && stake > 0;

  const result =
    originalOdds && hedgeOdds && validStake ? hedgeStake(stake, originalOdds, hedgeOdds) : null;

  return (
    <div className="flex flex-col gap-4">
      <OddsFormatToggle value={format} onChange={handleFormatChange} />
      <StakeInput label="Original Stake" value={stakeValue} onChange={setStakeValue} />
      <div className="grid gap-4 sm:grid-cols-2">
        <OddsInput
          label="Original Odds"
          format={format}
          value={originalOddsValue}
          onChange={setOriginalOddsValue}
        />
        <OddsInput label="Hedge Odds" format={format} value={hedgeOddsValue} onChange={setHedgeOddsValue} />
      </div>
      <ResultCard
        primary={{ label: "Hedge Stake", value: result ? formatCurrency(result.hedgeStake) : "—" }}
        rows={[
          {
            label: "Guaranteed Profit",
            value: result ? formatCurrency(result.guaranteedProfit) : "—",
            emphasis: true,
          },
        ]}
        note="Guaranteed profit before limits, line movement, and bet cancellation risk."
      />
    </div>
  );
}
