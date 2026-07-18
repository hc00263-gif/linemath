"use client";

import { useState } from "react";
import { Odds, OddsFormat, parseOdds } from "@/lib/odds/convert";
import { formatAmerican, formatDecimal, formatFractional, formatImplied } from "@/lib/odds/format";
import { retextOdds } from "@/lib/odds/reformat";
import { OddsFormatToggle } from "@/components/ui/OddsFormatToggle";
import { OddsInput } from "@/components/ui/OddsInput";
import { ResultCard } from "@/components/ui/ResultCard";
import { useOddsFormat } from "@/hooks/useOddsFormat";

export function OddsConverterCalculator() {
  const [format, setFormat] = useOddsFormat();
  const [value, setValue] = useState("-110");

  function handleFormatChange(next: OddsFormat) {
    setValue((prev) => retextOdds(prev, format, next));
    setFormat(next);
  }

  let odds: Odds | null = null;
  if (value.trim() !== "") {
    try {
      odds = parseOdds(value, format);
    } catch {
      odds = null;
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <OddsFormatToggle value={format} onChange={handleFormatChange} />
      <OddsInput label="Odds" format={format} value={value} onChange={setValue} />
      <ResultCard
        primary={{ label: "American", value: odds ? formatAmerican(odds.american) : "—" }}
        rows={[
          { label: "Decimal", value: odds ? formatDecimal(odds.decimal) : "—" },
          { label: "Fractional", value: odds ? formatFractional(odds.fractional) : "—" },
          { label: "Implied Probability", value: odds ? formatImplied(odds.implied) : "—" },
        ]}
      />
    </div>
  );
}
