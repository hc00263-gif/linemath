import Link from "next/link";
import { CALCULATORS } from "@/lib/calculators";

export function Header() {
  return (
    <header className="border-b border-black/10 dark:border-white/15">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-4 py-4">
        <Link href="/" className="text-lg font-bold tracking-tight">
          LineMath
        </Link>
        <nav aria-label="Calculators" className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
          {CALCULATORS.map((calc) => (
            <Link
              key={calc.slug}
              href={`/${calc.slug}`}
              className="text-black/60 transition-colors hover:text-black dark:text-white/60 dark:hover:text-white"
            >
              {calc.shortTitle}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
