import Link from "next/link";
import { CALCULATORS } from "@/lib/calculators";
import { SPORTS_TOOLS } from "@/lib/sportsTools";

export function Header() {
  return (
    <header className="border-b border-black/10 dark:border-white/15">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-4 py-4">
        <Link href="/" className="text-lg font-bold tracking-tight">
          LineMath
        </Link>
        <nav aria-label="Site" className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          {CALCULATORS.map((calc) => (
            <Link
              key={calc.slug}
              href={`/${calc.slug}`}
              className="text-black/60 transition-colors hover:text-black dark:text-white/60 dark:hover:text-white"
            >
              {calc.shortTitle}
            </Link>
          ))}
          <span aria-hidden="true" className="h-4 w-px bg-black/10 dark:bg-white/15" />
          {SPORTS_TOOLS.map((tool) => (
            <Link
              key={tool.slug}
              href={`/${tool.slug}`}
              className="text-black/60 transition-colors hover:text-black dark:text-white/60 dark:hover:text-white"
            >
              {tool.shortTitle}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
