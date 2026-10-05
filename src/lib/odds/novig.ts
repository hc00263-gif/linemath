import { Odds, oddsFromDecimal } from "./convert";
import { holdPercent } from "./vig";

export interface NoVigResult {
  /** Fair (vig-free) win probability per outcome, as percentages summing to 100. */
  fairProbabilities: number[];
  /** Fair odds per outcome, in every notation. */
  fairOdds: Odds[];
  /** Book margin removed, as a percentage of handle. */
  hold: number;
  /** Overround removed (sum of implied probabilities minus 100). */
  overround: number;
}

/**
 * Proportional ("multiplicative") de-vig: scale each implied probability so the set sums
 * to exactly 100%.
 *
 * fair_i = implied_i / Σ implied
 * fairDecimal_i = 1 / fair_i
 *
 * This is the standard first-pass method. It assumes the book spreads its margin evenly
 * in proportion to each outcome's probability — it understates the true price of
 * longshots on lopsided lines, which is why sharps sometimes prefer power/Shin methods.
 */
function devig(odds: Odds[]): NoVigResult {
  const implied = odds.map((o) => 1 / o.decimal);
  const sum = implied.reduce((a, b) => a + b, 0);
  const fair = implied.map((p) => p / sum);
  const { hold, overround } = holdPercent(odds);
  return {
    fairProbabilities: fair.map((p) => p * 100),
    fairOdds: fair.map((p) => oddsFromDecimal(1 / p)),
    hold,
    overround,
  };
}

/** Two-way market de-vig (spread, total, moneyline without a draw). */
export function noVig2Way(oddsA: Odds, oddsB: Odds): NoVigResult {
  return devig([oddsA, oddsB]);
}

/** Three-way market de-vig (soccer 1X2, regulation-time hockey, etc.). */
export function noVig3Way(oddsA: Odds, oddsB: Odds, oddsC: Odds): NoVigResult {
  return devig([oddsA, oddsB, oddsC]);
}
