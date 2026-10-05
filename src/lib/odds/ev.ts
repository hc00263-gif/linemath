import { Odds } from "./convert";

export interface EvResult {
  /** Expected profit per bet in dollars (negative = losing bet on average). */
  evDollars: number;
  /** Expected profit as a percentage of stake. */
  evPercent: number;
  /** Profit if the bet wins (stake not included). */
  profitIfWin: number;
  /** Win probability needed to break even at these odds, as a percentage. */
  breakEvenPercent: number;
  /** Your estimated win probability minus the break-even probability, in percentage points. */
  edgePoints: number;
}

function assertProbability(winProbability: number): void {
  if (!Number.isFinite(winProbability) || winProbability <= 0 || winProbability >= 1) {
    throw new Error(`Invalid win probability: ${winProbability}. Must be between 0 and 1 (exclusive).`);
  }
}

/**
 * Expected value of a bet.
 *
 * profitIfWin = stake * (decimal - 1)
 * EV = p * profitIfWin - (1 - p) * stake
 * EV% = EV / stake
 *
 * `winProbability` is a 0-1 fraction (0.5 = 50%).
 */
export function evCalc(stake: number, odds: Odds, winProbability: number): EvResult {
  if (!Number.isFinite(stake) || stake <= 0) {
    throw new Error(`Invalid stake: ${stake}. Must be a positive number.`);
  }
  assertProbability(winProbability);
  const profitIfWin = stake * (odds.decimal - 1);
  const evDollars = winProbability * profitIfWin - (1 - winProbability) * stake;
  const breakEven = 1 / odds.decimal;
  return {
    evDollars,
    evPercent: (evDollars / stake) * 100,
    profitIfWin,
    breakEvenPercent: breakEven * 100,
    edgePoints: (winProbability - breakEven) * 100,
  };
}
