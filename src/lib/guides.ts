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
  {
    slug: "what-is-closing-line-value",
    title: "What Is Closing Line Value (CLV)?",
    description: "Why beating the closing line is the best short-term signal that you are a winning bettor, and how to calculate it.",
    calculators: ["clv-calculator", "bet-tracker"],
  },
  {
    slug: "what-is-expected-value",
    title: "What Is Expected Value (EV) in Sports Betting?",
    description: "How to turn a win probability and odds into the average profit of a bet, and why +EV is the only thing that matters long term.",
    calculators: ["ev-calculator", "no-vig-calculator"],
  },
  {
    slug: "kelly-criterion-explained",
    title: "The Kelly Criterion Explained for Bettors",
    description: "How much of your bankroll to stake on a +EV bet, why most bettors use half or quarter Kelly, and the formula behind it.",
    calculators: ["kelly-calculator", "ev-calculator"],
  },
  {
    slug: "how-to-read-point-spreads",
    title: "How to Read Point Spreads (and Convert Them to Moneylines)",
    description: "What -3.5 and +3.5 mean, how pushes work on whole-number spreads, and how a spread maps to an approximate moneyline.",
    calculators: ["spread-to-moneyline-calculator", "implied-probability-calculator"],
  },
];

export function getGuide(slug: string): GuideMeta | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
