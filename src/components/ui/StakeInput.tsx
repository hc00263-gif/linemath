"use client";

import { useId } from "react";

export interface StakeInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  id?: string;
}

export function StakeInput({ label = "Stake", value, onChange, id }: StakeInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-medium text-ink-dim">
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-mono text-ink-dim">
          $
        </span>
        <input
          id={inputId}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="100"
          className="w-full rounded-lg border border-line bg-surface py-2 pl-6 pr-3 font-mono text-base tabular-nums text-ink outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
        />
      </div>
    </div>
  );
}
