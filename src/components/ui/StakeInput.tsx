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
      <label htmlFor={inputId} className="text-sm font-medium text-black/70 dark:text-white/70">
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-black/40 dark:text-white/40">
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
          className="w-full rounded-lg border border-black/15 bg-transparent py-2 pl-6 pr-3 text-base tabular-nums outline-none transition-colors focus:border-black/40 focus:ring-2 focus:ring-black/10 dark:border-white/20 dark:focus:border-white/50 dark:focus:ring-white/10"
        />
      </div>
    </div>
  );
}
