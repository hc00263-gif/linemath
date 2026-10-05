import { Odds } from "./convert";

export interface RoundRobinCombo {
  /** Indices (into the legs array) of the legs in this parlay. */
  legs: number[];
  /** Combined decimal odds of this parlay. */
  decimal: number;
  /** Payout if every leg in this combo wins. */
  payout: number;
}

export interface WinScenario {
  /** How many of the n legs win. */
  wins: number;
  /** Best total payout across every way exactly `wins` legs can win. */
  maxPayout: number;
  /** Worst total payout across every way exactly `wins` legs can win. */
  minPayout: number;
}

export interface RoundRobinResult {
  combos: RoundRobinCombo[];
  totalStake: number;
  /** Total payout if every leg wins. */
  maxPayout: number;
  scenarios: WinScenario[];
}

const MAX_LEGS = 12;

function combinations(n: number, k: number): number[][] {
  const out: number[][] = [];
  const pick = (start: number, chosen: number[]) => {
    if (chosen.length === k) {
      out.push([...chosen]);
      return;
    }
    for (let i = start; i < n; i++) {
      chosen.push(i);
      pick(i + 1, chosen);
      chosen.pop();
    }
  };
  pick(0, []);
  return out;
}

function popcount(mask: number): number {
  let count = 0;
  for (let m = mask; m; m &= m - 1) count++;
  return count;
}

/**
 * Round robin: bet every k-leg parlay that can be made from n selections.
 *
 * combos        = C(n, k)
 * totalStake    = combos × stakePerCombo
 * combo payout  = stakePerCombo × Π decimal (legs in that combo)
 * total payout  = Σ payout of every combo whose legs ALL won
 *
 * `scenarios` enumerates every win/loss pattern of the legs and reports the best and worst
 * total payout for each number of winning legs — which legs win matters, not just how many.
 */
export function roundRobin(legs: Odds[], combinationSize: number, stakePerCombo: number): RoundRobinResult {
  const n = legs.length;
  if (n < 3 || n > MAX_LEGS) throw new Error(`A round robin needs between 3 and ${MAX_LEGS} selections, got ${n}.`);
  if (!Number.isInteger(combinationSize) || combinationSize < 2 || combinationSize >= n) {
    throw new Error(`Parlay size must be a whole number from 2 to ${n - 1}, got ${combinationSize}.`);
  }
  if (!Number.isFinite(stakePerCombo) || stakePerCombo <= 0) {
    throw new Error(`Invalid stake: ${stakePerCombo}. Must be a positive number.`);
  }

  const combos: RoundRobinCombo[] = combinations(n, combinationSize).map((indices) => {
    const decimal = indices.reduce((product, i) => product * legs[i].decimal, 1);
    return { legs: indices, decimal, payout: stakePerCombo * decimal };
  });
  const masks = combos.map((combo) => combo.legs.reduce((m, i) => m | (1 << i), 0));
  const totalStake = combos.length * stakePerCombo;

  const best = Array<number>(n + 1).fill(-Infinity);
  const worst = Array<number>(n + 1).fill(Infinity);
  for (let winners = 0; winners < 1 << n; winners++) {
    let payout = 0;
    for (let c = 0; c < combos.length; c++) {
      if ((masks[c] & winners) === masks[c]) payout += combos[c].payout;
    }
    const wins = popcount(winners);
    if (payout > best[wins]) best[wins] = payout;
    if (payout < worst[wins]) worst[wins] = payout;
  }

  return {
    combos,
    totalStake,
    maxPayout: best[n],
    scenarios: Array.from({ length: n + 1 }, (_, wins) => ({ wins, maxPayout: best[wins], minPayout: worst[wins] })),
  };
}
