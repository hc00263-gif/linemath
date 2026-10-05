import Link from "next/link";
import { CALCULATORS } from "@/lib/calculators";
import { SPORTS_TOOLS } from "@/lib/sportsTools";

/** Pure-CSS dropdown: opens on hover and on keyboard/touch focus, so it needs no client JS. */
function NavGroup({ label, items }: { label: string; items: { slug: string; shortTitle: string }[] }) {
  return (
    <div className="group relative">
      <button
        type="button"
        aria-haspopup="true"
        className="rounded-md px-2.5 py-1.5 text-ink-dim transition-colors group-hover:bg-fill group-hover:text-ink group-focus-within:bg-fill group-focus-within:text-ink"
      >
        {label} <span aria-hidden="true">▾</span>
      </button>
      <div className="invisible absolute top-full left-0 z-30 pt-1 opacity-0 transition-opacity group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
        <ul className="grid min-w-56 gap-0.5 rounded-xl border border-line bg-surface p-2 shadow-lg">
          {items.map((item) => (
            <li key={item.slug}>
              <Link href={`/${item.slug}`} className="block rounded-md px-3 py-2 text-sm text-ink-dim transition-colors hover:bg-fill hover:text-ink">
                {item.shortTitle}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-ground/90 backdrop-blur">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="font-display text-2xl font-extrabold tracking-tight uppercase">
          Line<span className="text-accent">Math</span>
        </Link>
        <nav aria-label="Site" className="flex flex-wrap items-center gap-x-1 text-sm">
          <NavGroup label="Calculators" items={CALCULATORS} />
          <NavGroup label="Sports" items={SPORTS_TOOLS} />
          <Link href="/guides" className="rounded-md px-2.5 py-1.5 text-ink-dim transition-colors hover:bg-fill hover:text-ink">
            Guides
          </Link>
        </nav>
      </div>
    </header>
  );
}
