import { Odds } from "./convert";

export interface VigResult {
  /** Sum of every outcome's implied probability, as a percentage (100% = no margin). */
  totalImplied: number;
  /** Overround: how far the implied probabilities exceed 100%. totalImplied - 100. */
  overround: number;
  /** Hold: the book's margin as a share of total handle. 1 - 1/(sum of implied) = overround / totalImplied. */
  hold: number;
}

/**
 * Book margin (vig / juice / hold) for a market with any number of outcomes.
 *
 * sum  = Σ (1 / decimal_i)
 * overround = (sum - 1) * 100
 * hold      = (1 - 1 / sum) * 100
 *
 * Example: -110 / -110 -> sum 1.0476, overround 4.76%, hold 4.55%.
 */
export function holdPercent(odds: Odds[]): VigResult {
  if (odds.length < 2) {
    throw new Error(`A market needs at least 2 outcomes, got ${odds.length}.`);
  }
  const sum = odds.reduce((total, o) => total + 1 / o.decimal, 0);
  return {
    totalImplied: sum * 100,
    overround: (sum - 1) * 100,
    hold: (1 - 1 / sum) * 100,
  };
}
