import { Odds, oddsFromDecimal } from "./convert";

export interface BoostResult {
  baseProfit: number;
  boostedProfit: number;
  extraProfit: number;
  boostedPayout: number;
  boostedOdds: Odds;
  /** Win probability needed to break even before the boost, as a percentage. */
  breakEvenBefore: number;
  /** Win probability needed to break even after the boost, as a percentage. */
  breakEvenAfter: number;
}

/**
 * Profit boost: raises the PROFIT (not the stake) by a percentage. Your stake is returned on a win,
 * unlike a bonus bet.
 *
 * boosted profit  = stake × (decimal − 1) × (1 + boost%)
 * boosted decimal = 1 + (decimal − 1) × (1 + boost%)
 */
export function profitBoost(stake: number, odds: Odds, boostPercent: number): BoostResult {
  if (!Number.isFinite(stake) || stake <= 0) throw new Error(`Invalid stake: ${stake}. Must be a positive number.`);
  if (!Number.isFinite(boostPercent) || boostPercent <= 0 || boostPercent > 1000) {
    throw new Error(`Invalid boost: ${boostPercent}%. Must be between 0 and 1000.`);
  }
  const multiplier = 1 + boostPercent / 100;
  const boostedDecimal = 1 + (odds.decimal - 1) * multiplier;
  const baseProfit = stake * (odds.decimal - 1);
  const boostedProfit = baseProfit * multiplier;
  return {
    baseProfit,
    boostedProfit,
    extraProfit: boostedProfit - baseProfit,
    boostedPayout: stake + boostedProfit,
    boostedOdds: oddsFromDecimal(boostedDecimal),
    breakEvenBefore: 100 / odds.decimal,
    breakEvenAfter: 100 / boostedDecimal,
  };
}
