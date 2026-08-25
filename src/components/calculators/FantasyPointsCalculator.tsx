"use client";

import { useMemo, useState } from "react";
import {
  EMPTY_STAT_LINE,
  STAT_LINE_FIELDS,
  SCORING_PRESETS,
  StatLine,
  calculateFantasyPoints,
} from "@/lib/fantasy/points";
import { StatField } from "@/components/ui/StatField";
import { ResultCard } from "@/components/ui/ResultCard";

type Preset = keyof typeof SCORING_PRESETS;

const FIELD_LABELS: Record<keyof StatLine, string> = {
  passYards: "Pass Yds",
  passTouchdowns: "Pass TD",
  interceptions: "INT",
  rushYards: "Rush Yds",
  rushTouchdowns: "Rush TD",
  receptions: "Receptions",
  receivingYards: "Rec Yds",
  receivingTouchdowns: "Rec TD",
  fumblesLost: "Fumbles Lost",
  twoPointConversions: "2PT Conv",
};

const PRESET_OPTIONS: { value: Preset; label: string }[] = [
  { value: "standard", label: "Standard" },
  { value: "half-ppr", label: "Half-PPR" },
  { value: "ppr", label: "PPR" },
];

function toNonNegativeNumber(value: string): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

export function FantasyPointsCalculator() {
  const [preset, setPreset] = useState<Preset>("ppr");
  const [values, setValues] = useState<Record<keyof StatLine, string>>(
    () => Object.fromEntries(STAT_LINE_FIELDS.map((field) => [field, ""])) as Record<keyof StatLine, string>
  );

  const stats: StatLine = useMemo(() => {
    const result = { ...EMPTY_STAT_LINE };
    for (const field of STAT_LINE_FIELDS) {
      result[field] = toNonNegativeNumber(values[field]);
    }
    return result;
  }, [values]);

  const points = calculateFantasyPoints(stats, SCORING_PRESETS[preset]);

  function updateField(field: keyof StatLine, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="inline-flex flex-wrap rounded-lg border border-black/10 bg-black/[.03] p-1 dark:border-white/15 dark:bg-white/[.06]">
        {PRESET_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setPreset(option.value)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              preset === option.value
                ? "bg-white text-black shadow-sm dark:bg-white dark:text-black"
                : "text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {STAT_LINE_FIELDS.map((field) => (
          <StatField
            key={field}
            label={FIELD_LABELS[field]}
            value={values[field]}
            onChange={(value) => updateField(field, value)}
          />
        ))}
      </div>

      <ResultCard primary={{ label: "Fantasy Points", value: points.toFixed(2) }} />
    </div>
  );
}
