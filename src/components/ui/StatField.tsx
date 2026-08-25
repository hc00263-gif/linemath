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
      <label htmlFor={inputId} className="text-xs font-medium text-black/60 dark:text-white/60">
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
        className="rounded-lg border border-black/15 bg-transparent px-3 py-2 text-sm tabular-nums outline-none transition-colors focus:border-black/40 focus:ring-2 focus:ring-black/10 dark:border-white/20 dark:focus:border-white/50 dark:focus:ring-white/10"
      />
    </div>
  );
}
