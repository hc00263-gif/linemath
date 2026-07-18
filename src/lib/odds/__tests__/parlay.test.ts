import { describe, expect, it } from "vitest";
import { oddsFromAmerican } from "../convert";
import { ParlayVoidError, parlayOdds, parlayPayout } from "../parlay";

function leg(american: number) {
  return { odds: oddsFromAmerican(american) };
}

describe("parlayOdds", () => {
  it("3 legs at -110 each combine to the exact decimal product", () => {
    const odds = parlayOdds([leg(-110), leg(-110), leg(-110)]);
    // (21/11)^3 computed at full double precision, not the brief's rounded 1.9091 shortcut.
    expect(odds.decimal).toBeCloseTo(6.9579263711495125, 10);
    expect(odds.american).toBe(596);
  });

  it("Packers -300 / Patriots -200 / Eagles -150 combine to ~+233", () => {
    const odds = parlayOdds([leg(-300), leg(-200), leg(-150)]);
    expect(odds.decimal).toBeCloseTo(3.3333333333, 6);
    expect(odds.american).toBe(233);
  });

  it("a pushed leg is dropped from the product (equivalent to 1.00)", () => {
    const withPush = parlayOdds([leg(-110), leg(-110), { odds: oddsFromAmerican(-110), push: true }]);
    const twoLeg = parlayOdds([leg(-110), leg(-110)]);
    expect(withPush.decimal).toBeCloseTo(twoLeg.decimal, 10);
  });

  it("supports at least 12 legs", () => {
    const legs = Array.from({ length: 12 }, () => leg(-110));
    const odds = parlayOdds(legs);
    expect(odds.decimal).toBeCloseTo(Math.pow(1 + 100 / 110, 12), 6);
  });

  it("rejects fewer than 2 legs", () => {
    expect(() => parlayOdds([leg(-110)])).toThrow();
  });

  it("throws ParlayVoidError when every leg pushes", () => {
    const allPushed = [
      { odds: oddsFromAmerican(-110), push: true },
      { odds: oddsFromAmerican(-110), push: true },
    ];
    expect(() => parlayOdds(allPushed)).toThrow(ParlayVoidError);
  });
});

describe("parlayPayout", () => {
  it("$100 stake on 3x -110 legs pays out the exact decimal product", () => {
    const result = parlayPayout(100, [leg(-110), leg(-110), leg(-110)]);
    expect(result.voided).toBe(false);
    expect(result.payout).toBeCloseTo(695.7926371149513, 6);
    expect(result.profit).toBeCloseTo(595.7926371149513, 6);
    expect(result.odds?.american).toBe(596);
  });

  it("rejects a non-positive stake", () => {
    expect(() => parlayPayout(0, [leg(-110), leg(-110)])).toThrow();
    expect(() => parlayPayout(-50, [leg(-110), leg(-110)])).toThrow();
  });

  it("refunds the stake when every leg pushes, instead of throwing", () => {
    const allPushed = [
      { odds: oddsFromAmerican(-110), push: true },
      { odds: oddsFromAmerican(-110), push: true },
      { odds: oddsFromAmerican(150), push: true },
    ];
    const result = parlayPayout(100, allPushed);
    expect(result.voided).toBe(true);
    expect(result.odds).toBeNull();
    expect(result.payout).toBe(100);
    expect(result.profit).toBe(0);
  });
});
