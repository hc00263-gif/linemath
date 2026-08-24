import { Game, Player, TeamSportId } from "./types";

/**
 * Uniform interface every sports data source implements — mock fixtures today,
 * API-Sports-backed providers once API keys are configured. Callers (pages,
 * components) only ever depend on this interface, never on a specific vendor.
 */
export interface SportsProvider {
  getUpcomingGames(sport: TeamSportId, days?: number): Promise<Game[]>;
  getGame(sport: TeamSportId, id: string): Promise<Game | null>;
  searchPlayers(sport: TeamSportId, query: string): Promise<Player[]>;
  getPlayer(sport: TeamSportId, id: string): Promise<Player | null>;
}

export const TEAM_SPORTS: TeamSportId[] = ["nba", "nfl", "nhl", "mlb"];

export const SPORT_LABELS: Record<TeamSportId, string> = {
  nba: "NBA",
  nfl: "NFL",
  nhl: "NHL",
  mlb: "MLB",
};
