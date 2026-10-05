export interface GuideMeta {
  slug: string;
  title: string;
  description: string;
  /** Calculators this guide links into. */
  calculators: string[];
}

export const GUIDES: GuideMeta[] = [
  {
    slug: "how-to-read-american-odds",
    title: "How to Read American Odds",
    description: "What +150 and -110 actually mean, how to convert them to decimal odds and win probability, and the formulas behind it.",
    calculators: ["odds-converter", "betting-odds-calculator"],
  },
  {
    slug: "what-is-vig",
    title: "What Is Vig (Juice) in Sports Betting?",
    description: "How sportsbooks build a margin into every line, how to measure it, and how to strip it out to find fair odds.",
    calculators: ["vig-calculator", "no-vig-calculator"],
  },
  {
    slug: "how-parlays-are-priced",
    title: "How Parlays Are Priced",
    description: "Why parlay odds multiply, what a push does to a parlay, and why the sportsbook's margin compounds on every leg.",
    calculators: ["parlay-calculator", "ev-calculator"],
  },
];

export function getGuide(slug: string): GuideMeta | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
