import { Odds } from "./convert";

export interface KellyResult {
  /** Recommended fraction of bankroll to stake, 0-1. Never negative. */
  fraction: number;
  /** Full-Kelly fraction before the multiplier is applied. */
  fullKelly: number;
  /** True when the bet has positive expected value at the given probability. */
  hasEdge: boolean;
}

export type KellyMultiplier = 1 | 0.5 | 0.25;

/**
 * Kelly criterion stake size.
 *
 * b = decimal - 1                      (net odds received per $1 staked)
 * f* = (b * p - (1 - p)) / b           (full Kelly, as a fraction of bankroll)
 * stake fraction = max(0, f*) * multiplier
 *
 * Negative edge clamps to 0 — the calculator never recommends a bet with negative EV.
 * Half and quarter Kelly (multiplier 0.5 / 0.25) trade growth for lower variance and for
 * robustness to errors in your own probability estimate.
 */
export function kellyFraction(
  odds: Odds,
  winProbability: number,
  kellyMultiplier: KellyMultiplier = 1
): KellyResult {
  if (!Number.isFinite(winProbability) || winProbability <= 0 || winProbability >= 1) {
    throw new Error(`Invalid win probability: ${winProbability}. Must be between 0 and 1 (exclusive).`);
  }
  const b = odds.decimal - 1;
  const fullKelly = (b * winProbability - (1 - winProbability)) / b;
  const hasEdge = fullKelly > 0;
  return {
    fraction: hasEdge ? fullKelly * kellyMultiplier : 0,
    fullKelly: Math.max(0, fullKelly),
    hasEdge,
  };
}
