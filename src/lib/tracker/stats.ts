import { americanToDecimal } from "../odds/convert";
import { Bet } from "./types";

export interface Summary {
  bets: number;
  wins: number;
  losses: number;
  pushes: number;
  pending: number;
  /** Total staked on settled bets that were won or lost. */
  staked: number;
  profit: number;
  /** Profit as a percentage of `staked`; null when nothing is settled. */
  roi: number | null;
  /** Wins as a percentage of wins + losses; null when none. */
  winPercent: number | null;
  /** Average CLV (price vs closing price) across bets that have closing odds; null when none. */
  avgClv: number | null;
  clvBets: number;
}

export interface GroupRow {
  key: string;
  bets: number;
  wins: number;
  losses: number;
  profit: number;
  roi: number | null;
}

export interface SeriesPoint {
  date: string;
  cumulative: number;
}

/** Profit of one bet: a win pays stake × (decimal − 1), a loss costs the stake, everything else is 0. */
export function betProfit(bet: Bet): number {
  if (bet.result === "win") return bet.stake * (americanToDecimal(bet.odds) - 1);
  if (bet.result === "loss") return -bet.stake;
  return 0;
}

/** Price CLV: how much better your decimal price was than the closing price. Vig is not removed. */
export function betClv(bet: Bet): number | null {
  if (bet.closingOdds === undefined) return null;
  return (americanToDecimal(bet.odds) / americanToDecimal(bet.closingOdds) - 1) * 100;
}

export function summarize(bets: Bet[]): Summary {
  let wins = 0;
  let losses = 0;
  let pushes = 0;
  let pending = 0;
  let staked = 0;
  let profit = 0;
  let clvTotal = 0;
  let clvBets = 0;
  for (const bet of bets) {
    if (bet.result === "win") wins++;
    else if (bet.result === "loss") losses++;
    else if (bet.result === "push") pushes++;
    else pending++;
    if (bet.result === "win" || bet.result === "loss") {
      staked += bet.stake;
      profit += betProfit(bet);
    }
    const clv = betClv(bet);
    if (clv !== null) {
      clvTotal += clv;
      clvBets++;
    }
  }
  const decided = wins + losses;
  return {
    bets: bets.length,
    wins,
    losses,
    pushes,
    pending,
    staked,
    profit,
    roi: staked > 0 ? (profit / staked) * 100 : null,
    winPercent: decided > 0 ? (wins / decided) * 100 : null,
    avgClv: clvBets > 0 ? clvTotal / clvBets : null,
    clvBets,
  };
}

/** Groups bets by a key and reports record, profit and ROI for each group, biggest profit first. */
export function groupStats(bets: Bet[], keyOf: (bet: Bet) => string): GroupRow[] {
  const groups = new Map<string, Bet[]>();
  for (const bet of bets) {
    const key = keyOf(bet);
    groups.set(key, [...(groups.get(key) ?? []), bet]);
  }
  return [...groups.entries()]
    .map(([key, list]) => {
      const s = summarize(list);
      return { key, bets: list.length, wins: s.wins, losses: s.losses, profit: s.profit, roi: s.roi };
    })
    .sort((a, b) => b.profit - a.profit);
}

export function oddsRange(odds: number): string {
  if (odds <= -200) return "Heavy favorite (-200 or shorter)";
  if (odds < 0) return "Favorite (-199 to -101)";
  if (odds < 200) return "Even to small dog (+100 to +199)";
  return "Underdog (+200 or longer)";
}

/** Running profit over settled bets in date order (ties keep entry order). */
export function cumulativeSeries(bets: Bet[]): SeriesPoint[] {
  const settled = bets
    .map((bet, index) => ({ bet, index }))
    .filter(({ bet }) => bet.result === "win" || bet.result === "loss" || bet.result === "push")
    .sort((a, b) => a.bet.date.localeCompare(b.bet.date) || a.index - b.index);
  let total = 0;
  return settled.map(({ bet }) => {
    total += betProfit(bet);
    return { date: bet.date, cumulative: total };
  });
}
