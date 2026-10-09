import { Odds, oddsFromAmerican, oddsFromDecimal } from "./odds/convert";
import { minWinsToProfit } from "./odds/breakeven";

/** The prices that get their own explainer page. Chosen to cover what bettors actually see on a board. */
export const NEGATIVE_ODDS = [-102, -105, -108, -110, -112, -115, -120, -125, -130, -135, -140, -145, -150, -160, -170, -175, -180, -190, -200, -210, -220, -225, -230, -240, -250, -260, -275, -300, -325, -350, -400, -450, -500, -600, -700, -800, -1000];
export const POSITIVE_ODDS = [100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150, 160, 170, 175, 180, 190, 200, 210, 220, 225, 230, 240, 250, 260, 275, 300, 325, 350, 375, 400, 450, 500, 600, 700, 800, 1000];
export const ALL_ODDS: number[] = [...NEGATIVE_ODDS.slice().reverse(), ...POSITIVE_ODDS];

export function oddsToSlug(odds: number): string {
  return odds < 0 ? `minus-${Math.abs(odds)}` : `plus-${odds}`;
}

/** Parses "minus-110" / "plus-150" back to an American price, only if it is one of the published pages. */
export function slugToOdds(slug: string): number | null {
  const match = /^(minus|plus)-(\d+)$/.exec(slug);
  if (!match) return null;
  const value = Number(match[2]) * (match[1] === "minus" ? -1 : 1);
  return ALL_ODDS.includes(value) ? value : null;
}

export function oddsLabel(odds: number): string {
  return odds > 0 ? `+${odds}` : `${odds}`;
}

export function neighbors(odds: number): { prev: number | null; next: number | null } {
  const i = ALL_ODDS.indexOf(odds);
  return { prev: i > 0 ? ALL_ODDS[i - 1] : null, next: i >= 0 && i < ALL_ODDS.length - 1 ? ALL_ODDS[i + 1] : null };
}

export interface StakeRow {
  stake: number;
  profit: number;
  payout: number;
}

export interface OddsFacts {
  odds: Odds;
  label: string;
  isFavorite: boolean;
  /** Stake needed to win exactly $100 profit. */
  stakeToWin100: number;
  rows: StakeRow[];
  breakEven: number;
  minWinsOf100: number;
  twoLeg: Odds;
  threeLeg: Odds;
  twoLegPayout100: number;
  threeLegPayout100: number;
}

const STAKES = [10, 25, 50, 100, 250];

/** Everything the page states about a price, computed from the same library the calculators use. */
export function oddsFacts(american: number): OddsFacts {
  const odds = oddsFromAmerican(american);
  const profitPer = odds.decimal - 1;
  return {
    odds,
    label: oddsLabel(american),
    isFavorite: american < 0,
    stakeToWin100: 100 / profitPer,
    rows: STAKES.map((stake) => ({ stake, profit: stake * profitPer, payout: stake * odds.decimal })),
    breakEven: 100 / odds.decimal,
    minWinsOf100: minWinsToProfit(odds, 100),
    twoLeg: oddsFromDecimal(odds.decimal ** 2),
    threeLeg: oddsFromDecimal(odds.decimal ** 3),
    twoLegPayout100: 100 * odds.decimal ** 2,
    threeLegPayout100: 100 * odds.decimal ** 3,
  };
}
