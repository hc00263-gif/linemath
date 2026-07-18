"use client";

import { useId } from "react";
import { InvalidOddsError, Odds, OddsFormat, parseOdds } from "@/lib/odds/convert";
import { formatAmerican, formatDecimal, formatFractional, formatImplied } from "@/lib/odds/format";

export interface OddsInputProps {
  label: string;
  format: OddsFormat;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
}

const FORMAT_PLACEHOLDER: Record<OddsFormat, string> = {
  american: "-110",
  decimal: "1.91",
  fractional: "10/11",
  implied: "52.4",
};

/**
 * A single odds field for the currently selected notation. Tolerantly parses whatever
 * is typed ("+150", "150", "2.50", "3/2", ...) via parseOdds and shows the equivalent
 * value in the other notations inline, live, with no submit step. Never renders NaN —
 * an unparsable value shows an inline error instead.
 */
export function OddsInput({ label, format, value, onChange, placeholder, id }: OddsInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  let odds: Odds | null = null;
  let error: string | null = null;
  if (value.trim() !== "") {
    try {
      odds = parseOdds(value, format);
    } catch (err) {
      error = err instanceof InvalidOddsError ? err.message : "Enter valid odds.";
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-medium text-black/70 dark:text-white/70">
        {label}
      </label>
      <input
        id={inputId}
        type="text"
        inputMode="decimal"
        autoComplete="off"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder ?? FORMAT_PLACEHOLDER[format]}
        aria-invalid={error ? "true" : undefined}
        className={`rounded-lg border bg-transparent px-3 py-2 text-base tabular-nums outline-none transition-colors focus:ring-2 ${
          error
            ? "border-red-500 focus:ring-red-500/30"
            : "border-black/15 focus:border-black/40 focus:ring-black/10 dark:border-white/20 dark:focus:border-white/50 dark:focus:ring-white/10"
        }`}
      />
      <div className="min-h-[1.1rem] text-xs text-black/50 dark:text-white/50">
        {error ? (
          <span className="text-red-500">{error}</span>
        ) : (
          odds && (
            <span>
              {format !== "american" && `${formatAmerican(odds.american)} american · `}
              {format !== "decimal" && `${formatDecimal(odds.decimal)} decimal · `}
              {format !== "fractional" && `${formatFractional(odds.fractional)} frac · `}
              {formatImplied(odds.implied)} implied
            </span>
          )
        )}
      </div>
    </div>
  );
}
