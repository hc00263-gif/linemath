"use client";

import { useState } from "react";
import { OddsFormat } from "@/lib/odds/convert";
import { retextOdds } from "@/lib/odds/reformat";
import { tryParseOdds } from "@/lib/odds/tryParse";
import { OddsFormatToggle } from "@/components/ui/OddsFormatToggle";
import { OddsInput } from "@/components/ui/OddsInput";
import { StatField } from "@/components/ui/StatField";
import { Segmented } from "@/components/ui/Segmented";
import { ShareButton } from "@/components/ui/ShareButton";
import { ResultCard } from "@/components/ui/ResultCard";
import { useInitialInputs } from "@/hooks/useInitialInputs";
import { useOddsFormat } from "@/hooks/useOddsFormat";

import { Odds } from "@/lib/odds/convert";
import { noVig2Way } from "@/lib/odds/novig";
import { SpreadSport, spreadToMoneyline, winProbabilityToSpread } from "@/lib/odds/spread";
import { formatAmerican, formatImplied } from "@/lib/odds/format";

type Mode = "spread" | "moneyline";

export function SpreadConverterCalculator() {
  const [format, setFormat] = useOddsFormat();
  const initial = useInitialInputs();
  const [mode, setMode] = useState<Mode>(() => (initial("mode", "spread") === "moneyline" ? "moneyline" : "spread"));
  const [sport, setSport] = useState<SpreadSport>(() => (initial("sport", "nfl") === "nba" ? "nba" : "nfl"));
  const [pointsValue, setPointsValue] = useState(() => initial("pts", "7"));
  const [favValue, setFavValue] = useState(() => initial("fav", "-300"));
  const [dogValue, setDogValue] = useState(() => initial("dog", "+250"));

  function handleFormatChange(next: OddsFormat) {
    setFavValue((prev) => retextOdds(prev, format, next));
    setDogValue((prev) => retextOdds(prev, format, next));
    setFormat(next);
  }

  let fav: Odds | null = null;
  let dog: Odds | null = null;
  let winProbability: number | null = null;
  let spread: number | null = null;

  if (mode === "spread") {
    const points = Number(pointsValue);
    if (pointsValue.trim() !== "" && Number.isFinite(points) && points >= 0.05 && points <= 40) {
      const r = spreadToMoneyline(points, sport);
      fav = r.favorite;
      dog = r.underdog;
      winProbability = r.winProbability * 100;
    }
  } else {
    const f = tryParseOdds(favValue, format);
    const d = tryParseOdds(dogValue, format);
    if (f && d) {
      const fair = noVig2Way(f, d);
      const pFav = Math.max(fair.fairProbabilities[0], fair.fairProbabilities[1]) / 100;
      if (pFav > 0.5 && pFav < 0.9999) {
        winProbability = pFav * 100;
        spread = winProbabilityToSpread(pFav, sport);
      }
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-3">
        <Segmented
          label="Direction"
          value={mode}
          onChange={setMode}
          options={[
            { value: "spread", label: "Spread → moneyline" },
            { value: "moneyline", label: "Moneyline → spread" },
          ]}
        />
        <Segmented
          label="Sport"
          value={sport}
          onChange={setSport}
          options={[
            { value: "nfl", label: "NFL" },
            { value: "nba", label: "NBA" },
          ]}
        />
      </div>
      {mode === "spread" ? (
        <StatField label="Favorite's spread (points, e.g. 7 for -7)" value={pointsValue} onChange={setPointsValue} />
      ) : (
        <>
          <OddsFormatToggle value={format} onChange={handleFormatChange} />
          <div className="grid gap-4 sm:grid-cols-2">
            <OddsInput label="Favorite moneyline" format={format} value={favValue} onChange={setFavValue} />
            <OddsInput label="Underdog moneyline" format={format} value={dogValue} onChange={setDogValue} />
          </div>
        </>
      )}
      <ResultCard
        primary={
          mode === "spread"
            ? { label: "Estimated fair favorite moneyline", value: fav ? formatAmerican(fav.american) : "—" }
            : { label: "Estimated spread", value: spread !== null ? `-${(Math.round(spread * 2) / 2).toFixed(1)}` : "—" }
        }
        rows={
          mode === "spread"
            ? [
                { label: "Estimated fair underdog moneyline", value: dog ? formatAmerican(dog.american) : "—" },
                { label: "Favorite win probability", value: winProbability !== null ? formatImplied(winProbability) : "—", emphasis: true },
              ]
            : [{ label: "Favorite win probability (no-vig)", value: winProbability !== null ? formatImplied(winProbability) : "—", emphasis: true }]
        }
        note="A statistical estimate, not a market price. It treats the final margin as a bell curve, so it runs a few points light on the NFL's key numbers (3 and 7)."
      />
      <ShareButton params={{ mode, sport, pts: pointsValue, fav: favValue, dog: dogValue, fmt: format }} />
    </div>
  );
}
