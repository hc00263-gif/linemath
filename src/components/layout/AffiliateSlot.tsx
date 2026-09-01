import { getOffers } from "@/lib/affiliates";

export interface AffiliateSlotProps {
  category: string;
  max?: number;
}

/**
 * Contextual sportsbook offers, sourced from a config file so offers can be swapped
 * without a code change. FTC requires the disclosure label whenever we earn a commission
 * on the linked offers.
 */
export function AffiliateSlot({ category, max = 2 }: AffiliateSlotProps) {
  const offers = getOffers(category, max);
  if (offers.length === 0) return null;

  return (
    <section aria-label="Sportsbook offers" className="rounded-xl border border-line p-4">
      <p className="mb-3 font-mono text-[11px] font-medium tracking-wide text-ink-dim uppercase">
        Advertising Disclosure — LineMath may earn a commission from offers below
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {offers.map((offer) => (
          <a
            key={offer.id}
            href={offer.ctaUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="flex flex-col gap-1 rounded-lg border border-line p-3 transition-colors hover:border-accent/50"
          >
            <span className="text-sm font-semibold">{offer.sportsbook}</span>
            <span className="text-sm text-ink-dim">{offer.headline}</span>
            <span className="mt-2 text-xs font-medium text-accent">{offer.ctaLabel} →</span>
          </a>
        ))}
      </div>
    </section>
  );
}
