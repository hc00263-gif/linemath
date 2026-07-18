import { describe, expect, it } from "vitest";
import { formatAmerican, formatCurrency, formatDecimal, formatFractional, formatImplied } from "../format";

describe("format helpers", () => {
  it("formatAmerican adds a + sign for positive values", () => {
    expect(formatAmerican(150)).toBe("+150");
    expect(formatAmerican(-110)).toBe("-110");
  });

  it("formatDecimal always shows 2dp", () => {
    expect(formatDecimal(2.5)).toBe("2.50");
    expect(formatDecimal(1.9090909)).toBe("1.91");
  });

  it("formatFractional joins numerator/denominator", () => {
    expect(formatFractional([3, 2])).toBe("3/2");
  });

  it("formatImplied shows 2dp with a percent sign", () => {
    expect(formatImplied(40)).toBe("40.00%");
  });

  it("formatCurrency formats as USD", () => {
    expect(formatCurrency(695.79)).toBe("$695.79");
    expect(formatCurrency(1234.5)).toBe("$1,234.50");
  });
});
