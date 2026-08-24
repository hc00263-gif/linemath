import { describe, expect, it } from "vitest";
import { mockProvider } from "../providers/mock";

describe("mockProvider", () => {
  it("returns upcoming games for a sport", async () => {
    const games = await mockProvider.getUpcomingGames("nba");
    expect(games.length).toBeGreaterThan(0);
    expect(games.every((g) => g.sport === "nba")).toBe(true);
  });

  it("getGame returns null for an unknown id", async () => {
    expect(await mockProvider.getGame("nba", "does-not-exist")).toBeNull();
  });

  it("getGame returns the matching game", async () => {
    const games = await mockProvider.getUpcomingGames("nfl");
    const found = await mockProvider.getGame("nfl", games[0].id);
    expect(found?.id).toBe(games[0].id);
  });

  it("searchPlayers filters case-insensitively by name", async () => {
    const results = await mockProvider.searchPlayers("nba", "tatum");
    expect(results.length).toBe(1);
    expect(results[0].name).toBe("Jayson Tatum");
  });

  it("searchPlayers returns all players for an empty query", async () => {
    const all = await mockProvider.searchPlayers("mlb", "");
    expect(all.length).toBeGreaterThan(0);
  });

  it("getPlayer returns null for an unknown id", async () => {
    expect(await mockProvider.getPlayer("nhl", "nope")).toBeNull();
  });
});
