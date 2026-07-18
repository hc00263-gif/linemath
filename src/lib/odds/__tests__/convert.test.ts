import { describe, expect, it } from "vitest";
import {
  InvalidOddsError,
  americanToDecimal,
  americanToFractional,
  americanToImplied,
  decimalToAmerican,
  decimalToFractional,
  fractionalToAmerican,
  fractionalToDecimal,
  impliedToAmerican,
  impliedToDecimal,
  parseOdds,
} from "../convert";

describe("americanToDecimal", () => {
  it("+150 -> decimal 2.50", () => {
    expect(americanToDecimal(150)).toBeCloseTo(2.5, 4);
  });

  it("-110 -> decimal 1.9091 (4dp)", () => {
    expect(americanToDecimal(-110)).toBeCloseTo(1.9091, 4);
  });

  it("-200 -> decimal 1.50", () => {
    expect(americanToDecimal(-200)).toBeCloseTo(1.5, 4);
  });

  it("+100 -> decimal 2.00", () => {
    expect(americanToDecimal(100)).toBeCloseTo(2.0, 4);
  });
});

describe("impliedFromDecimal / americanToImplied", () => {
  it("+150 -> implied 40.00%", () => {
    expect(americanToImplied(150)).toBeCloseTo(40.0, 2);
  });

  it("-110 -> implied 52.38%", () => {
    expect(americanToImplied(-110)).toBeCloseTo(52.38, 2);
  });

  it("-200 -> implied 66.67%", () => {
    expect(americanToImplied(-200)).toBeCloseTo(66.67, 2);
  });

  it("+100 -> implied 50.00%", () => {
    expect(americanToImplied(100)).toBeCloseTo(50.0, 2);
  });
});

describe("decimalToFractional", () => {
  it("+150 -> decimal 2.50 -> fractional 3/2", () => {
    const [num, den] = decimalToFractional(americanToDecimal(150));
    expect(num).toBe(3);
    expect(den).toBe(2);
  });

  it("-110 -> decimal 1.9091 -> fractional 10/11", () => {
    const [num, den] = decimalToFractional(americanToDecimal(-110));
    expect(num).toBe(10);
    expect(den).toBe(11);
  });
});

describe("round-trip american -> decimal -> american", () => {
  const values = [100, 110, 120, 150, 200, 233, 300, 500, -105, -110, -120, -150, -200, -300, -500];

  it.each(values)("%i survives the round trip", (american) => {
    expect(decimalToAmerican(americanToDecimal(american))).toBe(american);
  });
});

describe("fractional <-> american round trip via decimal", () => {
  it("150 -> fractional -> american", () => {
    expect(fractionalToAmerican(americanToFractional(150))).toBe(150);
  });

  it("-110 -> fractional -> american", () => {
    expect(fractionalToAmerican(americanToFractional(-110))).toBe(-110);
  });
});

describe("implied <-> american round trip", () => {
  it("150 -> implied -> american", () => {
    expect(impliedToAmerican(americanToImplied(150))).toBe(150);
  });

  it("-200 -> implied -> american", () => {
    expect(impliedToAmerican(americanToImplied(-200))).toBe(-200);
  });
});

describe("invalid american odds are rejected", () => {
  const invalid = [-99, -50, -1, 0, 1, 50, 99];

  it.each(invalid)("%i is rejected (between -99 and +99 inclusive)", (american) => {
    expect(() => americanToDecimal(american)).toThrow(InvalidOddsError);
  });

  it("boundary values -100 and +100 are accepted", () => {
    expect(() => americanToDecimal(-100)).not.toThrow();
    expect(() => americanToDecimal(100)).not.toThrow();
  });
});

