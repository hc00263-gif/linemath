"use client";

import { useState } from "react";
import { OddsFormat } from "@/lib/odds/convert";
import { teaserOdds } from "@/lib/odds/teaser";
import { formatCurrency, formatImplied } from "@/lib/odds/format";
import { retextOdds } from "@/lib/odds/reformat";
import { parsePositive, tryParseOdds } from "@/lib/odds/tryParse";
import { ShareButton } from "@/components/ui/ShareButton";
import { useInitialInputs } from "@/hooks/useInitialInputs";
import { OddsFormatToggle } from "@/components/ui/OddsFormatToggle";
import { OddsInput } from "@/components/ui/OddsInput";
import { StakeInput } from "@/components/ui/StakeInput";
import { ResultCard } from "@/components/ui/ResultCard";
import { useOddsFormat } from "@/hooks/useOddsFormat";

const LEG_OPTIONS = [2, 3, 4, 5, 6];

export function TeaserCalculator() {
  const [format, setFormat] = useOddsFormat();
  const initial = useInitialInputs();
  const [stakeValue, setStakeValue] = useState(() => initial("stake", "110"));
  const [oddsValue, setOddsValue] = useState(() => initial("odds", "-120"));
  const [legCount, setLegCount] = useState(() => {
    const n = Number(initial("legs", "2"));
    return n >= 2 && n <= 6 ? Math.round(n) : 2;
  });

  function handleFormatChange(next: OddsFormat) {
    setOddsValue((prev) => retextOdds(prev, format, next));
    setFormat(next);
  }

  const stake = parsePositive(stakeValue);
  const odds = tryParseOdds(oddsValue, format);
  const result = stake && odds ? teaserOdds(stake, odds, legCount) : null;

  return (
    <div className="flex flex-col gap-4">
      <OddsFormatToggle value={format} onChange={handleFormatChange} />
      <div className="grid gap-4 sm:grid-cols-3">
        <StakeInput value={stakeValue} onChange={setStakeValue} />
        <div className="flex flex-col gap-1.5">
          <label htmlFor="teaser-legs" className="text-sm font-medium text-ink-dim">
            Teams in teaser
          </label>
          <select
            id="teaser-legs"
            value={legCount}
            onChange={(event) => setLegCount(Number(event.target.value))}
            className="rounded-lg border border-line bg-surface px-3 py-2 font-mono text-base text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          >
            {LEG_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n} teams
              </option>
            ))}
          </select>
        </div>
        <OddsInput label="Teaser odds (from your book)" format={format} value={oddsValue} onChange={setOddsValue} />
      </div>
      <ResultCard
        primary={{ label: "Payout if all legs win", value: result ? formatCurrency(result.payout) : "—" }}
        rows={[
          { label: "Profit", value: result ? formatCurrency(result.profit) : "—", emphasis: true, tone: "positive" },
          { label: "Break-even: all legs win", value: result ? formatImplied(result.breakEvenAllLegs) : "—" },
          { label: "Break-even: each leg (equal legs)", value: result ? formatImplied(result.breakEvenPerLeg) : "—", emphasis: true },
        ]}
        note="Teaser payouts differ by sportsbook, sport, and points bought — enter the odds your book shows for this exact teaser."
      />
      <ShareButton params={{ stake: stakeValue, odds: oddsValue, legs: String(legCount), fmt: format }} />
    </div>
  );
}
