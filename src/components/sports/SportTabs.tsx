"use client";

export interface SportTabOption<T extends string> {
  value: T;
  label: string;
}

export interface SportTabsProps<T extends string> {
  options: SportTabOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function SportTabs<T extends string>({ options, value, onChange, className }: SportTabsProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label="Sport"
      className={`inline-flex flex-wrap rounded-lg border border-line bg-fill p-1 ${className ?? ""}`}
    >
      {options.map((option) => {
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
