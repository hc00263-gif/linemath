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
    <section aria-label="Sportsbook offers" className="rounded-xl border border-black/10 p-4 dark:border-white/15">
      <p className="mb-3 text-[11px] font-medium uppercase tracking-wide text-black/40 dark:text-white/40">
        Advertising Disclosure — LineMath may earn a commission from offers below
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {offers.map((offer) => (
          <a
            key={offer.id}
            href={offer.ctaUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="flex flex-col gap-1 rounded-lg border border-black/10 p-3 transition-colors hover:border-black/30 dark:border-white/15 dark:hover:border-white/40"
          >
            <span className="text-sm font-semibold">{offer.sportsbook}</span>
            <span className="text-sm text-black/70 dark:text-white/70">{offer.headline}</span>
            <span className="mt-2 text-xs font-medium text-blue-600 dark:text-blue-400">
              {offer.ctaLabel} →
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
