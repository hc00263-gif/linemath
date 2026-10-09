import { Odds, oddsFromDecimal } from "./convert";

export interface ClvResult {
  /** Win probability your price implied, as a percentage. */
  betImplied: number;
  /** Closing win probability, as a percentage — vig-free when the opposite side was supplied. */
  closeProbability: number;
  /** True when the closing price was de-vigged using the opposite side. */
  devigged: boolean;
  /** closeProbability − betImplied, in percentage points. Positive means you beat the close. */
  clvPoints: number;
  /** Expected value of your bet if the closing line is the true probability: betDecimal × closeProb − 1. */
  clvPercent: number;
  /** Fair closing odds. */
  fairCloseOdds: Odds;
}

/**
 * Closing line value: how your price compares with where the market closed.
 *
 * With the opposite side's closing odds, the close is de-vigged proportionally:
 *   closeProb = (1/closeDec) / (1/closeDec + 1/oppositeDec)
 * Otherwise the raw closing price is used. It still includes the book's margin, which inflates the
 * closing probability and OVERSTATES your CLV — supply the opposite side whenever you can.
 *
 * CLV% = betDecimal × closeProb − 1
 */
export function clvCalc(bet: Odds, close: Odds, oppositeClose?: Odds): ClvResult {
  const rawClose = 1 / close.decimal;
  const closeProb = oppositeClose ? rawClose / (rawClose + 1 / oppositeClose.decimal) : rawClose;
  const betImplied = 1 / bet.decimal;
  return {
    betImplied: betImplied * 100,
    closeProbability: closeProb * 100,
    devigged: Boolean(oppositeClose),
    clvPoints: (closeProb - betImplied) * 100,
    clvPercent: (bet.decimal * closeProb - 1) * 100,
    fairCloseOdds: oddsFromDecimal(1 / closeProb),
  };
}
