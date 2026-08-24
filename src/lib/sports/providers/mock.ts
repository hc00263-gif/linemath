import { Game, Player, Team, TeamSportId } from "../types";
import { SportsProvider } from "../provider";

const TEAMS: Record<TeamSportId, Team[]> = {
  nba: [
    { id: "nba-bos", name: "Boston Celtics", abbreviation: "BOS" },
    { id: "nba-lal", name: "Los Angeles Lakers", abbreviation: "LAL" },
    { id: "nba-den", name: "Denver Nuggets", abbreviation: "DEN" },
    { id: "nba-mil", name: "Milwaukee Bucks", abbreviation: "MIL" },
  ],
  nfl: [
    { id: "nfl-kc", name: "Kansas City Chiefs", abbreviation: "KC" },
    { id: "nfl-sf", name: "San Francisco 49ers", abbreviation: "SF" },
    { id: "nfl-buf", name: "Buffalo Bills", abbreviation: "BUF" },
    { id: "nfl-dal", name: "Dallas Cowboys", abbreviation: "DAL" },
  ],
  nhl: [
    { id: "nhl-edm", name: "Edmonton Oilers", abbreviation: "EDM" },
    { id: "nhl-col", name: "Colorado Avalanche", abbreviation: "COL" },
    { id: "nhl-bos", name: "Boston Bruins", abbreviation: "BOS" },
    { id: "nhl-nyr", name: "New York Rangers", abbreviation: "NYR" },
  ],
  mlb: [
    { id: "mlb-lad", name: "Los Angeles Dodgers", abbreviation: "LAD" },
    { id: "mlb-nyy", name: "New York Yankees", abbreviation: "NYY" },
    { id: "mlb-atl", name: "Atlanta Braves", abbreviation: "ATL" },
    { id: "mlb-hou", name: "Houston Astros", abbreviation: "HOU" },
  ],
};

const PLAYERS: Record<TeamSportId, Player[]> = {
  nba: [
    {
      id: "nba-p1",
      sport: "nba",
      name: "Jayson Tatum",
      team: TEAMS.nba[0],
      position: "F",
      stats: [
        { label: "PPG", value: "27.1" },
        { label: "RPG", value: "8.4" },
        { label: "APG", value: "4.6" },
      ],
    },
    {
      id: "nba-p2",
      sport: "nba",
      name: "LeBron James",
      team: TEAMS.nba[1],
      position: "F",
      stats: [
        { label: "PPG", value: "25.2" },
        { label: "RPG", value: "7.5" },
        { label: "APG", value: "8.1" },
      ],
    },
    {
      id: "nba-p3",
      sport: "nba",
      name: "Nikola Jokic",
      team: TEAMS.nba[2],
      position: "C",
      stats: [
        { label: "PPG", value: "26.4" },
        { label: "RPG", value: "12.3" },
        { label: "APG", value: "9.0" },
      ],
    },
  ],
  nfl: [
    {
      id: "nfl-p1",
      sport: "nfl",
      name: "Patrick Mahomes",
      team: TEAMS.nfl[0],
      position: "QB",
      stats: [
        { label: "Pass Yds", value: "4183" },
        { label: "TD", value: "27" },
        { label: "INT", value: "11" },
      ],
    },
    {
      id: "nfl-p2",
      sport: "nfl",
      name: "Brock Purdy",
      team: TEAMS.nfl[1],
      position: "QB",
      stats: [
        { label: "Pass Yds", value: "4280" },
        { label: "TD", value: "31" },
        { label: "INT", value: "11" },
      ],
    },
  ],
  nhl: [
    {
      id: "nhl-p1",
      sport: "nhl",
      name: "Connor McDavid",
      team: TEAMS.nhl[0],
      position: "C",
      stats: [
        { label: "G", value: "32" },
        { label: "A", value: "68" },
        { label: "P", value: "100" },
      ],
    },
    {
      id: "nhl-p2",
      sport: "nhl",
      name: "Nathan MacKinnon",
      team: TEAMS.nhl[1],
      position: "C",
      stats: [
        { label: "G", value: "40" },
        { label: "A", value: "60" },
        { label: "P", value: "100" },
      ],
    },
  ],
  mlb: [
    {
      id: "mlb-p1",
      sport: "mlb",
      name: "Shohei Ohtani",
      team: TEAMS.mlb[0],
      position: "DH",
      stats: [
        { label: "AVG", value: ".310" },
        { label: "HR", value: "44" },
        { label: "RBI", value: "95" },
      ],
    },
    {
      id: "mlb-p2",
      sport: "mlb",
      name: "Aaron Judge",
      team: TEAMS.mlb[1],
      position: "OF",
      stats: [
        { label: "AVG", value: ".295" },
        { label: "HR", value: "52" },
        { label: "RBI", value: "110" },
      ],
    },
  ],
};

function isoOffset(days: number, hour: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
}

function buildGames(sport: TeamSportId, league: string): Game[] {
  const teams = TEAMS[sport];
  const pairs: [number, number][] = [
    [0, 1],
    [2, 3],
    [1, 2],
    [0, 3],
  ];
  return pairs.map(([home, away], i) => ({
    id: `${sport}-g${i + 1}`,
    sport,
    league,
    startTime: isoOffset(i, 19),
    status: i === 0 ? "live" : "scheduled",
    homeTeam: teams[home],
    awayTeam: teams[away],
    homeScore: i === 0 ? 58 : null,
    awayScore: i === 0 ? 61 : null,
  }));
}

const GAMES: Record<TeamSportId, Game[]> = {
  nba: buildGames("nba", "NBA"),
  nfl: buildGames("nfl", "NFL"),
  nhl: buildGames("nhl", "NHL"),
  mlb: buildGames("mlb", "MLB"),
};

/**
 * Deterministic fixture data standing in for API-Sports until real API keys are
 * configured (src/lib/sports/index.ts switches providers based on env vars). Every
 * page built against the SportsProvider interface works unchanged once a real,
 * API-Sports-backed provider replaces this one.
 */
export const mockProvider: SportsProvider = {
  async getUpcomingGames(sport, days = 14) {
    const cutoff = isoOffset(days, 23);
    return GAMES[sport].filter((game) => game.startTime <= cutoff);
  },
  async getGame(sport, id) {
    return GAMES[sport].find((game) => game.id === id) ?? null;
  },
  async searchPlayers(sport, query) {
    const q = query.trim().toLowerCase();
    if (!q) return PLAYERS[sport];
    return PLAYERS[sport].filter((player) => player.name.toLowerCase().includes(q));
  },
  async getPlayer(sport, id) {
    return PLAYERS[sport].find((player) => player.id === id) ?? null;
  },
};
