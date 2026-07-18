import { Odds } from "./convert";

export interface HedgeResult {
  hedgeStake: number;
  guaranteedProfit: number;
  profitIfOriginalWins: number;
  profitIfHedgeWins: number;
}

/**
 * Stake to place on the opposing side so that profit is identical no matter which side
 * wins.
 *
 * totalPayout   = originalStake * originalOdds.decimal   (what the original bet returns if it wins)
 * hedgeStake    = totalPayout / hedgeOdds.decimal         (sized so the hedge returns the same totalPayout)
 * guaranteedProfit = totalPayout - originalStake - hedgeStake
 */
export function hedgeStake(originalStake: number, originalOdds: Odds, hedgeOdds: Odds): HedgeResult {
  if (!Number.isFinite(originalStake) || originalStake <= 0) {
    throw new Error(`Invalid stake: ${originalStake}. Must be a positive number.`);
  }
  const totalPayout = originalStake * originalOdds.decimal;
  const hedge = totalPayout / hedgeOdds.decimal;
  const profitIfOriginalWins = totalPayout - originalStake - hedge;
  const profitIfHedgeWins = hedge * hedgeOdds.decimal - originalStake - hedge;
  return {
    hedgeStake: hedge,
    guaranteedProfit: profitIfOriginalWins,
    profitIfOriginalWins,
    profitIfHedgeWins,
  };
}
