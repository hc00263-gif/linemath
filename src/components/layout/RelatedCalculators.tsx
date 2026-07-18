import Link from "next/link";
import { CALCULATORS } from "@/lib/calculators";

export function RelatedCalculators({ exclude, max = 4 }: { exclude: string; max?: number }) {
  const others = CALCULATORS.filter((calc) => calc.slug !== exclude).slice(0, max);

  return (
    <nav aria-label="Related calculators" className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold text-black/60 dark:text-white/60">More calculators</h2>
      <ul className="flex flex-wrap gap-2">
        {others.map((calc) => (
          <li key={calc.slug}>
            <Link
              href={`/${calc.slug}`}
              className="rounded-full border border-black/10 px-3 py-1.5 text-sm transition-colors hover:border-black/30 dark:border-white/15 dark:hover:border-white/40"
            >
              {calc.shortTitle}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
