export type BetResult = "pending" | "win" | "loss" | "push";

export interface Bet {
  id: string;
  /** YYYY-MM-DD */
  date: string;
  sport: string;
  type: string;
  description: string;
  /** American odds. */
  odds: number;
  stake: number;
  result: BetResult;
  /** American closing odds on the same side, if known. */
  closingOdds?: number;
}

export const SPORTS = ["NFL", "NBA", "MLB", "NHL", "UFC", "Tennis", "Soccer", "NCAAF", "NCAAB", "Other"];
export const BET_TYPES = ["Spread", "Moneyline", "Total", "Prop", "Parlay", "Teaser", "Futures", "Other"];
