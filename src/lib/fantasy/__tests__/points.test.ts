import { describe, expect, it } from "vitest";
import {
  EMPTY_STAT_LINE,
  HALF_PPR_SCORING,
  PPR_SCORING,
  STANDARD_SCORING,
  calculateFantasyPoints,
} from "../points";

describe("calculateFantasyPoints", () => {
  it("QB line: 300 pass yds, 3 pass TD, 1 INT, 10 rush yds -> 23 points (standard)", () => {
    const points = calculateFantasyPoints(
      { ...EMPTY_STAT_LINE, passYards: 300, passTouchdowns: 3, interceptions: 1, rushYards: 10 },
      STANDARD_SCORING
    );
    expect(points).toBeCloseTo(23, 4);
  });

  it("WR line: 8 rec, 120 rec yds, 1 rec TD -> 18 points standard, 26 points PPR", () => {
    const stats = { ...EMPTY_STAT_LINE, receptions: 8, receivingYards: 120, receivingTouchdowns: 1 };
    expect(calculateFantasyPoints(stats, STANDARD_SCORING)).toBeCloseTo(18, 4);
    expect(calculateFantasyPoints(stats, PPR_SCORING)).toBeCloseTo(26, 4);
  });

  it("half-PPR sits exactly between standard and full PPR for the same catch total", () => {
    const stats = { ...EMPTY_STAT_LINE, receptions: 10 };
    const standard = calculateFantasyPoints(stats, STANDARD_SCORING);
    const half = calculateFantasyPoints(stats, HALF_PPR_SCORING);
    const full = calculateFantasyPoints(stats, PPR_SCORING);
    expect(half).toBeCloseTo((standard + full) / 2, 4);
  });

  it("interceptions and lost fumbles are negative", () => {
    const points = calculateFantasyPoints(
      { ...EMPTY_STAT_LINE, interceptions: 2, fumblesLost: 1 },
      STANDARD_SCORING
    );
    expect(points).toBeCloseTo(-6, 4);
  });

  it("an empty stat line scores 0 under every preset", () => {
    expect(calculateFantasyPoints(EMPTY_STAT_LINE, STANDARD_SCORING)).toBe(0);
    expect(calculateFantasyPoints(EMPTY_STAT_LINE, PPR_SCORING)).toBe(0);
  });

  it("a two-point conversion adds exactly 2 points regardless of scoring format", () => {
    const stats = { ...EMPTY_STAT_LINE, twoPointConversions: 1 };
    expect(calculateFantasyPoints(stats, STANDARD_SCORING)).toBe(2);
    expect(calculateFantasyPoints(stats, PPR_SCORING)).toBe(2);
  });
});
