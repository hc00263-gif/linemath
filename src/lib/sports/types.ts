/** The four team sports with live API-Sports coverage in this phase. */
export type TeamSportId = "nba" | "nfl" | "nhl" | "mlb";

/** All sports surfaced on the calendar, including tennis (dates-only, no live API). */
export type SportId = TeamSportId | "tennis";

export interface Team {
  id: string;
  name: string;
  abbreviation?: string;
  logo?: string;
}

export type GameStatus = "scheduled" | "live" | "final" | "postponed";

export interface Game {
  id: string;
  sport: TeamSportId;
  league: string;
  startTime: string;
  status: GameStatus;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number | null;
  awayScore: number | null;
  venue?: string;
}

export interface PlayerStat {
  label: string;
  value: string;
}

export interface Player {
  id: string;
  sport: TeamSportId;
  name: string;
  team: Team | null;
  position?: string;
  photo?: string;
  stats?: PlayerStat[];
}

/** A tennis major's tournament window — dates-only, hand-maintained, no live API in this phase. */
export interface TennisMajor {
  id: string;
  name: string;
  tour: "ATP" | "WTA" | "Both";
  startDate: string;
  endDate: string;
  location: string;
}
