import { Odds, oddsFromDecimal } from "./convert";

export type SpreadSport = "nfl" | "nba";

/** Approximate standard deviation of final scoring margin, in points. */
export const MARGIN_SIGMA: Record<SpreadSport, number> = { nfl: 13.5, nba: 12 };

/** Standard normal CDF via the Abramowitz–Stegun erf approximation (|error| < 1.5e-7). */
export function normalCdf(z: number): number {
  const x = Math.abs(z) / Math.SQRT2;
  const t = 1 / (1 + 0.3275911 * x);
  const poly = ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t;
  const erf = 1 - poly * Math.exp(-x * x);
  return z >= 0 ? 0.5 * (1 + erf) : 0.5 * (1 - erf);
}

/**
 * ESTIMATE of the favorite's win probability from the point spread, treating the final margin
 * as normally distributed around the spread.
 *
 * P(favorite wins) = Φ(points / σ)
 *
 * It ignores key numbers (3 and 7 in the NFL carry extra probability mass) and ties, so real
 * markets price those spreads somewhat higher. Treat it as a close approximation, not a price.
 */
export function spreadToWinProbability(points: number, sport: SpreadSport): number {
  if (!Number.isFinite(points) || points < 0 || points > 40) {
    throw new Error(`Invalid spread: ${points}. Enter the favorite's points as a number from 0 to 40.`);
  }
  return normalCdf(points / MARGIN_SIGMA[sport]);
}

/** Fair (no-vig) moneyline implied by a spread, as odds for the favorite and the underdog. */
export function spreadToMoneyline(points: number, sport: SpreadSport): { favorite: Odds; underdog: Odds; winProbability: number } {
  const p = spreadToWinProbability(points, sport);
  if (points < 0.05) throw new Error("A pick'em has no favorite — both sides are +100.");
  return { favorite: oddsFromDecimal(1 / p), underdog: oddsFromDecimal(1 / (1 - p)), winProbability: p };
}

/** Inverse of spreadToWinProbability: the spread whose estimated favorite win probability is `probability`. */
export function winProbabilityToSpread(probability: number, sport: SpreadSport): number {
  if (!Number.isFinite(probability) || probability <= 0.5 || probability >= 0.9999) {
    throw new Error("Enter a favorite's win probability between 50% and 99.99%.");
  }
  let lo = 0;
  let hi = 60;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (normalCdf(mid / MARGIN_SIGMA[sport]) < probability) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}
