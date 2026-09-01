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
      className={`inline-flex rounded-lg border border-line bg-fill p-1 ${className ?? ""}`}
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
              selected ? "bg-surface-raised text-ink shadow-sm" : "text-ink-dim hover:text-ink"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
