import offersJson from "@/content/affiliate-offers.json";

export interface AffiliateOffer {
  id: string;
  sportsbook: string;
  headline: string;
  blurb: string;
  ctaLabel: string;
  ctaUrl: string;
  categories: string[];
}

const OFFERS = offersJson as AffiliateOffer[];

/** Offers relevant to a calculator category, falling back to "general" offers if none match. */
export function getOffers(category: string, max = 2): AffiliateOffer[] {
  const matched = OFFERS.filter((offer) => offer.categories.includes(category));
  const pool = matched.length > 0 ? matched : OFFERS.filter((offer) => offer.categories.includes("general"));
  return pool.slice(0, max);
}
