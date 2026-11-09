import { describe, expect, it } from "vitest";
import { etDay, selectTodayGames } from "../today";
import type { HubBoard, HubGame, HubSide } from "../types";

const side = (selection: string, books: Record<string, number>): HubSide => {
  const best = Object.entries(books).sort((a, b) => b[1] - a[1])[0];
  return { selection, point: null, best: { book: best[0], decimal: best[1], american: null }, books };
};
const game = (id: number, away: string, home: string, start: string, nBooks = 3, draw = false): HubGame => {
  const books = (p: number) => Object.fromEntries(Array.from({ length: nBooks }, (_, i) => [`b${i}`, p + i * 0.01]));
  const h2h = [side(away, books(1.9)), side(home, books(2.0)), ...(draw ? [side("Draw", books(3.3))] : [])];
  return { id, away, home, start, markets: { h2h }, vig: {} };
};
const NOW = new Date("2026-11-09T15:00:00Z"); // 10:00 ET Monday
const board = (league: string, games: HubGame[]): HubBoard => ({ league, updated: "2026-11-09T14:00:00Z", games });

describe("selectTodayGames", () => {
  it("keeps today's unstarted games and orders them by kickoff", () => {
    const b = board("nba", [game(1, "A", "B", "2026-11-10T00:30:00Z"), game(2, "C", "D", "2026-11-09T23:00:00Z"), game(3, "E", "F", "2026-11-09T12:00:00Z")]);
    const [lg] = selectTodayGames([b], NOW);
    expect(lg.isToday).toBe(true);
    expect(lg.dayLabel).toBe("Today");
    expect(lg.games.map((g) => g.id)).toEqual([2, 1]); // game 3 already started; 00:30Z is still 7:30 PM ET today
  });

  it("falls back to the next game day when nothing is left today", () => {
    const b = board("nfl", [game(1, "A", "B", "2026-11-15T18:00:00Z"), game(2, "C", "D", "2026-11-16T01:20:00Z")]);
    const [lg] = selectTodayGames([b], NOW);
    expect(lg.isToday).toBe(false);
    expect(lg.dayLabel).toBe("Sun, Nov 15");
    expect(lg.games.map((g) => g.id)).toEqual([1, 2]);
  });

  it("caps the list, prefers games priced by more books, and counts the rest", () => {
    const games = Array.from({ length: 9 }, (_, i) => game(i, `A${i}`, `H${i}`, `2026-11-09T${String(18 + (i % 4)).padStart(2, "0")}:00:00Z`, 2 + i));
    const [lg] = selectTodayGames([board("ncaaf", games)], NOW, 6);
    expect(lg.games).toHaveLength(6);
    expect(lg.more).toBe(3);
    expect(lg.games.map((g) => g.id).sort()).toEqual([3, 4, 5, 6, 7, 8]);
  });

  it("orders three-way markets away, draw, home", () => {
    const b = board("epl", [game(1, "Away FC", "Home FC", "2026-11-09T20:00:00Z", 3, true)]);
    expect(selectTodayGames([b], NOW)[0].games[0].sides.map((s) => s.label)).toEqual(["Away FC", "Draw", "Home FC"]);
  });

  it("skips stale boards and boards with nothing upcoming", () => {
    const stale: HubBoard = { league: "nhl", updated: "2026-11-01T00:00:00Z", games: [game(1, "A", "B", "2026-11-09T23:00:00Z")] };
    const past = board("ufc", [game(2, "C", "D", "2026-11-08T23:00:00Z")]);
    expect(selectTodayGames([stale, past], NOW)).toEqual([]);
  });

  it("uses the Eastern calendar day, not UTC", () => {
    expect(etDay(new Date("2026-11-10T03:30:00Z"))).toBe("2026-11-09");
  });
});
