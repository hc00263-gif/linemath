import { Odds, oddsFromDecimal } from "./convert";

const MIN_PARLAY_LEGS = 2;

/**
 * A single parlay leg. A pushed leg (tie / no-action) is dropped from the parlay
 * entirely — the same behavior sportsbooks use when settling a tied leg — which is
 * mathematically equivalent to that leg contributing a 1.00 decimal multiplier.
 */
export interface ParlayLeg {
  odds: Odds;
  push?: boolean;
}

export interface ParlayResult {
  /** null when the parlay is voided (every leg pushed) — there's no valid line to report. */
  odds: Odds | null;
  stake: number;
  payout: number;
  profit: number;
  /** True when every leg pushed: the parlay carries no action and the stake is refunded. */
  voided: boolean;
}

/** Thrown by parlayOdds when every leg pushed, leaving no valid odds to combine. */
export class ParlayVoidError extends Error {
  constructor() {
    super("All parlay legs pushed. The parlay is void and the stake should be refunded.");
    this.name = "ParlayVoidError";
  }
}

/**
 * Combined parlay odds. Multiplies every non-pushed leg's decimal odds together —
 * the standard parlay pricing method used by every US sportsbook.
 * decimal = product(leg.decimal for leg in legs if not leg.push)
 */
export function parlayOdds(legs: ParlayLeg[]): Odds {
  if (legs.length < MIN_PARLAY_LEGS) {
    throw new Error(`A parlay requires at least ${MIN_PARLAY_LEGS} legs, got ${legs.length}.`);
  }
  if (legs.every((leg) => leg.push)) {
    throw new ParlayVoidError();
  }
  const decimal = legs.reduce((product, leg) => (leg.push ? product : product * leg.odds.decimal), 1);
  return oddsFromDecimal(decimal);
}

/**
 * Parlay payout and profit for a given stake. If every leg pushed, the parlay is void:
 * the stake is refunded and profit is 0, matching how sportsbooks settle the bet.
 * Otherwise: payout = stake * parlayOdds.decimal, profit = payout - stake.
 */
export function parlayPayout(stake: number, legs: ParlayLeg[]): ParlayResult {
  if (!Number.isFinite(stake) || stake <= 0) {
    throw new Error(`Invalid stake: ${stake}. Must be a positive number.`);
  }
  if (legs.length >= MIN_PARLAY_LEGS && legs.every((leg) => leg.push)) {
    return { odds: null, stake, payout: stake, profit: 0, voided: true };
  }
  const odds = parlayOdds(legs);
  const payout = stake * odds.decimal;
  return { odds, stake, payout, profit: payout - stake, voided: false };
}
