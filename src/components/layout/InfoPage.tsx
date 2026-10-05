import { ReactNode } from "react";

/** Plain long-form page layout for About / policy / guide content. */
export function InfoPage({ title, intro, children }: { title: string; intro?: string; children: ReactNode }) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 px-4 py-10 text-[15px] leading-relaxed text-ink-dim">
      <h1 className="font-display text-3xl leading-tight font-bold tracking-tight text-ink uppercase sm:text-4xl">{title}</h1>
      {intro && <p className="text-base text-ink">{intro}</p>}
      {children}
    </div>
  );
}
