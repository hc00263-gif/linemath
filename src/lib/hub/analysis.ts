import type { HubBest, HubGame, HubSide } from "./types";

export interface ArbLeg {
  selection: string;
  point: number | null;
  book: string;
  decimal: number;
  american: number | null;
}

export interface ArbOpportunity {
  gameId: string | number;
  home: string;
  away: string;
  start: string;
  market: "h2h" | "spreads" | "totals";
  legs: ArbLeg[];
  /** Σ 1/decimal as a percentage. Under 100 is an arb. */
  arbPercent: number;
  /** Guaranteed profit as a percentage of total stake. */
  profitPercent: number;
}

/** Beyond this the "arb" is almost always a stale or mis-parsed price, not a real opportunity. */
export const MAX_PLAUSIBLE_ARB_PCT = 15;

function leg(side: HubSide): ArbLeg {
  return { selection: side.selection, point: side.point, book: side.best.book, decimal: side.best.decimal, american: side.best.american };
}

function build(game: HubGame, market: ArbOpportunity["market"], sides: HubSide[]): ArbOpportunity | null {
  const books = new Set(sides.map((s) => s.best.book));
  if (books.size < 2) return null; // an arb needs more than one book
  const sum = sides.reduce((acc, s) => acc + 1 / s.best.decimal, 0);
  if (!(sum < 1)) return null;
  const profitPercent = (1 / sum - 1) * 100;
  if (profitPercent > MAX_PLAUSIBLE_ARB_PCT) return null;
  return {
    gameId: game.id,
    home: game.home,
    away: game.away,
    start: game.start,
    market,
    legs: sides.map(leg),
    arbPercent: sum * 100,
    profitPercent,
  };
}

/**
 * Arbitrage across the best price on each side. Moneyline: every outcome offered. Totals: the over and
 * under at the same line. Spreads: the two teams at exactly opposite lines (+3.5 vs -3.5).
 */
export function findArbs(games: HubGame[]): ArbOpportunity[] {
  const found: ArbOpportunity[] = [];
  for (const game of games) {
    const h2h = (game.markets.h2h ?? []).filter((s) => s.point == null);
    if (h2h.length === 2 || h2h.length === 3) {
      const arb = build(game, "h2h", h2h);
      if (arb) found.push(arb);
    }

    const totals = game.markets.totals ?? [];
    for (const over of totals.filter((s) => s.selection === "Over" && s.point != null)) {
      const under = totals.find((s) => s.selection === "Under" && s.point === over.point);
      if (under) {
        const arb = build(game, "totals", [over, under]);
        if (arb) found.push(arb);
      }
    }

    const spreads = game.markets.spreads ?? [];
    const home = spreads.filter((s) => s.selection === game.home && s.point != null);
    for (const h of home) {
      const a = spreads.find((s) => s.selection === game.away && s.point != null && s.point === -(h.point as number));
      if (a) {
        const arb = build(game, "spreads", [h, a]);
        if (arb) found.push(arb);
      }
    }
  }
  return found.sort((x, y) => y.profitPercent - x.profitPercent);
}

export interface OutlierLine {
  gameId: string | number;
  home: string;
  away: string;
  start: string;
  market: string;
  selection: string;
  point: number | null;
  best: HubBest;
  /** Median decimal price across the OTHER books on this side. */
  marketMedian: number;
  /** Best price vs the others' median, as a percent (positive = better for the bettor). */
  edgePercent: number;
  bookCount: number;
}

function median(values: number[]): number {
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

/**
 * Sides where one book's price is well above what the rest of the market is offering — a stale line, an
 * early move, or a soft book. Needs several books so a median means something.
 */
export function findOutliers(games: HubGame[], opts: { minBooks?: number; minEdgePercent?: number } = {}): OutlierLine[] {
  const minBooks = opts.minBooks ?? 4;
  const minEdge = opts.minEdgePercent ?? 6;
  const out: OutlierLine[] = [];
  for (const game of games) {
    for (const [market, sides] of Object.entries(game.markets)) {
      for (const side of sides) {
        const entries = Object.entries(side.books);
        if (entries.length < minBooks) continue;
        const others = entries.filter(([book]) => book !== side.best.book).map(([, p]) => p);
        if (others.length < minBooks - 1) continue;
        const med = median(others);
        const edge = (side.best.decimal / med - 1) * 100;
        if (edge >= minEdge) {
          out.push({
            gameId: game.id,
            home: game.home,
            away: game.away,
            start: game.start,
            market,
            selection: side.selection,
            point: side.point,
            best: side.best,
            marketMedian: med,
            edgePercent: edge,
            bookCount: entries.length,
          });
        }
      }
    }
  }
  return out.sort((a, b) => b.edgePercent - a.edgePercent);
}
