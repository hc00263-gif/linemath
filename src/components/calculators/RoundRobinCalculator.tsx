"use client";

import { useRef, useState } from "react";
import { Odds, OddsFormat } from "@/lib/odds/convert";
import { roundRobin } from "@/lib/odds/roundrobin";
import { formatCurrency } from "@/lib/odds/format";
import { retextOdds } from "@/lib/odds/reformat";
import { parsePositive, tryParseOdds } from "@/lib/odds/tryParse";
import { ShareButton } from "@/components/ui/ShareButton";
import { useInitialInputs } from "@/hooks/useInitialInputs";
import { OddsFormatToggle } from "@/components/ui/OddsFormatToggle";
import { OddsInput } from "@/components/ui/OddsInput";
import { StakeInput } from "@/components/ui/StakeInput";
import { ResultCard } from "@/components/ui/ResultCard";
import { useOddsFormat } from "@/hooks/useOddsFormat";

const MIN_LEGS = 3;
const MAX_LEGS = 8;

interface LegState {
  id: number;
  value: string;
}

export function RoundRobinCalculator() {
  const [format, setFormat] = useOddsFormat();
  const initial = useInitialInputs();
  const [stakeValue, setStakeValue] = useState(() => initial("stake", "10"));
  const [size, setSize] = useState(() => {
    const n = Number(initial("size", "2"));
    return Number.isInteger(n) && n >= 2 ? n : 2;
  });
  const nextId = useRef(100);
  const [legs, setLegs] = useState<LegState[]>(() => {
    const values = initial("legs", "-110,-110,-110").split(",").slice(0, MAX_LEGS);
    const safe = values.length >= MIN_LEGS ? values : ["-110", "-110", "-110"];
    return safe.map((value, id) => ({ id, value }));
  });

  function handleFormatChange(next: OddsFormat) {
    setLegs((prev) => prev.map((leg) => ({ ...leg, value: retextOdds(leg.value, format, next) })));
    setFormat(next);
  }

  const effectiveSize = Math.min(size, legs.length - 1);
  const parsed = legs.map((leg) => tryParseOdds(leg.value, format));
  const stake = parsePositive(stakeValue);
  const complete = parsed.every((o): o is Odds => o !== null);
  const result = complete && stake ? roundRobin(parsed as Odds[], effectiveSize, stake) : null;
  const winningScenarios = result ? result.scenarios.filter((s) => s.wins >= effectiveSize) : [];

  return (
    <div className="flex flex-col gap-4">
      <OddsFormatToggle value={format} onChange={handleFormatChange} />
      <div className="grid gap-4 sm:grid-cols-2">
        <StakeInput label="Stake per parlay" value={stakeValue} onChange={setStakeValue} />
        <div className="flex flex-col gap-1.5">
          <label htmlFor="rr-size" className="text-sm font-medium text-ink-dim">
            Parlay size
          </label>
          <select
            id="rr-size"
            value={effectiveSize}
            onChange={(event) => setSize(Number(event.target.value))}
            className="rounded-lg border border-line bg-surface px-3 py-2 font-mono text-base text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          >
            {Array.from({ length: legs.length - 2 }, (_, i) => i + 2).map((s) => (
              <option key={s} value={s}>
                {s}-leg parlays
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {legs.map((leg, index) => (
          <div key={leg.id} className="flex items-end gap-2">
            <div className="flex-1">
              <OddsInput
                label={`Selection ${index + 1}`}
                format={format}
                value={leg.value}
                onChange={(value) => setLegs((prev) => prev.map((l) => (l.id === leg.id ? { ...l, value } : l)))}
              />
            </div>
            <button
              type="button"
              onClick={() => setLegs((prev) => prev.filter((l) => l.id !== leg.id))}
              disabled={legs.length <= MIN_LEGS}
              aria-label={`Remove selection ${index + 1}`}
              className="mb-2.5 text-xs text-ink-dim hover:text-negative disabled:opacity-30 disabled:hover:text-ink-dim"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setLegs((prev) => [...prev, { id: nextId.current++, value: "" }])}
        disabled={legs.length >= MAX_LEGS}
        className="self-start rounded-lg border border-line px-3 py-1.5 text-sm font-medium text-ink transition-colors hover:border-accent/50 disabled:opacity-40"
      >
        + Add selection ({legs.length}/{MAX_LEGS})
      </button>

      <ResultCard
        primary={{ label: "Total staked", value: result ? formatCurrency(result.totalStake) : "—" }}
        rows={[
          { label: "Number of parlays", value: result ? String(result.combos.length) : "—" },
          {
            label: `All ${legs.length} win — payout`,
            value: result ? formatCurrency(result.maxPayout) : "—",
          },
          {
            label: `All ${legs.length} win — profit`,
            value: result ? formatCurrency(result.maxPayout - result.totalStake) : "—",
            emphasis: true,
            tone: "positive",
          },
          ...winningScenarios
            .filter((s) => s.wins < legs.length)
            .map((s) => ({
              label: `${s.wins} of ${legs.length} win — profit`,
              value: result
                ? s.minPayout === s.maxPayout
                  ? formatCurrency(s.maxPayout - result.totalStake)
                  : `${formatCurrency(s.minPayout - result.totalStake)} to ${formatCurrency(s.maxPayout - result.totalStake)}`
                : "—",
            })),
          {
            label: `Fewer than ${effectiveSize} win`,
            value: result ? `−${formatCurrency(result.totalStake)}` : "—",
            tone: "negative" as const,
          },
        ]}
        note="Ranges show the best and worst result depending on which selections win. Informational only — verify payouts with your sportsbook."
      />
      <ShareButton params={{ stake: stakeValue, size: String(effectiveSize), legs: legs.map((l) => l.value).join(","), fmt: format }} />
    </div>
  );
}
