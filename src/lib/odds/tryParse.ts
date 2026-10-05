import { Odds, OddsFormat, parseOdds } from "./convert";

/** parseOdds that returns null instead of throwing, so calculators can render "—" for incomplete input. */
export function tryParseOdds(value: string, format: OddsFormat): Odds | null {
  if (value.trim() === "") return null;
  try {
    return parseOdds(value, format);
  } catch {
    return null;
  }
}

/** Positive finite number from text, else null. */
export function parsePositive(value: string): number | null {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : null;
}

/** A percentage typed as 0-100 (exclusive), returned as a 0-1 fraction; null if invalid. */
export function parsePercentFraction(value: string): number | null {
  const n = Number(value.trim().replace(/%$/, ""));
  return Number.isFinite(n) && n > 0 && n < 100 ? n / 100 : null;
}
