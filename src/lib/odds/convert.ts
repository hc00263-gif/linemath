/**
 * Core odds conversion library. Every calculator in the app is built on top of this
 * module — it is the single source of truth for turning one odds notation into another.
 * All functions are pure and side-effect free.
 */

/** Supported odds notations. */
export type OddsFormat = "american" | "decimal" | "fractional" | "implied";

/**
 * A single betting line expressed in every supported notation at once.
 * `implied` is a percentage in the range (0, 100], not a 0-1 probability.
 */
export interface Odds {
  american: number;
  decimal: number;
  fractional: [number, number];
  implied: number;
}

/** Thrown when an odds value or string fails validation or cannot be parsed. */
export class InvalidOddsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidOddsError";
  }
}

/** Minimum legal decimal payout multiplier (anything lower can't return the stake). */
const DECIMAL_MIN = 1.01;

/** Largest denominator the continued-fraction reducer will settle on before giving up. */
const FRACTIONAL_MAX_DENOMINATOR = 1000;

/**
 * Best rational approximation of `x` via continued-fraction convergents, capped at
 * `maxDenominator`. Used instead of naive fixed-precision rounding because betting
 * decimals are frequently repeating fractions (e.g. 1.909090... = 10/11) that a
 * fixed-precision GCD reduction cannot recover.
 */
function toFraction(x: number, maxDenominator: number): [number, number] {
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x);
  let hPrev2 = 0;
  let hPrev1 = 1;
  let kPrev2 = 1;
  let kPrev1 = 0;
  let remainder = x;
  let h = 1;
  let k = 0;
  for (let i = 0; i < 64; i++) {
    const a = Math.floor(remainder);
    h = a * hPrev1 + hPrev2;
    k = a * kPrev1 + kPrev2;
    if (k > maxDenominator) {
      h = hPrev1;
      k = kPrev1;
      break;
    }
    if (Math.abs(x - h / k) <= 1e-9) break;
    const frac = remainder - a;
    if (frac < 1e-12) break;
    remainder = 1 / frac;
    hPrev2 = hPrev1;
    hPrev1 = h;
    kPrev2 = kPrev1;
    kPrev1 = k;
  }
  return [sign * h, k || 1];
}

/**
 * Validates American odds. Legal values are <= -100 or >= 100 — the range (-100, 100),
 * including 0, has no American-odds representation and is rejected.
 */
export function assertValidAmerican(american: number): void {
  if (!Number.isFinite(american) || (american > -100 && american < 100)) {
    throw new InvalidOddsError(
      `Invalid American odds: ${american}. Must be <= -100 or >= 100.`
    );
  }
}

/** Validates decimal odds. Legal values are >= 1.01 (a 1.00 or lower multiplier can't pay out). */
export function assertValidDecimal(decimal: number): void {
  if (!Number.isFinite(decimal) || decimal < DECIMAL_MIN) {
    throw new InvalidOddsError(`Invalid decimal odds: ${decimal}. Must be >= ${DECIMAL_MIN}.`);
  }
}

/**
 * American -> decimal.
 * Positive: decimal = 1 + american / 100
 * Negative: decimal = 1 + 100 / |american|
 */
export function americanToDecimal(american: number): number {
  assertValidAmerican(american);
  const decimal = american > 0 ? 1 + american / 100 : 1 + 100 / Math.abs(american);
  if (decimal < DECIMAL_MIN) {
    throw new InvalidOddsError(
      `Invalid American odds: ${american}. This is too extreme a favorite — it implies a decimal payout below the minimum of ${DECIMAL_MIN}.`
    );
  }
  return decimal;
}

/**
 * Decimal -> American, rounded to the nearest whole number (as sportsbooks display it).
 * decimal >= 2.00: american = (decimal - 1) * 100
 * decimal <  2.00: american = -100 / (decimal - 1)
 *
 * Note: decimal 2.00 is a genuine tie between +100 and -100 (even money); this always
 * resolves to +100, matching standard sportsbook convention.
 */
export function decimalToAmerican(decimal: number): number {
  assertValidDecimal(decimal);
  const american = decimal >= 2 ? (decimal - 1) * 100 : -100 / (decimal - 1);
  return Math.round(american);
}

/**
 * Decimal -> implied win probability, expressed as a percentage (0, 100].
 * implied% = (1 / decimal) * 100
 */
export function impliedFromDecimal(decimal: number): number {
  assertValidDecimal(decimal);
  return (1 / decimal) * 100;
}

/**
 * Implied win probability percentage -> decimal.
 * decimal = 100 / implied%
 */
export function impliedToDecimal(implied: number): number {
  if (!Number.isFinite(implied) || implied <= 0 || implied > 100) {
    throw new InvalidOddsError(`Invalid implied probability: ${implied}%. Must be in (0, 100].`);
  }
  const decimal = 100 / implied;
  if (decimal < DECIMAL_MIN) {
    throw new InvalidOddsError(
      `Invalid implied probability: ${implied}%. This is too close to 100% — it implies a decimal payout below the minimum of ${DECIMAL_MIN}.`
    );
  }
  return decimal;
}

