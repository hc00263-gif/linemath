import { Odds } from "./convert";

export interface BonusBetResult {
  hedgeStake: number;
  guaranteedCash: number;
  /** Percentage of the bonus amount recovered as guaranteed cash, 0-100. */
  conversionRate: number;
}

/**
 * Converts a bonus/free bet into guaranteed cash by hedging it on the opposing side.
 *
 * Bonus bets do NOT return the stake if they win — only the winnings do. This is the
 * single most common math error on competitor calculators, which often reuse a normal
 * hedge formula (stake returned) and overstate the conversion rate. The math here
 * accounts for that explicitly:
 *
 * winningsIfBonusWins = bonusAmount * (bonusOdds.decimal - 1)   (stake is NOT added back)
 * hedgeStake          = winningsIfBonusWins / hedgeOdds.decimal
 * guaranteedCash      = hedgeStake * (hedgeOdds.decimal - 1)
 * conversionRate      = guaranteedCash / bonusAmount * 100
 */
export function bonusBetConversion(
  bonusAmount: number,
  bonusOdds: Odds,
  hedgeOdds: Odds
): BonusBetResult {
  if (!Number.isFinite(bonusAmount) || bonusAmount <= 0) {
    throw new Error(`Invalid bonus amount: ${bonusAmount}. Must be a positive number.`);
  }
  const winningsIfBonusWins = bonusAmount * (bonusOdds.decimal - 1);
  const hedge = winningsIfBonusWins / hedgeOdds.decimal;
  const guaranteedCash = hedge * (hedgeOdds.decimal - 1);
  return {
    hedgeStake: hedge,
    guaranteedCash,
    conversionRate: (guaranteedCash / bonusAmount) * 100,
  };
}
