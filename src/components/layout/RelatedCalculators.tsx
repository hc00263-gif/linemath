import Link from "next/link";
import { CALCULATORS } from "@/lib/calculators";

export function RelatedCalculators({ exclude, max = 4 }: { exclude: string; max?: number }) {
  const others = CALCULATORS.filter((calc) => calc.slug !== exclude).slice(0, max);

  return (
    <nav aria-label="Related calculators" className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold text-ink-dim">More calculators</h2>
      <ul className="flex flex-wrap gap-2">
        {others.map((calc) => (
          <li key={calc.slug}>
            <Link
              href={`/${calc.slug}`}
              className="rounded-full border border-line px-3 py-1.5 text-sm transition-colors hover:border-accent/50"
            >
              {calc.shortTitle}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
