import { describe, expect, it } from "vitest";
import { oddsFromAmerican } from "../convert";
import { holdPercent } from "../vig";
import { noVig2Way, noVig3Way } from "../novig";
import { evCalc } from "../ev";
import { kellyFraction } from "../kelly";
import { arbStakes } from "../arbitrage";

const o = oddsFromAmerican;

describe("holdPercent", () => {
  it("-110 / -110 -> overround 4.76%, hold 4.545%", () => {
    const result = holdPercent([o(-110), o(-110)]);
    expect(result.totalImplied).toBeCloseTo(104.7619, 3);
    expect(result.overround).toBeCloseTo(4.7619, 3);
    expect(result.hold).toBeCloseTo(4.5455, 3);
  });

  it("a fair +100 / +100 market has zero margin", () => {
    const result = holdPercent([o(100), o(100)]);
    expect(result.overround).toBeCloseTo(0, 10);
    expect(result.hold).toBeCloseTo(0, 10);
  });

  it("supports a three-way market", () => {
    const result = holdPercent([o(150), o(230), o(180)]);
    expect(result.totalImplied).toBeGreaterThan(100);
  });

  it("rejects a single-outcome market", () => {
    expect(() => holdPercent([o(-110)])).toThrow();
  });
});

describe("noVig2Way", () => {
  it("-110 / -110 -> fair 50/50, +100 / +100", () => {
    const result = noVig2Way(o(-110), o(-110));
    expect(result.fairProbabilities[0]).toBeCloseTo(50, 8);
    expect(result.fairProbabilities[1]).toBeCloseTo(50, 8);
    expect(result.fairOdds[0].american).toBe(100);
    expect(result.fairOdds[1].american).toBe(100);
    expect(result.hold).toBeCloseTo(4.5455, 3);
  });

  it("-200 / +170 -> fair 64.29% / 35.71%, -180 / +180, hold 3.57%", () => {
    const result = noVig2Way(o(-200), o(170));
    expect(result.fairProbabilities[0]).toBeCloseTo(64.2857, 3);
    expect(result.fairProbabilities[1]).toBeCloseTo(35.7143, 3);
    expect(result.fairOdds[0].american).toBe(-180);
    expect(result.fairOdds[1].american).toBe(180);
    expect(result.hold).toBeCloseTo(3.5714, 3);
  });

  it("fair probabilities always sum to exactly 100", () => {
    const result = noVig2Way(o(-135), o(115));
    expect(result.fairProbabilities[0] + result.fairProbabilities[1]).toBeCloseTo(100, 10);
  });
});

describe("noVig3Way", () => {
  it("fair probabilities sum to 100 across three outcomes", () => {
    const result = noVig3Way(o(150), o(230), o(180));
    const total = result.fairProbabilities.reduce((a, b) => a + b, 0);
    expect(total).toBeCloseTo(100, 10);
    expect(result.fairOdds).toHaveLength(3);
  });
});

describe("evCalc", () => {
  it("$100 at +120 with p=0.50 -> +$10 EV (10%)", () => {
    const result = evCalc(100, o(120), 0.5);
    expect(result.evDollars).toBeCloseTo(10, 8);
    expect(result.evPercent).toBeCloseTo(10, 8);
    expect(result.profitIfWin).toBeCloseTo(120, 8);
  });

  it("break-even probability equals the implied probability of the odds", () => {
    const result = evCalc(100, o(-110), 0.55);
    expect(result.breakEvenPercent).toBeCloseTo(52.381, 3);
    expect(result.edgePoints).toBeCloseTo(55 - 52.381, 3);
  });

  it("a coin-flip at -110 is a losing bet", () => {
    const result = evCalc(110, o(-110), 0.5);
    expect(result.evDollars).toBeLessThan(0);
  });

  it("rejects probabilities outside (0, 1) and non-positive stakes", () => {
    expect(() => evCalc(100, o(120), 0)).toThrow();
    expect(() => evCalc(100, o(120), 1)).toThrow();
    expect(() => evCalc(0, o(120), 0.5)).toThrow();
  });
});

describe("kellyFraction", () => {
  it("decimal 2.50, p=0.45 -> full Kelly 8.33% of bankroll", () => {
    const result = kellyFraction(o(150), 0.45, 1);
    expect(result.fullKelly).toBeCloseTo(0.083333, 5);
    expect(result.fraction).toBeCloseTo(0.083333, 5);
    expect(result.hasEdge).toBe(true);
  });

  it("half and quarter Kelly scale the full-Kelly fraction", () => {
    expect(kellyFraction(o(150), 0.45, 0.5).fraction).toBeCloseTo(0.083333 / 2, 5);
    expect(kellyFraction(o(150), 0.45, 0.25).fraction).toBeCloseTo(0.083333 / 4, 5);
  });

  it("probability below breakeven recommends exactly 0%, never negative", () => {
    const result = kellyFraction(o(150), 0.3, 1);
    expect(result.fraction).toBe(0);
    expect(result.fullKelly).toBe(0);
    expect(result.hasEdge).toBe(false);
  });

  it("rejects invalid probabilities", () => {
    expect(() => kellyFraction(o(150), 0)).toThrow();
    expect(() => kellyFraction(o(150), 1)).toThrow();
  });
});

describe("arbStakes", () => {
  it("+105 / -102 is a real arbitrage with equal payout either way", () => {
    const result = arbStakes(1000, o(105), o(-102));
    expect(result.hasArb).toBe(true);
    expect(result.arbPercent).toBeCloseTo(99.2755, 3);
    expect(result.stakes[0] + result.stakes[1]).toBeCloseTo(1000, 8);
    expect(result.stakes[0]).toBeCloseTo(491.3646, 3);
    expect(result.stakes[1]).toBeCloseTo(508.6354, 3);
    expect(result.profit).toBeCloseTo(7.2975, 3);
    // Equal profit on both outcomes, to the cent.
    const profitIfA = result.stakes[0] * o(105).decimal - 1000;
    const profitIfB = result.stakes[1] * o(-102).decimal - 1000;
    expect(profitIfA).toBeCloseTo(profitIfB, 8);
  });

  it("-110 / -110 correctly reports no arbitrage", () => {
    const result = arbStakes(1000, o(-110), o(-110));
    expect(result.hasArb).toBe(false);
    expect(result.profit).toBeLessThan(0);
  });

  it("supports a three-way arbitrage and stakes always sum to the total", () => {
    const result = arbStakes(900, o(300), o(300), o(300));
    expect(result.hasArb).toBe(true);
    expect(result.stakes.reduce((a, b) => a + b, 0)).toBeCloseTo(900, 8);
    expect(result.stakes).toHaveLength(3);
  });

  it("rejects a non-positive total stake", () => {
    expect(() => arbStakes(0, o(105), o(-102))).toThrow();
  });
});
