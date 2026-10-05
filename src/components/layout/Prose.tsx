import { ReactNode } from "react";

/** Small typographic building blocks for calculator explainers and guides. */
export function H2({ children }: { children: ReactNode }) {
  return <h2 className="mt-4 font-display text-xl font-bold tracking-tight text-ink uppercase">{children}</h2>;
}

export function P({ children }: { children: ReactNode }) {
  return <p>{children}</p>;
}

/** A formula or worked-example line in monospace. */
export function Formula({ children }: { children: ReactNode }) {
  return (
    <pre className="overflow-x-auto rounded-lg border border-line bg-surface px-4 py-3 font-mono text-[13px] leading-relaxed whitespace-pre-wrap text-ink">
      {children}
    </pre>
  );
}

export function UL({ children }: { children: ReactNode }) {
  return <ul className="list-disc space-y-1.5 pl-5">{children}</ul>;
}
