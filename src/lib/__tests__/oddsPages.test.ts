import { describe, expect, it } from "vitest";
import { ALL_ODDS, neighbors, oddsFacts, oddsLabel, oddsToSlug, slugToOdds } from "../oddsPages";

describe("odds page slugs", () => {
  it("round-trips every published price and uses minus/plus words", () => {
    expect(oddsToSlug(-110)).toBe("minus-110");
    expect(oddsToSlug(150)).toBe("plus-150");
    for (const odds of ALL_ODDS) expect(slugToOdds(oddsToSlug(odds))).toBe(odds);
  });
  it("rejects unpublished or malformed slugs", () => {
    expect(slugToOdds("minus-100")).toBeNull();
    expect(slugToOdds("plus-99")).toBeNull();
    expect(slugToOdds("-110")).toBeNull();
    expect(slugToOdds("minus-abc")).toBeNull();
  });
  it("has no duplicate prices and sorts shortest favorite to longest underdog", () => {
    expect(new Set(ALL_ODDS).size).toBe(ALL_ODDS.length);
    expect(ALL_ODDS[0]).toBe(-1000);
    expect(ALL_ODDS[ALL_ODDS.length - 1]).toBe(1000);
  });
  it("formats labels and finds neighbors", () => {
    expect(oddsLabel(150)).toBe("+150");
    expect(oddsLabel(-110)).toBe("-110");
    expect(neighbors(-1000).prev).toBeNull();
    expect(neighbors(1000).next).toBeNull();
    expect(neighbors(150).prev).toBe(145);
  });
});

describe("oddsFacts", () => {
  it("-110: bet $110 to win $100, 52.38% break-even, 53 wins of 100, 2-leg parlay +264", () => {
    const f = oddsFacts(-110);
    expect(f.isFavorite).toBe(true);
    expect(f.stakeToWin100).toBeCloseTo(110, 6);
    expect(f.breakEven).toBeCloseTo(52.381, 3);
    expect(f.minWinsOf100).toBe(53);
    expect(f.twoLeg.american).toBe(264);
    expect(f.twoLegPayout100).toBeCloseTo(364.46, 2);
    expect(f.rows.find((r) => r.stake === 100)?.profit).toBeCloseTo(90.909, 3);
  });
  it("+150: a $100 bet wins $150, 40% break-even, stakeToWin100 is $66.67", () => {
    const f = oddsFacts(150);
    expect(f.isFavorite).toBe(false);
    expect(f.stakeToWin100).toBeCloseTo(66.667, 3);
    expect(f.breakEven).toBeCloseTo(40, 6);
    expect(f.rows.find((r) => r.stake === 100)?.profit).toBeCloseTo(150, 6);
  });
  it("every published price builds valid facts", () => {
    for (const odds of ALL_ODDS) expect(() => oddsFacts(odds)).not.toThrow();
  });
});