describe("extreme favorites are rejected at the american/implied boundary, not the decimal one", () => {
  it("americanToDecimal(-10000) is valid (decimal exactly 1.01)", () => {
    expect(() => americanToDecimal(-10000)).not.toThrow();
  });

  it("americanToDecimal(-10001) throws an American-flavored error, not a decimal one", () => {
    expect(() => americanToDecimal(-10001)).toThrow(InvalidOddsError);
    expect(() => americanToDecimal(-10001)).toThrow(/American odds/);
  });

  it("americanToDecimal(-20000) throws", () => {
    expect(() => americanToDecimal(-20000)).toThrow(InvalidOddsError);
  });

  it("impliedToDecimal(99.0) is valid (decimal above 1.01)", () => {
    expect(() => impliedToDecimal(99.0)).not.toThrow();
  });

  it("impliedToDecimal(99.5) throws an implied-probability-flavored error, not a decimal one", () => {
    expect(() => impliedToDecimal(99.5)).toThrow(InvalidOddsError);
    expect(() => impliedToDecimal(99.5)).toThrow(/implied probability/);
  });
});

describe("invalid decimal odds are rejected", () => {
  it("rejects decimal < 1.01", () => {
    expect(() => decimalToAmerican(1.0)).toThrow(InvalidOddsError);
    expect(() => decimalToAmerican(0.5)).toThrow(InvalidOddsError);
  });

  it("accepts decimal == 1.01", () => {
    expect(() => decimalToAmerican(1.01)).not.toThrow();
  });
});

describe("fractionalToDecimal", () => {
  it("3/2 -> decimal 2.50", () => {
    expect(fractionalToDecimal([3, 2])).toBeCloseTo(2.5, 4);
  });

  it("rejects non-positive numerator/denominator", () => {
    expect(() => fractionalToDecimal([0, 2])).toThrow(InvalidOddsError);
    expect(() => fractionalToDecimal([3, 0])).toThrow(InvalidOddsError);
    expect(() => fractionalToDecimal([-3, 2])).toThrow(InvalidOddsError);
  });
});

describe("impliedToDecimal", () => {
  it("40% -> decimal 2.50", () => {
    expect(impliedToDecimal(40)).toBeCloseTo(2.5, 4);
  });

  it("rejects out-of-range percentages", () => {
    expect(() => impliedToDecimal(0)).toThrow(InvalidOddsError);
    expect(() => impliedToDecimal(-5)).toThrow(InvalidOddsError);
    expect(() => impliedToDecimal(101)).toThrow(InvalidOddsError);
  });
});

describe("parseOdds - tolerant parsing", () => {
  it('parses "+150" as american', () => {
    const odds = parseOdds("+150", "american");
    expect(odds.american).toBe(150);
    expect(odds.decimal).toBeCloseTo(2.5, 4);
    expect(odds.implied).toBeCloseTo(40.0, 2);
    expect(odds.fractional).toEqual([3, 2]);
  });

  it('parses "150" (no sign) as american', () => {
    expect(parseOdds("150", "american").american).toBe(150);
  });

  it('parses "-110" as american', () => {
    expect(parseOdds("-110", "american").american).toBe(-110);
  });

  it("parses numeric american input", () => {
    expect(parseOdds(-110, "american").american).toBe(-110);
  });

  it('parses "2.50" as decimal', () => {
    const odds = parseOdds("2.50", "decimal");
    expect(odds.decimal).toBeCloseTo(2.5, 4);
    expect(odds.american).toBe(150);
  });

  it('parses "3/2" as fractional', () => {
    const odds = parseOdds("3/2", "fractional");
    expect(odds.decimal).toBeCloseTo(2.5, 4);
    expect(odds.american).toBe(150);
  });

  it('parses "40" and "40%" as implied', () => {
    expect(parseOdds("40", "implied").decimal).toBeCloseTo(2.5, 4);
    expect(parseOdds("40%", "implied").decimal).toBeCloseTo(2.5, 4);
  });

  it("throws InvalidOddsError on garbage input", () => {
    expect(() => parseOdds("not-a-number", "american")).toThrow(InvalidOddsError);
    expect(() => parseOdds("3/2/1", "fractional")).toThrow(InvalidOddsError);
  });

  it("throws InvalidOddsError on out-of-range american via parseOdds", () => {
    expect(() => parseOdds("+50", "american")).toThrow(InvalidOddsError);
  });
});
