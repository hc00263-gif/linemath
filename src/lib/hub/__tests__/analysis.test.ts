import { describe, expect, it } from "vitest";
import { findArbs, findOutliers } from "../analysis";
import { ageHours, isStale } from "../store";
import type { HubGame, HubSide } from "../types";

const side = (selection: string, point: number | null, books: Record<string, number>): HubSide => {
  const best = Object.entries(books).sort((a, b) => b[1] - a[1])[0];
  return { selection, point, best: { book: best[0], decimal: best[1], american: null }, books };
};

const game = (markets: HubGame["markets"]): HubGame => ({
  id: 1,
  home: "Home FC",
  away: "Away FC",
  start: "2026-11-10T00:00:00Z",
  markets,
  vig: {},
});

describe("exchange and sanity filters", () => {
  it("ignores exchange prices when looking for arbs", () => {
    const g = game({
      h2h: [side("Home FC", null, { betfair_ex_eu: 2.9, dk: 1.8 }), side("Away FC", null, { dk: 1.9, fd: 1.9 })],
    });
    expect(findArbs([g])).toEqual([]);
  });

  it("drops an arb whose leg is far above a well-covered market", () => {
    const books = { a: 1.89, b: 1.9, c: 1.88, d: 1.9, odd: 2.12 };
    const g = game({ totals: [side("Over", 6.5, books), side("Under", 6.5, { x: 2.0, y: 1.9 })] });
    expect(findArbs([g])).toEqual([]);
  });
});

describe("findArbs", () => {
  it("finds a two-way moneyline arb across different books and computes profit", () => {
    const g = game({ h2h: [side("Home FC", null, { dk: 2.2, fd: 1.9 }), side("Away FC", null, { dk: 1.7, fd: 2.2 })] });
    const [arb] = findArbs([g]);
    expect(arb.market).toBe("h2h");
    expect(arb.arbPercent).toBeCloseTo((1 / 2.2 + 1 / 2.2) * 100, 6);
    expect(arb.profitPercent).toBeCloseTo((1 / (2 / 2.2) - 1) * 100, 6);
    expect(new Set(arb.legs.map((l) => l.book)).size).toBe(2);
  });

  it("returns nothing for a normal market with hold", () => {
    const g = game({ h2h: [side("Home FC", null, { dk: 1.91 }), side("Away FC", null, { dk: 1.91 })] });
    expect(findArbs([g])).toEqual([]);
  });

  it("ignores an arb whose legs all come from one book", () => {
    const g = game({ h2h: [side("Home FC", null, { dk: 2.2 }), side("Away FC", null, { dk: 2.2 })] });
    expect(findArbs([g])).toEqual([]);
  });

  it("drops implausibly large arbs (stale or bad data)", () => {
    const g = game({ h2h: [side("Home FC", null, { dk: 3.0 }), side("Away FC", null, { fd: 3.0 })] });
    expect(findArbs([g])).toEqual([]);
  });

  it("pairs totals at the same line only", () => {
    const g = game({
      totals: [side("Over", 44.5, { dk: 2.2 }), side("Under", 44.5, { fd: 2.2 }), side("Under", 45.5, { fd: 9.9 })],
    });
    const arbs = findArbs([g]);
    expect(arbs).toHaveLength(1);
    expect(arbs[0].legs.map((l) => l.point)).toEqual([44.5, 44.5]);
  });

  it("pairs spreads only at exactly opposite lines", () => {
    const g = game({
      spreads: [side("Home FC", -3.5, { dk: 2.2 }), side("Away FC", 3.5, { fd: 2.2 }), side("Away FC", 4.5, { fd: 9.9 })],
    });
    const arbs = findArbs([g]);
    expect(arbs).toHaveLength(1);
    expect(arbs[0].market).toBe("spreads");
  });
});

describe("findOutliers", () => {
  it("flags a price well above the rest of the market", () => {
    const g = game({ h2h: [side("Home FC", null, { a: 1.9, b: 1.91, c: 1.9, d: 1.92, e: 2.3 })] });
    const [o] = findOutliers([g]);
    expect(o.best.book).toBe("e");
    expect(o.marketMedian).toBeCloseTo(1.905, 3);
    expect(o.edgePercent).toBeGreaterThan(6);
  });

  it("needs enough books to call anything an outlier", () => {
    const g = game({ h2h: [side("Home FC", null, { a: 1.9, b: 2.5 })] });
    expect(findOutliers([g])).toEqual([]);
  });

  it("ignores ordinary line shopping differences", () => {
    const g = game({ h2h: [side("Home FC", null, { a: 1.9, b: 1.91, c: 1.92, d: 1.93, e: 1.95 })] });
    expect(findOutliers([g])).toEqual([]);
  });
});

describe("staleness", () => {
  const now = new Date("2026-11-10T00:00:00Z");
  it("treats timestamps with and without a zone the same", () => {
    expect(ageHours("2026-11-09T12:00:00+00:00", now)).toBeCloseTo(12, 6);
    expect(ageHours("2026-11-09T12:00:00", now)).toBeCloseTo(12, 6);
  });
  it("flags boards older than 36 hours", () => {
    expect(isStale("2026-11-09T12:00:00Z", now)).toBe(false);
    expect(isStale("2026-10-22T18:30:00Z", now)).toBe(true);
    expect(isStale("garbage", now)).toBe(true);
  });
});