/** American -> implied probability percentage. Routes through decimal. */
export function americanToImplied(american: number): number {
  return impliedFromDecimal(americanToDecimal(american));
}

/** Implied probability percentage -> American. Routes through decimal. */
export function impliedToAmerican(implied: number): number {
  return decimalToAmerican(impliedToDecimal(implied));
}

/**
 * Decimal -> reduced fractional odds, [numerator, denominator].
 * fractional = decimal - 1, reduced to its simplest rational approximation so e.g.
 * 2.50 -> 3/2 and 1.9090909... -> 10/11.
 */
export function decimalToFractional(decimal: number): [number, number] {
  assertValidDecimal(decimal);
  return toFraction(decimal - 1, FRACTIONAL_MAX_DENOMINATOR);
}

/** Fractional -> decimal. decimal = 1 + numerator / denominator */
export function fractionalToDecimal(fractional: [number, number]): number {
  const [numerator, denominator] = fractional;
  if (
    !Number.isFinite(numerator) ||
    !Number.isFinite(denominator) ||
    numerator <= 0 ||
    denominator <= 0
  ) {
    throw new InvalidOddsError(`Invalid fractional odds: ${numerator}/${denominator}.`);
  }
  return 1 + numerator / denominator;
}

/** American -> fractional. Routes through decimal. */
export function americanToFractional(american: number): [number, number] {
  return decimalToFractional(americanToDecimal(american));
}

/** Fractional -> American. Routes through decimal. */
export function fractionalToAmerican(fractional: [number, number]): number {
  return decimalToAmerican(fractionalToDecimal(fractional));
}

/** Fractional -> implied probability percentage. Routes through decimal. */
export function fractionalToImplied(fractional: [number, number]): number {
  return impliedFromDecimal(fractionalToDecimal(fractional));
}

/** Implied probability percentage -> fractional. Routes through decimal. */
export function impliedToFractional(implied: number): [number, number] {
  return decimalToFractional(impliedToDecimal(implied));
}

/** Builds the full Odds object (all four notations) from a decimal value. */
export function oddsFromDecimal(decimal: number): Odds {
  assertValidDecimal(decimal);
  return {
    american: decimalToAmerican(decimal),
    decimal,
    fractional: decimalToFractional(decimal),
    implied: impliedFromDecimal(decimal),
  };
}

/** Builds the full Odds object (all four notations) from an American value. */
export function oddsFromAmerican(american: number): Odds {
  assertValidAmerican(american);
  const decimal = americanToDecimal(american);
  return {
    american,
    decimal,
    fractional: decimalToFractional(decimal),
    implied: impliedFromDecimal(decimal),
  };
}

/**
 * Tolerant parser for a single odds notation, returning the full Odds object with all
 * four notations populated.
 *
 * Accepts: "+150", "150", "-110", 150 for american; "2.50", 2.5 for decimal;
 * "3/2" for fractional; "40", "40%", 40 for implied (percentage).
 */
export function parseOdds(input: string | number, format: OddsFormat): Odds {
  switch (format) {
    case "american": {
      const american =
        typeof input === "number" ? input : Number(String(input).trim().replace(/^\+/, ""));
      if (Number.isNaN(american)) {
        throw new InvalidOddsError(`Cannot parse American odds from "${input}".`);
      }
      return oddsFromAmerican(american);
    }
    case "decimal": {
      const decimal = typeof input === "number" ? input : Number(String(input).trim());
      if (Number.isNaN(decimal)) {
        throw new InvalidOddsError(`Cannot parse decimal odds from "${input}".`);
      }
      return oddsFromDecimal(decimal);
    }
    case "fractional": {
      const raw = String(input).trim();
      const parts = raw.split("/");
      if (parts.length !== 2) {
        throw new InvalidOddsError(`Cannot parse fractional odds from "${input}". Expected "n/d".`);
      }
      const numerator = Number(parts[0]);
      const denominator = Number(parts[1]);
      if (Number.isNaN(numerator) || Number.isNaN(denominator)) {
        throw new InvalidOddsError(`Cannot parse fractional odds from "${input}".`);
      }
      return oddsFromDecimal(fractionalToDecimal([numerator, denominator]));
    }
    case "implied": {
      const raw =
        typeof input === "number" ? input : Number(String(input).trim().replace(/%$/, ""));
      if (Number.isNaN(raw)) {
        throw new InvalidOddsError(`Cannot parse implied probability from "${input}".`);
      }
      return oddsFromDecimal(impliedToDecimal(raw));
    }
    default: {
      const exhaustive: never = format;
      throw new InvalidOddsError(`Unknown odds format: ${exhaustive}.`);
    }
  }
}
