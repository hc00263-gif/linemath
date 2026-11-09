import { oddsFromDecimal, type OddsFormat } from "@/lib/odds/convert";
import { formatAmerican, formatDecimal, formatFractional, formatImplied } from "@/lib/odds/format";

/** Display a decimal price in the chosen notation. Never throws — bad data renders as an em dash. */
export function formatPrice(decimal: number, format: OddsFormat): string {
  try {
    const o = oddsFromDecimal(decimal);
    switch (format) {
      case "american":
        return formatAmerican(o.american);
      case "decimal":
        return formatDecimal(o.decimal);
      case "fractional":
        return formatFractional(o.fractional);
      case "implied":
        return formatImplied(o.implied);
    }
  } catch {
    return "—";
  }
}

/** "+3.5" / "-7" / "44.5" for a spread or total line. */
export function formatLine(point: number | null, signed: boolean): string {
  if (point == null) return "";
  return signed && point > 0 ? `+${point}` : `${point}`;
}

const ET: Intl.DateTimeFormatOptions = {
  timeZone: "America/New_York",
  weekday: "short",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
};

/** Fixed-timezone formatting so server and client render identical text (no hydration drift). */
export function formatEt(iso: string): string {
  const d = new Date(/[zZ]|[+-]\d\d:\d\d$/.test(iso) ? iso : `${iso}Z`);
  if (Number.isNaN(d.getTime())) return "";
  // Newer ICU versions put a narrow no-break space before AM/PM; normalise so every runtime prints the same text.
  return `${d.toLocaleString("en-US", ET).replace(/\u202f/g, " ")} ET`;
}
