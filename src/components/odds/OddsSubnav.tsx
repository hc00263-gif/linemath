import Link from "next/link";

const LINKS = [
  { href: "/best-odds", label: "Best odds" },
  { href: "/best-odds/arbs", label: "Arbitrage" },
  { href: "/best-odds/outliers", label: "Outliers" },
];

export function OddsSubnav({ current }: { current: string }) {
  return (
    <nav aria-label="Odds tools" className="flex flex-wrap gap-2">
      {LINKS.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          aria-current={current === l.href ? "page" : undefined}
          className={`inline-flex min-h-9 items-center rounded-md border px-3 text-sm font-medium transition-colors ${
            current === l.href ? "border-accent/60 bg-fill text-ink" : "border-line text-ink-dim hover:text-ink"
          }`}
        >
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
