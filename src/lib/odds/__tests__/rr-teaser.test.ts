import { describe, expect, it } from "vitest";
import { oddsFromAmerican } from "../convert";
import { roundRobin } from "../roundrobin";
import { teaserOdds } from "../teaser";

const o = oddsFromAmerican;

describe("roundRobin", () => {
  const legs = [o(-110), o(-110), o(-110)];

  it("3 legs in 2-leg parlays: 3 combos, $30 staked at $10 each", () => {
    const rr = roundRobin(legs, 2, 10);
    expect(rr.combos).toHaveLength(3);
    expect(rr.totalStake).toBe(30);
    expect(rr.combos[0].payout).toBeCloseTo(36.4463, 3);
  });

  it("all legs win -> every combo pays: $109.34 total", () => {
    const rr = roundRobin(legs, 2, 10);
    expect(rr.maxPayout).toBeCloseTo(109.3388, 3);
    expect(rr.maxPayout - rr.totalStake).toBeCloseTo(79.3388, 3);
  });

  it("2 of 3 win -> one combo hits; 1 or 0 win -> nothing pays", () => {
    const { scenarios } = roundRobin(legs, 2, 10);
    expect(scenarios[2].maxPayout - 30).toBeCloseTo(6.4463, 3);
    expect(scenarios[2].minPayout).toBeCloseTo(scenarios[2].maxPayout, 8);
    expect(scenarios[1].maxPayout).toBe(0);
    expect(scenarios[0].maxPayout).toBe(0);
  });

  it("combo count matches C(n, k): 5 legs in 3s = 10", () => {
    const rr = roundRobin([o(-110), o(120), o(150), o(-130), o(200)], 3, 5);
    expect(rr.combos).toHaveLength(10);
  });

  it("with unequal legs, which legs win changes the payout", () => {
    const rr = roundRobin([o(-300), o(-300), o(400), o(400)], 2, 10);
    expect(rr.scenarios[2].maxPayout).toBeGreaterThan(rr.scenarios[2].minPayout);
  });

  it("rejects invalid sizes and stakes", () => {
    expect(() => roundRobin([o(-110), o(-110)], 2, 10)).toThrow();
    expect(() => roundRobin(legs, 3, 10)).toThrow();
    expect(() => roundRobin(legs, 1, 10)).toThrow();
    expect(() => roundRobin(legs, 2, 0)).toThrow();
  });
});

describe("teaserOdds", () => {
  it("2-leg teaser at -120 needs ~73.85% per leg to break even", () => {
    const t = teaserOdds(120, o(-120), 2);
    expect(t.breakEvenAllLegs).toBeCloseTo(54.5455, 3);
    expect(t.breakEvenPerLeg).toBeCloseTo(73.8549, 3);
    expect(t.payout).toBeCloseTo(220, 6);
    expect(t.profit).toBeCloseTo(100, 6);
  });

  it("3-leg teaser at +180 needs ~70.95% per leg", () => {
    expect(teaserOdds(100, o(180), 3).breakEvenPerLeg).toBeCloseTo(70.9492, 3);
  });

  it("rejects bad stakes and leg counts", () => {
    expect(() => teaserOdds(0, o(-120), 2)).toThrow();
    expect(() => teaserOdds(10, o(-120), 1)).toThrow();
  });
});
