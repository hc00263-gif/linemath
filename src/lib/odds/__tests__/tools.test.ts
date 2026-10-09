import { describe, expect, it } from "vitest";
import { oddsFromAmerican } from "../convert";
import { profitBoost } from "../boost";
import { breakEvenRate, minWinsToProfit, recordResult } from "../breakeven";
import { normalCdf, spreadToMoneyline, spreadToWinProbability, winProbabilityToSpread } from "../spread";
import { clvCalc } from "../clv";

const o = oddsFromAmerican;

describe("profitBoost", () => {
  it("25% boost on $100 at -110: profit $90.91 -> $113.64, odds -> +114", () => {
    const r = profitBoost(100, o(-110), 25);
    expect(r.baseProfit).toBeCloseTo(90.909, 2);
    expect(r.boostedProfit).toBeCloseTo(113.636, 2);
    expect(r.extraProfit).toBeCloseTo(22.727, 2);
    expect(r.boostedPayout).toBeCloseTo(213.636, 2);
    expect(r.boostedOdds.american).toBe(114);
    expect(r.breakEvenBefore).toBeCloseTo(52.381, 3);
    expect(r.breakEvenAfter).toBeCloseTo(46.809, 3);
  });
  it("rejects bad input", () => {
    expect(() => profitBoost(0, o(-110), 25)).toThrow();
    expect(() => profitBoost(100, o(-110), 0)).toThrow();
  });
});

describe("break-even", () => {
  it("-110 needs 52.38%", () => expect(breakEvenRate(o(-110))).toBeCloseTo(52.381, 3));
  it("needs 53 wins out of 100 at -110 to be in profit", () => expect(minWinsToProfit(o(-110), 100)).toBe(53));
  it("55-45 at -110 is +5.0 units, 5% ROI", () => {
    const r = recordResult(o(-110), 55, 45);
    expect(r.profitUnits).toBeCloseTo(5, 6);
    expect(r.roiPercent).toBeCloseTo(5, 6);
    expect(r.winPercent).toBeCloseTo(55, 8);
  });
  it("rejects empty or fractional records", () => {
    expect(() => recordResult(o(-110), 0, 0)).toThrow();
    expect(() => recordResult(o(-110), 1.5, 2)).toThrow();
  });
});

describe("spread conversion (estimate)", () => {
  it("normal CDF matches known values", () => {
    expect(normalCdf(0)).toBeCloseTo(0.5, 7);
    expect(normalCdf(1)).toBeCloseTo(0.841345, 5);
    expect(normalCdf(1.96)).toBeCloseTo(0.975002, 5);
    expect(normalCdf(-1)).toBeCloseTo(1 - 0.841345, 5);
  });
  it("NFL -3 ≈ 58.8%, -7 ≈ 69.8%; NBA -5 ≈ 66.2%", () => {
    expect(spreadToWinProbability(3, "nfl")).toBeCloseTo(0.5879, 3);
    expect(spreadToWinProbability(7, "nfl")).toBeCloseTo(0.698, 3);
    expect(spreadToWinProbability(5, "nba")).toBeCloseTo(0.6615, 3);
  });
  it("moneyline sides are consistent: favorite and underdog probabilities sum to 100%", () => {
    const { favorite, underdog } = spreadToMoneyline(7, "nfl");
    expect(favorite.implied + underdog.implied).toBeCloseTo(100, 6);
    expect(favorite.american).toBeLessThan(0);
    expect(underdog.american).toBeGreaterThan(0);
  });
  it("inverse round-trips", () => {
    expect(winProbabilityToSpread(spreadToWinProbability(6.5, "nfl"), "nfl")).toBeCloseTo(6.5, 4);
  });
  it("rejects invalid input", () => {
    expect(() => spreadToWinProbability(-1, "nfl")).toThrow();
    expect(() => spreadToMoneyline(0, "nfl")).toThrow();
    expect(() => winProbabilityToSpread(0.5, "nba")).toThrow();
  });
});

describe("clvCalc", () => {
  it("bet +110, market closes -110/-110: +5% CLV, 2.38 points", () => {
    const r = clvCalc(o(110), o(-110), o(-110));
    expect(r.devigged).toBe(true);
    expect(r.closeProbability).toBeCloseTo(50, 8);
    expect(r.clvPercent).toBeCloseTo(5, 6);
    expect(r.clvPoints).toBeCloseTo(2.381, 3);
    expect(r.fairCloseOdds.american).toBe(100);
  });
  it("without the opposite side, the raw (vig-included) close OVERSTATES CLV", () => {
    const withVig = clvCalc(o(110), o(-110));
    expect(withVig.devigged).toBe(false);
    expect(withVig.clvPercent).toBeGreaterThan(5);
  });
  it("a price worse than the close is negative CLV", () => {
    expect(clvCalc(o(-130), o(-110), o(-110)).clvPercent).toBeLessThan(0);
  });
});
