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

const EXCHANGE_MARKERS = ["betfair", "matchbook", "smarkets", "betdaq", "novig", "prophetx", "kalshi", "polymarket", "sporttrade"];

/** Betting exchanges have commission and thin liquidity, so their prices make phantom arbs. */
export function isExchange(book: string): boolean {
  const b = book.toLowerCase().replace(/[\s_]/g, "");
  return EXCHANGE_MARKERS.some((m) => b.includes(m));
}

/** Same side with exchange prices removed and the best price recomputed; null if nothing is left. */
function withoutExchanges(side: HubSide): HubSide | null {
  const entries = Object.entries(side.books).filter(([b]) => !isExchange(b));
  if (entries.length === 0) return null;
  if (entries.length === Object.keys(side.books).length) return side;
  const [book, decimal] = entries.reduce((a, b) => (b[1] > a[1] ? b : a));
  return { ...side, best: { book, decimal, american: null }, books: Object.fromEntries(entries) };
}

function cleanGames(games: HubGame[]): HubGame[] {
  return games.map((g) => ({
    ...g,
    markets: Object.fromEntries(
      Object.entries(g.markets).map(([mk, sides]) => [mk, sides.map(withoutExchanges).filter((s): s is HubSide => s !== null)]),
    ),
  }));
}

/** A leg this far above the rest of the market is more likely a bad or mismatched line than a real arb. */
export const MAX_ARB_LEG_EDGE_PCT = 8;

function legLooksOff(side: HubSide): boolean {
  const others = Object.entries(side.books)
    .filter(([b]) => b !== side.best.book)
    .map(([, p]) => p);
  if (others.length < 4) return false;
  return (side.best.decimal / median(others) - 1) * 100 > MAX_ARB_LEG_EDGE_PCT;
}

function leg(side: HubSide): ArbLeg {
  return { selection: side.selection, point: side.point, book: side.best.book, decimal: side.best.decimal, american: side.best.american };
}

function build(game: HubGame, market: ArbOpportunity["market"], sides: HubSide[]): ArbOpportunity | null {
  const books = new Set(sides.map((s) => s.best.book));
  if (books.size < 2) return null; // an arb needs more than one book
  const sum = sides.reduce((acc, s) => acc + 1 / s.best.decimal, 0);
  if (!(sum < 1)) return null;
  if (sides.some(legLooksOff)) return null;
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
export function findArbs(rawGames: HubGame[]): ArbOpportunity[] {
  const games = cleanGames(rawGames);
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
  /** Pinnacle's no-vig price for this side (the sharp reference), or null when Pinnacle does not cover the market. */
  fairDecimal: number | null;
  /** Expected edge of the best price against Pinnacle's fair price, in percent. Null without a reference. */
  evPercent: number | null;
}

/** The sharp book whose no-vig price is used as the reference "true" price. */
export const SHARP_BOOK = "pinnacle";

function bookPrice(side: HubSide, book: string): number | null {
  const hit = Object.entries(side.books).find(([b]) => b.toLowerCase() === book);
  return hit ? hit[1] : null;
}

/** Sides that make up one complete market at one line: moneyline together, over/under at one total, a spread and its mirror. */
function outcomeGroup(market: string, side: HubSide, sides: HubSide[]): HubSide[] {
  if (market === "h2h") return sides.filter((s) => s.point == null);
  if (market === "totals") return sides.filter((s) => s.point === side.point);
  if (market === "spreads" && side.point != null) {
    return sides.filter((s) => s.point != null && Math.abs(s.point) === Math.abs(side.point as number));
  }
  return [];
}

/** Pinnacle's no-vig decimal price for `side`, or null when the whole market is not priced by Pinnacle. */
export function pinnacleFairDecimal(market: string, side: HubSide, sides: HubSide[]): number | null {
  const group = outcomeGroup(market, side, sides);
  if (group.length < 2 || group.length > 3) return null;
  if (market === "spreads" && group.length !== 2) return null;
  const prices = group.map((g) => bookPrice(g, SHARP_BOOK));
  if (prices.some((p) => p == null || !(p > 1))) return null;
  const implied = (prices as number[]).map((p) => 1 / p);
  const total = implied.reduce((a, b) => a + b, 0);
  const mine = bookPrice(side, SHARP_BOOK) as number;
  return total / (1 / mine);
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
export function findOutliers(rawGames: HubGame[], opts: { minBooks?: number; minEdgePercent?: number } = {}): OutlierLine[] {
  const games = cleanGames(rawGames);
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
          const fair = side.best.book.toLowerCase() === SHARP_BOOK ? null : pinnacleFairDecimal(market, side, sides);
          out.push({
            fairDecimal: fair,
            evPercent: fair ? (side.best.decimal / fair - 1) * 100 : null,
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
  // Prices that also beat Pinnacle's no-vig line are the interesting ones, so they lead; then biggest gap first.
  const confirmed = (o: OutlierLine) => (o.evPercent != null && o.evPercent > 0 ? 1 : 0);
  return out.sort((a, b) => confirmed(b) - confirmed(a) || b.edgePercent - a.edgePercent);
}
