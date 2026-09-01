"use client";

import { useId } from "react";

export interface StatFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  id?: string;
}

/** A single compact numeric stat input, used for fantasy box-score entry. */
export function StatField({ label, value, onChange, id }: StatFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={inputId} className="text-xs font-medium text-ink-dim">
        {label}
      </label>
      <input
        id={inputId}
        type="text"
        inputMode="decimal"
        autoComplete="off"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="0"
        className="rounded-lg border border-line bg-surface px-3 py-2 font-mono text-sm tabular-nums text-ink outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
      />
    </div>
  );
}
