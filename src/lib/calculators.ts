export interface CalculatorMeta {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
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
];

export function getCalculator(slug: string): CalculatorMeta | undefined {
  return CALCULATORS.find((calc) => calc.slug === slug);
}
