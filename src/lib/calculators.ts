export interface CalculatorMeta {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  /** Slugs of the calculators most relevant to this one, for internal linking. */
  related?: string[];
}

/** Single source of truth for every calculator's route, nav label, and card copy. */
export const CALCULATORS: CalculatorMeta[] = [
  {
    slug: "odds-converter",
    title: "Odds Converter — American, Decimal & Fractional",
    shortTitle: "Odds Converter",
    description: "Convert American, decimal, fractional, and implied probability instantly.",
  },
  {
    slug: "betting-odds-calculator",
    title: "Betting Odds Calculator — Payout & Profit",
    shortTitle: "Betting Odds Calculator",
    description: "Enter a stake and odds to see payout, profit, and implied win probability.",
  },
  {
    slug: "parlay-calculator",
    title: "Parlay Calculator — Free Parlay Odds & Payout Calculator",
    shortTitle: "Parlay Calculator",
    description: "Combine up to 12 legs and see true parlay odds and payout, pushes included.",
  },
  {
    slug: "hedge-calculator",
    title: "Hedge Calculator — Lock In Guaranteed Profit",
    shortTitle: "Hedge Calculator",
    description: "Find the exact hedge stake for an equal guaranteed profit on both outcomes.",
  },
  {
    slug: "bonus-bet-calculator",
    title: "Bonus Bet Calculator — Free Bet Conversion Calculator",
    shortTitle: "Bonus Bet Calculator",
    description: "Convert a bonus or free bet into guaranteed cash — stake isn't returned.",
  },
  {
    slug: "fantasy-points-calculator",
    title: "Fantasy Football Points Calculator — Standard, Half-PPR & PPR",
    shortTitle: "Fantasy Points Calculator",
    description: "Enter a stat line and see fantasy points across Standard, Half-PPR, and PPR scoring.",
  },
  {
    slug: "draft-pick-calculator",
    title: "Fantasy Draft Pick Calculator — Snake Draft Order",
    shortTitle: "Draft Pick Calculator",
    description: "See exactly which overall picks you get in a snake draft, with optional 3RR.",
  },
  {
    slug: "no-vig-calculator",
    title: "No-Vig Calculator — Fair Odds & Devig Calculator",
    shortTitle: "No-Vig Calculator",
    description: "Strip the sportsbook's margin out of any line to see true fair odds and win probabilities.",
    related: ["vig-calculator", "ev-calculator", "kelly-calculator", "odds-converter"],
  },
  {
    slug: "vig-calculator",
    title: "Vig Calculator — Sportsbook Hold & Juice",
    shortTitle: "Vig Calculator",
    description: "See exactly how much margin a sportsbook is charging on any two- or three-way market.",
    related: ["no-vig-calculator", "arbitrage-calculator", "odds-converter", "ev-calculator"],
  },
  {
    slug: "ev-calculator",
    title: "EV Calculator — Sports Betting Expected Value",
    shortTitle: "EV Calculator",
    description: "Find the expected value of a bet from your own win probability — in dollars and as a percent.",
    related: ["kelly-calculator", "no-vig-calculator", "betting-odds-calculator", "parlay-calculator"],
  },
  {
    slug: "kelly-calculator",
    title: "Kelly Criterion Calculator — Bet Sizing",
    shortTitle: "Kelly Calculator",
    description: "Size every bet to your edge with full, half, or quarter Kelly — never a negative-EV stake.",
    related: ["ev-calculator", "no-vig-calculator", "betting-odds-calculator", "hedge-calculator"],
  },
  {
    slug: "arbitrage-calculator",
    title: "Arbitrage Calculator — Sports Betting Arb Finder",
    shortTitle: "Arbitrage Calculator",
    description: "Split a stake across books for an equal payout either way — and know instantly if no arb exists.",
    related: ["hedge-calculator", "vig-calculator", "no-vig-calculator", "bonus-bet-calculator"],
  },
];

export function getCalculator(slug: string): CalculatorMeta | undefined {
  return CALCULATORS.find((calc) => calc.slug === slug);
}
