"use client";

import { useRef, useState } from "react";
import { OddsFormat, oddsFromAmerican, parseOdds } from "@/lib/odds/convert";
import { ParlayLeg, parlayPayout } from "@/lib/odds/parlay";
import { formatAmerican, formatCurrency } from "@/lib/odds/format";
import { retextOdds } from "@/lib/odds/reformat";
import { OddsFormatToggle } from "@/components/ui/OddsFormatToggle";
import { OddsInput } from "@/components/ui/OddsInput";
import { StakeInput } from "@/components/ui/StakeInput";
import { ResultCard } from "@/components/ui/ResultCard";
import { useOddsFormat } from "@/hooks/useOddsFormat";

const MIN_LEGS = 2;
const MAX_LEGS = 12;

interface LegState {
  id: number;
  value: string;
  push: boolean;
}

export function ParlayCalculator() {
  const [format, setFormat] = useOddsFormat();
  const [stakeValue, setStakeValue] = useState("100");
  const nextId = useRef(2);
  const [legs, setLegs] = useState<LegState[]>([
    { id: 0, value: "-110", push: false },
    { id: 1, value: "-110", push: false },
  ]);

  function addLeg() {
    if (legs.length >= MAX_LEGS) return;
    setLegs((prev) => [...prev, { id: nextId.current++, value: "", push: false }]);
  }

  function removeLeg(id: number) {
    if (legs.length <= MIN_LEGS) return;
    setLegs((prev) => prev.filter((leg) => leg.id !== id));
  }

  function updateLeg(id: number, patch: Partial<LegState>) {
    setLegs((prev) => prev.map((leg) => (leg.id === id ? { ...leg, ...patch } : leg)));
  }

  function handleFormatChange(next: OddsFormat) {
    setLegs((prev) => prev.map((leg) => ({ ...leg, value: retextOdds(leg.value, format, next) })));
    setFormat(next);
  }

  const parlayLegs: ParlayLeg[] = [];
  let hasError = false;
  for (const leg of legs) {
    if (leg.push) {
      parlayLegs.push({ odds: oddsFromAmerican(-110), push: true });
      continue;
    }
    if (leg.value.trim() === "") {
      hasError = true;
      continue;
    }
    try {
      parlayLegs.push({ odds: parseOdds(leg.value, format) });
    } catch {
      hasError = true;
    }
  }

  const stake = Number(stakeValue);
  const validStake = Number.isFinite(stake) && stake > 0;

  let result: ReturnType<typeof parlayPayout> | null = null;
  if (!hasError && validStake && parlayLegs.length >= MIN_LEGS) {
    try {
      result = parlayPayout(stake, parlayLegs);
    } catch {
      result = null;
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <OddsFormatToggle value={format} onChange={handleFormatChange} />
      <StakeInput value={stakeValue} onChange={setStakeValue} />

      <div className="flex flex-col gap-3">
        {legs.map((leg, index) => (
          <div key={leg.id} className="flex items-end gap-2">
            <div className="flex-1">
              <OddsInput
                label={`Leg ${index + 1}`}
                format={format}
                value={leg.value}
                onChange={(value) => updateLeg(leg.id, { value })}
                placeholder={leg.push ? "Pushed — no action" : undefined}
              />
            </div>
            <label className="mb-2.5 flex items-center gap-1.5 text-xs text-ink-dim">
              <input
                type="checkbox"
                checked={leg.push}
                onChange={(event) => updateLeg(leg.id, { push: event.target.checked })}
              />
              Push
            </label>
            <button
              type="button"
              onClick={() => removeLeg(leg.id)}
              disabled={legs.length <= MIN_LEGS}
              aria-label={`Remove leg ${index + 1}`}
              className="mb-2.5 text-xs text-ink-dim hover:text-negative disabled:opacity-30 disabled:hover:text-ink-dim"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addLeg}
        disabled={legs.length >= MAX_LEGS}
        className="self-start rounded-lg border border-line px-3 py-1.5 text-sm font-medium text-ink transition-colors hover:border-accent/50 disabled:opacity-40"
      >
        + Add leg ({legs.length}/{MAX_LEGS})
      </button>

      {result?.voided ? (
        <ResultCard
          primary={{ label: "Result", value: "Void — all legs pushed" }}
          rows={[{ label: "Stake refunded", value: formatCurrency(result.stake) }]}
        />
      ) : (
        <ResultCard
          primary={{ label: "Payout", value: result ? formatCurrency(result.payout) : "—" }}
          rows={[
            {
              label: "Profit",
              value: result ? formatCurrency(result.profit) : "—",
              emphasis: true,
              tone: "positive",
            },
            {
              label: "Parlay Odds",
              value: result?.odds ? formatAmerican(result.odds.american) : "—",
            },
          ]}
        />
      )}
    </div>
  );
}
