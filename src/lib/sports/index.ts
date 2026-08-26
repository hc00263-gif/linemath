import { mockProvider } from "./providers/mock";
import { REAL_PLAYER_SPORTS, getPlayerReal, searchPlayersReal } from "./providers/apiSports";
import { SportsProvider } from "./provider";
import { TeamSportId } from "./types";

const MIN_REAL_SEARCH_LENGTH = 3;

function hasRealPlayerData(sport: TeamSportId): boolean {
  return Boolean(process.env.API_SPORTS_KEY) && REAL_PLAYER_SPORTS.includes(sport);
}

/**
 * Game/schedule data is mock for every sport right now: API-Sports' free tier only
 * allows historical seasons (2022-2024), not the current season, so a real "upcoming
 * games" calendar isn't available without upgrading to a paid plan. Safe to call from
 * client components — reads no secrets.
 */
export function usingMockGames(): boolean {
  return true;
}

/**
 * True if player data for this sport is still mock. NFL and NBA are real (confirmed
 * free-tier accessible); NHL and MLB use a different API-Sports endpoint shape that
 * isn't mapped yet. Safe to call from client components — reads no secrets, just the
 * static list of sports with a mapped real provider.
 */
export function usingMockPlayers(sport: TeamSportId): boolean {
  return !REAL_PLAYER_SPORTS.includes(sport);
}

/**
 * Returns the active sports data provider. Games/schedules always come from the mock
 * provider for now (see usingMockGames). Player search/lookup routes to real
 * API-Sports data for NFL/NBA when API_SPORTS_KEY is configured, and falls back to
 * mock otherwise (missing key, or NHL/MLB not yet mapped).
 */
export function getSportsProvider(): SportsProvider {
  return {
    getUpcomingGames: mockProvider.getUpcomingGames,
    getGame: mockProvider.getGame,
    async searchPlayers(sport, query) {
      if (hasRealPlayerData(sport)) {
        if (query.trim().length < MIN_REAL_SEARCH_LENGTH) return [];
        return searchPlayersReal(sport, query);
      }
      return mockProvider.searchPlayers(sport, query);
    },
    async getPlayer(sport, id) {
      if (hasRealPlayerData(sport)) {
        return getPlayerReal(sport, id);
      }
      return mockProvider.getPlayer(sport, id);
    },
  };
}

export * from "./types";
export * from "./provider";
