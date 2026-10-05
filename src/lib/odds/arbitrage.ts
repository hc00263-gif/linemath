import { Odds } from "./convert";

export interface ArbResult {
  /** True when the combined implied probability is under 100% — a real arbitrage. */
  hasArb: boolean;
  /** Σ (1 / decimal_i) as a percentage. Under 100% means an arb exists. */
  arbPercent: number;
  /** Stake to place on each outcome, in the order the odds were passed. Sums to totalStake. */
  stakes: number[];
  /** Total returned whichever outcome wins. */
  payout: number;
  /** payout - totalStake. Negative when no arbitrage exists (a guaranteed loss). */
  profit: number;
  /** profit as a percentage of totalStake. */
  profitPercent: number;
}

/**
 * Split a total stake across 2 or 3 mutually exclusive outcomes so the payout is identical
 * whichever one wins.
 *
 * inv_i  = 1 / decimal_i
 * arb%   = Σ inv_i
 * stake_i = totalStake * inv_i / Σ inv
 * payout = totalStake / Σ inv         (same for every outcome)
 * profit = payout - totalStake
 *
 * An arbitrage exists only when Σ inv < 1. Otherwise the same split locks in a guaranteed
 * LOSS, which is returned (negative profit) rather than hidden.
 */
export function arbStakes(totalStake: number, oddsA: Odds, oddsB: Odds, oddsC?: Odds): ArbResult {
  if (!Number.isFinite(totalStake) || totalStake <= 0) {
    throw new Error(`Invalid total stake: ${totalStake}. Must be a positive number.`);
  }
  const legs = oddsC ? [oddsA, oddsB, oddsC] : [oddsA, oddsB];
  const inverses = legs.map((o) => 1 / o.decimal);
  const sum = inverses.reduce((a, b) => a + b, 0);
  const payout = totalStake / sum;
  return {
    hasArb: sum < 1,
    arbPercent: sum * 100,
    stakes: inverses.map((inv) => (totalStake * inv) / sum),
    payout,
    profit: payout - totalStake,
    profitPercent: (payout / totalStake - 1) * 100,
  };
}
