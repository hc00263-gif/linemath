"use client";

import { useState } from "react";
import { OddsFormat } from "@/lib/odds/convert";
import { retextOdds } from "@/lib/odds/reformat";
import { parsePercentFraction, tryParseOdds } from "@/lib/odds/tryParse";
import { OddsFormatToggle } from "@/components/ui/OddsFormatToggle";
import { OddsInput } from "@/components/ui/OddsInput";
import { StatField } from "@/components/ui/StatField";
import { Segmented } from "@/components/ui/Segmented";
import { ShareButton } from "@/components/ui/ShareButton";
import { ResultCard } from "@/components/ui/ResultCard";
import { useInitialInputs } from "@/hooks/useInitialInputs";
import { useOddsFormat } from "@/hooks/useOddsFormat";

import { parseOdds } from "@/lib/odds/convert";
import { formatAmerican, formatDecimal, formatFractional, formatImplied } from "@/lib/odds/format";

type Mode = "odds" | "prob";

export function ImpliedProbabilityCalculator() {
  const [format, setFormat] = useOddsFormat();
  const initial = useInitialInputs();
  const [mode, setMode] = useState<Mode>(() => (initial("mode", "odds") === "prob" ? "prob" : "odds"));
  const [oddsValue, setOddsValue] = useState(() => initial("odds", "-110"));
  const [probValue, setProbValue] = useState(() => initial("p", "52.38"));

  function handleFormatChange(next: OddsFormat) {
    setOddsValue((prev) => retextOdds(prev, format, next));
    setFormat(next);
  }

  const fromOdds = mode === "odds" ? tryParseOdds(oddsValue, format) : null;
  const p = mode === "prob" ? parsePercentFraction(probValue) : null;
  let fromProb = null;
  if (p) {
    try {
      fromProb = parseOdds(String(p * 100), "implied");
    } catch {
      fromProb = null;
    }
  }
  const odds = fromOdds ?? fromProb;

  return (
    <div className="flex flex-col gap-4">
      <Segmented
        label="Direction"
        value={mode}
        onChange={setMode}
        options={[
          { value: "odds", label: "Odds → probability" },
          { value: "prob", label: "Probability → odds" },
        ]}
      />
      {mode === "odds" ? (
        <>
          <OddsFormatToggle value={format} onChange={handleFormatChange} />
          <OddsInput label="Odds" format={format} value={oddsValue} onChange={setOddsValue} />
        </>
      ) : (
        <StatField label="Win probability (%)" value={probValue} onChange={setProbValue} />
      )}
      <ResultCard
        primary={{
          label: mode === "odds" ? "Implied win probability" : "Fair American odds",
          value: odds ? (mode === "odds" ? formatImplied(odds.implied) : formatAmerican(odds.american)) : "—",
        }}
        rows={[
          { label: "American", value: odds ? formatAmerican(odds.american) : "—" },
          { label: "Decimal", value: odds ? formatDecimal(odds.decimal) : "—" },
          { label: "Fractional", value: odds ? formatFractional(odds.fractional) : "—" },
          { label: "Break-even win rate", value: odds ? formatImplied(odds.implied) : "—", emphasis: true },
        ]}
        note="Implied probability includes the sportsbook's margin. Use the no-vig calculator to remove it."
      />
      <ShareButton params={{ mode, odds: oddsValue, p: probValue, fmt: format }} />
    </div>
  );
}
