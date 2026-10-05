import { Odds } from "./convert";

export interface TeaserResult {
  payout: number;
  profit: number;
  /** Win probability every leg needs (assuming equal legs) for the teaser to break even, as a percentage. */
  breakEvenPerLeg: number;
  /** Probability all legs win needed to break even, as a percentage. */
  breakEvenAllLegs: number;
}

/**
 * Teaser payout and break-even.
 *
 * payout            = stake × decimal(teaser odds)
 * break-even (all)  = 1 / decimal
 * break-even per leg = (1 / decimal) ^ (1 / legs)      (equal-probability legs)
 */
export function teaserOdds(stake: number, teaser: Odds, legCount: number): TeaserResult {
  if (!Number.isFinite(stake) || stake <= 0) throw new Error(`Invalid stake: ${stake}. Must be a positive number.`);
  if (!Number.isInteger(legCount) || legCount < 2 || legCount > 12) {
    throw new Error(`A teaser needs between 2 and 12 legs, got ${legCount}.`);
  }
  const breakEvenAll = 1 / teaser.decimal;
  const payout = stake * teaser.decimal;
  return {
    payout,
    profit: payout - stake,
    breakEvenPerLeg: Math.pow(breakEvenAll, 1 / legCount) * 100,
    breakEvenAllLegs: breakEvenAll * 100,
  };
}
