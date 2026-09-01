import Link from "next/link";
import { CALCULATORS } from "@/lib/calculators";
import { SPORTS_TOOLS } from "@/lib/sportsTools";

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-ground/90 backdrop-blur">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-4 py-4">
        <Link href="/" className="font-display text-2xl font-extrabold tracking-tight uppercase">
          Line<span className="text-accent">Math</span>
        </Link>
        <nav aria-label="Site" className="flex flex-wrap items-center gap-x-1 gap-y-1 text-sm">
          {CALCULATORS.map((calc) => (
            <Link
              key={calc.slug}
              href={`/${calc.slug}`}
              className="rounded-md px-2.5 py-1.5 text-ink-dim transition-colors hover:bg-fill hover:text-ink"
            >
              {calc.shortTitle}
            </Link>
          ))}
          <span aria-hidden="true" className="mx-1.5 h-4 w-px bg-line" />
          {SPORTS_TOOLS.map((tool) => (
            <Link
              key={tool.slug}
              href={`/${tool.slug}`}
              className="rounded-md px-2.5 py-1.5 text-ink-dim transition-colors hover:bg-fill hover:text-ink"
            >
              {tool.shortTitle}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
