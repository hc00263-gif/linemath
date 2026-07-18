"use client";

import { OddsFormat } from "@/lib/odds/convert";

const OPTIONS: { value: OddsFormat; label: string }[] = [
  { value: "american", label: "American" },
  { value: "decimal", label: "Decimal" },
  { value: "fractional", label: "Fractional" },
];

export interface OddsFormatToggleProps {
  value: OddsFormat;
  onChange: (format: OddsFormat) => void;
  className?: string;
}

export function OddsFormatToggle({ value, onChange, className }: OddsFormatToggleProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Odds format"
      className={`inline-flex rounded-lg border border-black/10 bg-black/[.03] p-1 dark:border-white/15 dark:bg-white/[.06] ${className ?? ""}`}
    >
      {OPTIONS.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.value)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              selected
                ? "bg-white text-black shadow-sm dark:bg-white dark:text-black"
                : "text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
