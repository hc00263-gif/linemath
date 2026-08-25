import { describe, expect, it } from "vitest";
import { generateSnakeDraftOrder, getTeamPicks } from "../draft";

describe("generateSnakeDraftOrder", () => {
  it("standard snake: round 1 forward, round 2 reverse, round 3 forward again", () => {
    const picks = generateSnakeDraftOrder(4, 3);
    const slotsByRound = (round: number) =>
      picks.filter((p) => p.round === round).map((p) => p.teamSlot);
    expect(slotsByRound(1)).toEqual([1, 2, 3, 4]);
    expect(slotsByRound(2)).toEqual([4, 3, 2, 1]);
    expect(slotsByRound(3)).toEqual([1, 2, 3, 4]);
  });

  it("overall pick numbers are sequential 1..teams*rounds", () => {
    const picks = generateSnakeDraftOrder(6, 4);
    expect(picks.map((p) => p.overallPick)).toEqual(
      Array.from({ length: 24 }, (_, i) => i + 1)
    );
  });

  it("third-round reversal: round 3 repeats round 2's direction, round 4 resumes alternation", () => {
    const picks = generateSnakeDraftOrder(4, 4, true);
    const slotsByRound = (round: number) =>
      picks.filter((p) => p.round === round).map((p) => p.teamSlot);
    expect(slotsByRound(1)).toEqual([1, 2, 3, 4]);
    expect(slotsByRound(2)).toEqual([4, 3, 2, 1]);
    expect(slotsByRound(3)).toEqual([4, 3, 2, 1]);
    expect(slotsByRound(4)).toEqual([1, 2, 3, 4]);
  });

  it("rejects an invalid team count", () => {
    expect(() => generateSnakeDraftOrder(1, 5)).toThrow();
    expect(() => generateSnakeDraftOrder(33, 5)).toThrow();
  });

  it("rejects an invalid round count", () => {
    expect(() => generateSnakeDraftOrder(10, 0)).toThrow();
  });
});

describe("getTeamPicks", () => {
  it("returns only the given team's picks, in draft order", () => {
    const picks = getTeamPicks(4, 3, 4);
    expect(picks.map((p) => p.overallPick)).toEqual([4, 5, 12]);
  });

  it("3RR balances the extremes: slot 1 and slot N have mirrored gaps between early picks", () => {
    const slot1 = getTeamPicks(4, 4, 1, true).map((p) => p.overallPick);
    const slot4 = getTeamPicks(4, 4, 4, true).map((p) => p.overallPick);
    // slot 1: picks 1, 8, 12, 13 -> gaps 7, 4, 1
    // slot 4: picks 4, 5, 9, 16 -> gaps 1, 4, 7 (mirrored)
    const gaps = (picks: number[]) => picks.slice(1).map((p, i) => p - picks[i]);
    expect(gaps(slot1)).toEqual([7, 4, 1]);
    expect(gaps(slot4)).toEqual([1, 4, 7]);
  });

  it("rejects an out-of-range draft slot", () => {
    expect(() => getTeamPicks(8, 5, 0)).toThrow();
    expect(() => getTeamPicks(8, 5, 9)).toThrow();
  });
});
