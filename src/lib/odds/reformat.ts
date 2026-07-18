import { OddsFormat, parseOdds } from "./convert";
import { formatAmerican, formatDecimal, formatFractional } from "./format";

/**
 * Re-renders an odds text value from one notation to another, preserving the underlying
 * odds. Used when the user switches the format toggle so an existing input doesn't
 * suddenly read as "invalid" just because the notation changed under it — e.g. "-110"
 * switching from American to Decimal becomes "1.91", not a validation error.
 * Returns the original text unchanged if it doesn't parse in the source format.
 */
export function retextOdds(value: string, from: OddsFormat, to: OddsFormat): string {
  if (value.trim() === "" || from === to) return value;
  try {
    const odds = parseOdds(value, from);
    switch (to) {
      case "american":
        return formatAmerican(odds.american);
      case "decimal":
        return formatDecimal(odds.decimal);
      case "fractional":
        return formatFractional(odds.fractional);
      case "implied":
        return odds.implied.toFixed(2);
      default:
        return value;
    }
  } catch {
    return value;
  }
}
