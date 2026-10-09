"use client";

import { useState } from "react";
import { OddsFormat } from "@/lib/odds/convert";
import { evCalc } from "@/lib/odds/ev";
import { formatCurrency, formatImplied } from "@/lib/odds/format";
import { retextOdds } from "@/lib/odds/reformat";
import { parsePercentFraction, parsePositive, tryParseOdds } from "@/lib/odds/tryParse";
import { ShareButton } from "@/components/ui/ShareButton";
import { useInitialInputs } from "@/hooks/useInitialInputs";
import { OddsFormatToggle } from "@/components/ui/OddsFormatToggle";
import { OddsInput } from "@/components/ui/OddsInput";
import { StakeInput } from "@/components/ui/StakeInput";
import { StatField } from "@/components/ui/StatField";
import { ResultCard } from "@/components/ui/ResultCard";
import { useOddsFormat } from "@/hooks/useOddsFormat";

export function EvCalculator() {
  const [format, setFormat] = useOddsFormat();
  const initial = useInitialInputs();
  const [stakeValue, setStakeValue] = useState(() => initial("stake", "100"));
  const [oddsValue, setOddsValue] = useState(() => initial("odds", "120"));
  const [probValue, setProbValue] = useState(() => initial("p", "50"));

  function handleFormatChange(next: OddsFormat) {
    setOddsValue((prev) => retextOdds(prev, format, next));
    setFormat(next);
  }

  const stake = parsePositive(stakeValue);
  const odds = tryParseOdds(oddsValue, format);
  const p = parsePercentFraction(probValue);
  const result = stake && odds && p ? evCalc(stake, odds, p) : null;
  const tone = result ? (result.evDollars >= 0 ? "positive" : "negative") : "neutral";

  return (
    <div className="flex flex-col gap-4">
      <OddsFormatToggle value={format} onChange={handleFormatChange} />
      <div className="grid gap-4 sm:grid-cols-3">
        <StakeInput value={stakeValue} onChange={setStakeValue} />
        <OddsInput label="Odds" format={format} value={oddsValue} onChange={setOddsValue} />
        <StatField label="Your win probability (%)" value={probValue} onChange={setProbValue} />
      </div>
      <ResultCard
        primary={{
          label: "Expected value",
          value: result ? `${result.evDollars >= 0 ? "+" : ""}${formatCurrency(result.evDollars)}` : "—",
          tone,
        }}
        rows={[
          { label: "EV as % of stake", value: result ? `${result.evPercent.toFixed(2)}%` : "—", emphasis: true, tone },
          { label: "Break-even win probability", value: result ? formatImplied(result.breakEvenPercent) : "—" },
          { label: "Your edge (percentage points)", value: result ? `${result.edgePoints.toFixed(2)}` : "—" },
          { label: "Profit if it wins", value: result ? formatCurrency(result.profitIfWin) : "—" },
        ]}
        note="Expected value is a long-run average, not a prediction for any single bet — and it's only as good as your probability estimate."
      />
      <ShareButton params={{ stake: stakeValue, odds: oddsValue, p: probValue, fmt: format }} />
    </div>
  );
}
