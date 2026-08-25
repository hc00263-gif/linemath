"use client";

import { useState } from "react";
import { getTeamPicks } from "@/lib/fantasy/draft";
import { StatField } from "@/components/ui/StatField";

export function DraftPickCalculator() {
  const [teamsValue, setTeamsValue] = useState("12");
  const [roundsValue, setRoundsValue] = useState("15");
  const [slotValue, setSlotValue] = useState("1");
  const [thirdRoundReversal, setThirdRoundReversal] = useState(false);

  const teams = Number(teamsValue);
  const rounds = Number(roundsValue);
  const slot = Number(slotValue);

  let picks: ReturnType<typeof getTeamPicks> | null = null;
  let error: string | null = null;
  if (Number.isFinite(teams) && Number.isFinite(rounds) && Number.isFinite(slot)) {
    try {
      picks = getTeamPicks(teams, rounds, slot, thirdRoundReversal);
    } catch (err) {
      error = err instanceof Error ? err.message : "Enter valid draft settings.";
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-3">
        <StatField label="Teams" value={teamsValue} onChange={setTeamsValue} />
        <StatField label="Rounds" value={roundsValue} onChange={setRoundsValue} />
        <StatField label="Your Slot" value={slotValue} onChange={setSlotValue} />
      </div>

      <label className="flex items-center gap-2 text-sm text-black/70 dark:text-white/70">
        <input
          type="checkbox"
          checked={thirdRoundReversal}
          onChange={(event) => setThirdRoundReversal(event.target.checked)}
        />
        3rd-round reversal (3RR)
      </label>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {picks && (
        <div className="rounded-xl border border-black/10 p-5 dark:border-white/15">
          <div className="text-sm font-medium text-black/60 dark:text-white/60">Your picks</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {picks.map((pick) => (
              <span
                key={pick.overallPick}
                className="rounded-full bg-black/[.04] px-3 py-1 text-sm font-semibold tabular-nums dark:bg-white/[.08]"
              >
                Rd {pick.round}, Pick {pick.overallPick}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
