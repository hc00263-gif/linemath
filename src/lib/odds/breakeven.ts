import { Odds } from "./convert";

export interface RecordResult {
  winPercent: number;
  breakEvenPercent: number;
  /** Profit in units, betting 1 unit per wager at these odds. */
  profitUnits: number;
  /** profitUnits as a percentage of units wagered. */
  roiPercent: number;
  /** Fewest whole wins that leaves you in profit over this many bets. */
  minWinsToProfit: number;
}

/** Win rate needed to break even at these odds: 1 / decimal, as a percentage. */
export function breakEvenRate(odds: Odds): number {
  return 100 / odds.decimal;
}

/**
 * Fewest whole wins (out of `totalBets`) that leaves you in profit at flat stakes.
 * w × (decimal − 1) − (n − w) > 0  →  w > n / decimal
 */
export function minWinsToProfit(odds: Odds, totalBets: number): number {
  return Math.floor(totalBets / odds.decimal) + 1;
}

/** Flat-stake results of a win/loss record at the given average odds (pushes excluded). */
export function recordResult(odds: Odds, wins: number, losses: number): RecordResult {
  if (![wins, losses].every((n) => Number.isInteger(n) && n >= 0) || wins + losses === 0) {
    throw new Error("Enter whole-number wins and losses, with at least one bet.");
  }
  const total = wins + losses;
  const profitUnits = wins * (odds.decimal - 1) - losses;
  return {
    winPercent: (wins / total) * 100,
    breakEvenPercent: breakEvenRate(odds),
    profitUnits,
    roiPercent: (profitUnits / total) * 100,
    minWinsToProfit: minWinsToProfit(odds, total),
  };
}
