/** Shape of the board snapshots the odds hub publishes to Redis (odds:v1:<league>). Decimal odds throughout. */
export interface HubBest {
  book: string;
  decimal: number;
  american: number | null;
}

export interface HubSide {
  selection: string;
  /** Spread/total line; null for moneyline. */
  point: number | null;
  best: HubBest;
  /** Every book's decimal price for this side. */
  books: Record<string, number>;
}

export interface HubGame {
  id: string | number;
  home: string;
  away: string;
  /** UTC ISO start time. */
  start: string;
  markets: Record<string, HubSide[]>;
  /** Hold per market using each side's best price (0.02 = 2%). Negative means the best prices form an arb. */
  vig: Record<string, number>;
}

export interface HubBoard {
  league: string;
  updated: string;
  games: HubGame[];
}

export interface HubIndex {
  updated: string;
  leagues: Record<string, { games: number; updated: string }>;
}

export type MarketKey = "h2h" | "spreads" | "totals";
