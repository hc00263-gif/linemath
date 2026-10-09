import { describe, expect, it } from "vitest";
import { betsToCsv, parseBetsCsv, splitCsv } from "../csv";
import { betClv, betProfit, cumulativeSeries, groupStats, oddsRange, summarize } from "../stats";
import { Bet } from "../types";

const bet = (over: Partial<Bet> = {}): Bet => ({
  id: "1",
  date: "2026-09-01",
  sport: "NFL",
  type: "Spread",
  description: "Test",
  odds: -110,
  stake: 110,
  result: "win",
  ...over,
});

describe("betProfit", () => {
  it("win at -110 on $110 profits $100; loss costs the stake; push and pending are 0", () => {
    expect(betProfit(bet())).toBeCloseTo(100, 6);
    expect(betProfit(bet({ result: "loss" }))).toBe(-110);
    expect(betProfit(bet({ result: "push" }))).toBe(0);
    expect(betProfit(bet({ result: "pending" }))).toBe(0);
  });
  it("win at +150 on $100 profits $150", () => {
    expect(betProfit(bet({ odds: 150, stake: 100 }))).toBeCloseTo(150, 6);
  });
});

describe("summarize", () => {
  const bets = [
    bet({ id: "a" }),
    bet({ id: "b", result: "loss" }),
    bet({ id: "c", result: "win", odds: 150, stake: 100 }),
    bet({ id: "d", result: "push" }),
    bet({ id: "e", result: "pending" }),
  ];
  it("counts the record and computes profit, ROI, and win %", () => {
    const s = summarize(bets);
    expect([s.wins, s.losses, s.pushes, s.pending, s.bets]).toEqual([2, 1, 1, 1, 5]);
    expect(s.staked).toBe(320);
    expect(s.profit).toBeCloseTo(100 - 110 + 150, 6);
    expect(s.roi).toBeCloseTo((140 / 320) * 100, 6);
    expect(s.winPercent).toBeCloseTo(66.667, 2);
  });
  it("returns nulls, not NaN, for an all-pending list", () => {
    const s = summarize([bet({ result: "pending" })]);
    expect(s.roi).toBeNull();
    expect(s.winPercent).toBeNull();
    expect(s.avgClv).toBeNull();
  });
  it("averages price CLV over bets with closing odds", () => {
    // +110 vs a -110 close: 2.10 / 1.909 - 1 = 10%
    expect(betClv(bet({ odds: 110, closingOdds: -110 }))).toBeCloseTo(10, 4);
    expect(betClv(bet())).toBeNull();
    const s = summarize([bet({ odds: 110, closingOdds: -110 }), bet({ odds: -110, closingOdds: -110 })]);
    expect(s.avgClv).toBeCloseTo(5, 4);
    expect(s.clvBets).toBe(2);
  });
});

describe("groups and series", () => {
  it("groups by key and sorts by profit", () => {
    const rows = groupStats(
      [bet({ sport: "NFL" }), bet({ sport: "NBA", result: "loss" }), bet({ sport: "NFL", result: "loss" })],
      (b) => b.sport
    );
    expect(rows.map((r) => r.key)).toEqual(["NFL", "NBA"]);
    expect(rows[0]).toMatchObject({ key: "NFL", bets: 2, wins: 1, losses: 1 });
  });
  it("buckets odds ranges", () => {
    expect(oddsRange(-250)).toMatch(/Heavy/);
    expect(oddsRange(-110)).toMatch(/Favorite/);
    expect(oddsRange(150)).toMatch(/small dog/);
    expect(oddsRange(300)).toMatch(/Underdog/);
  });
  it("builds a running profit series in date order, skipping pending", () => {
    const series = cumulativeSeries([
      bet({ id: "2", date: "2026-09-03", result: "loss" }),
      bet({ id: "1", date: "2026-09-01", result: "win" }),
      bet({ id: "3", date: "2026-09-02", result: "pending" }),
    ]);
    expect(series.map((p) => p.date)).toEqual(["2026-09-01", "2026-09-03"]);
    expect(series[0].cumulative).toBeCloseTo(100, 6);
    expect(series[1].cumulative).toBeCloseTo(-10, 6);
  });
});

describe("csv", () => {
  it("round-trips bets, including commas and quotes in descriptions", () => {
    const original = [bet({ description: 'Chiefs -3.5, "alt" line', closingOdds: -120 })];
    const parsed = parseBetsCsv(betsToCsv(original));
    expect(parsed.skipped).toBe(0);
    expect(parsed.bets[0]).toMatchObject({
      description: 'Chiefs -3.5, "alt" line',
      odds: -110,
      stake: 110,
      result: "win",
      closingOdds: -120,
    });
  });
  it("splits quoted multiline cells", () => {
    expect(splitCsv('a,"b\nc",d\n1,2,3\n')).toEqual([
      ["a", "b\nc", "d"],
      ["1", "2", "3"],
    ]);
  });
  it("matches columns by header name in any order and normalizes values", () => {
    const text = "Stake,Odds,Result,Date\n$50,+150,W,2026-09-01\n20,2.5,lost,2026-09-02\n";
    const { bets, skipped } = parseBetsCsv(text);
    expect(skipped).toBe(0);
    expect(bets[0]).toMatchObject({ stake: 50, odds: 150, result: "win" });
    expect(bets[1]).toMatchObject({ stake: 20, odds: 150, result: "loss", date: "2026-09-02" });
  });
  it("skips unreadable rows and reports why", () => {
    const { bets, skipped, problems } = parseBetsCsv(
      "date,odds,stake,result\n2026-09-01,abc,10,win\n2026-09-01,-110,0,win\n2026-09-01,-110,10,win\n"
    );
    expect(bets).toHaveLength(1);
    expect(skipped).toBe(2);
    expect(problems[0]).toMatch(/Line 2/);
  });
  it("rejects a file without the required columns", () => {
    const { bets, problems } = parseBetsCsv("foo,bar\n1,2\n");
    expect(bets).toHaveLength(0);
    expect(problems[0]).toMatch(/odds/);
  });
});
