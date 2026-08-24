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
      className={`inline-flex flex-wrap rounded-lg border border-black/10 bg-black/[.03] p-1 dark:border-white/15 dark:bg-white/[.06] ${className ?? ""}`}
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
