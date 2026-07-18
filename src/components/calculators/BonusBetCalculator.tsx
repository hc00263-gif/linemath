"use client";

import { useState } from "react";
import { Odds, OddsFormat, parseOdds } from "@/lib/odds/convert";
import { bonusBetConversion } from "@/lib/odds/bonusbet";
import { formatCurrency, formatImplied } from "@/lib/odds/format";
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

export function BonusBetCalculator() {
  const [format, setFormat] = useOddsFormat();
  const [bonusValue, setBonusValue] = useState("100");
  const [bonusOddsValue, setBonusOddsValue] = useState("200");
  const [hedgeOddsValue, setHedgeOddsValue] = useState("-220");

  function handleFormatChange(next: OddsFormat) {
    setBonusOddsValue((prev) => retextOdds(prev, format, next));
    setHedgeOddsValue((prev) => retextOdds(prev, format, next));
    setFormat(next);
  }

  const bonusOdds = tryParseOdds(bonusOddsValue, format);
  const hedgeOdds = tryParseOdds(hedgeOddsValue, format);
  const bonusAmount = Number(bonusValue);
  const validBonus = Number.isFinite(bonusAmount) && bonusAmount > 0;

  const result =
    bonusOdds && hedgeOdds && validBonus ? bonusBetConversion(bonusAmount, bonusOdds, hedgeOdds) : null;

  return (
    <div className="flex flex-col gap-4">
      <OddsFormatToggle value={format} onChange={handleFormatChange} />
      <StakeInput label="Bonus Bet Amount" value={bonusValue} onChange={setBonusValue} />
      <div className="grid gap-4 sm:grid-cols-2">
        <OddsInput
          label="Bonus Bet Odds"
          format={format}
          value={bonusOddsValue}
          onChange={setBonusOddsValue}
        />
        <OddsInput label="Hedge Odds" format={format} value={hedgeOddsValue} onChange={setHedgeOddsValue} />
      </div>
      <ResultCard
        primary={{ label: "Guaranteed Cash", value: result ? formatCurrency(result.guaranteedCash) : "—" }}
        rows={[
          { label: "Hedge Stake", value: result ? formatCurrency(result.hedgeStake) : "—" },
          {
            label: "Conversion Rate",
            value: result ? formatImplied(result.conversionRate) : "—",
            emphasis: true,
          },
        ]}
        note="Free bets don't return the stake if they win — this accounts for that."
      />
    </div>
  );
}
