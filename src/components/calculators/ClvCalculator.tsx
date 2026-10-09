"use client";

import { useState } from "react";
import { OddsFormat } from "@/lib/odds/convert";
import { retextOdds } from "@/lib/odds/reformat";
import { tryParseOdds } from "@/lib/odds/tryParse";
import { OddsFormatToggle } from "@/components/ui/OddsFormatToggle";
import { OddsInput } from "@/components/ui/OddsInput";
import { ShareButton } from "@/components/ui/ShareButton";
import { ResultCard } from "@/components/ui/ResultCard";
import { useInitialInputs } from "@/hooks/useInitialInputs";
import { useOddsFormat } from "@/hooks/useOddsFormat";

import { clvCalc } from "@/lib/odds/clv";
import { formatAmerican, formatImplied } from "@/lib/odds/format";

export function ClvCalculator() {
  const [format, setFormat] = useOddsFormat();
  const initial = useInitialInputs();
  const [betValue, setBetValue] = useState(() => initial("bet", "110"));
  const [closeValue, setCloseValue] = useState(() => initial("close", "-110"));
  const [oppValue, setOppValue] = useState(() => initial("opp", "-110"));

  function handleFormatChange(next: OddsFormat) {
    setBetValue((prev) => retextOdds(prev, format, next));
    setCloseValue((prev) => retextOdds(prev, format, next));
    setOppValue((prev) => retextOdds(prev, format, next));
    setFormat(next);
  }

  const bet = tryParseOdds(betValue, format);
  const close = tryParseOdds(closeValue, format);
  const opp = tryParseOdds(oppValue, format);
  const result = bet && close ? clvCalc(bet, close, opp ?? undefined) : null;
  const tone = result ? (result.clvPercent >= 0 ? "positive" : "negative") : "neutral";

  return (
    <div className="flex flex-col gap-4">
      <OddsFormatToggle value={format} onChange={handleFormatChange} />
      <div className="grid gap-4 sm:grid-cols-3">
        <OddsInput label="Odds you bet" format={format} value={betValue} onChange={setBetValue} />
        <OddsInput label="Closing odds, same side" format={format} value={closeValue} onChange={setCloseValue} />
        <OddsInput label="Closing odds, other side" format={format} value={oppValue} onChange={setOppValue} />
      </div>
      <ResultCard
        primary={{
          label: "Closing line value",
          value: result ? `${result.clvPercent >= 0 ? "+" : ""}${result.clvPercent.toFixed(2)}%` : "—",
          tone,
        }}
        rows={[
          { label: "Probability points gained vs close", value: result ? result.clvPoints.toFixed(2) : "—", emphasis: true, tone },
          { label: "Your price implied", value: result ? formatImplied(result.betImplied) : "—" },
          { label: result?.devigged ? "Fair closing probability (no-vig)" : "Closing probability (includes vig)", value: result ? formatImplied(result.closeProbability) : "—" },
          { label: "Fair closing odds", value: result ? formatAmerican(result.fairCloseOdds.american) : "—" },
        ]}
        note={result && !result.devigged ? "Add the other side's closing odds to remove the vig — without it, CLV is overstated." : "CLV measures price quality, not whether this bet won. Beating the close consistently is a strong sign of a real edge."}
      />
      <ShareButton params={{ bet: betValue, close: closeValue, opp: oppValue, fmt: format }} />
    </div>
  );
}
