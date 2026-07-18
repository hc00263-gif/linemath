/** Pure display-formatting helpers for the odds library. UI-facing only — no math lives here. */

/** "+150" / "-110". American odds always show an explicit sign. */
export function formatAmerican(american: number): string {
  return american > 0 ? `+${american}` : `${american}`;
}

/** "2.50". Decimal odds always show 2 decimal places. */
export function formatDecimal(decimal: number): string {
  return decimal.toFixed(2);
}

/** "3/2". Fractional odds as "numerator/denominator". */
export function formatFractional(fractional: [number, number]): string {
  return `${fractional[0]}/${fractional[1]}`;
}

/** "40.00%". Implied probability, already a 0-100 percentage. */
export function formatImplied(implied: number): string {
  return `${implied.toFixed(2)}%`;
}

/** "$1,234.56". US currency, always 2 decimal places. */
export function formatCurrency(amount: number): string {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
