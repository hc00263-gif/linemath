import { Player, PlayerStat, TeamSportId } from "../types";

/** Sports with a confirmed, mapped API-Sports player-search endpoint. NHL and MLB use a
 * different endpoint convention (no plain `search` query param) and aren't wired yet. */
export const REAL_PLAYER_SPORTS: TeamSportId[] = ["nfl", "nba"];

const BASE_URLS: Partial<Record<TeamSportId, string>> = {
  nfl: "https://v1.american-football.api-sports.io",
  nba: "https://v2.nba.api-sports.io",
};

interface ApiSportsResponse<T> {
  response: T[];
  errors: unknown;
}

async function apiSportsFetch<T>(sport: TeamSportId, path: string): Promise<ApiSportsResponse<T>> {
  const key = process.env.API_SPORTS_KEY;
  const baseUrl = BASE_URLS[sport];
  if (!key || !baseUrl) {
    throw new Error(`No API-Sports configuration for sport: ${sport}`);
  }
  const res = await fetch(`${baseUrl}${path}`, {
    headers: { "x-apisports-key": key },
    next: { revalidate: 3600 },
  });
  if (!res.ok) {
    throw new Error(`API-Sports request failed (${res.status}) for ${sport} ${path}`);
  }
  return res.json();
}

function statsFrom(entries: (PlayerStat | null)[]): PlayerStat[] {
  return entries.filter((entry): entry is PlayerStat => entry !== null);
}

interface RawNflPlayer {
  id: number;
  name: string;
  age?: number;
  height?: string;
  weight?: string;
  college?: string;
  position?: string;
  experience?: number;
  image?: string;
}

function mapNflPlayer(raw: RawNflPlayer): Player {
  return {
    id: `nfl-${raw.id}`,
    sport: "nfl",
    name: raw.name,
    team: null,
    position: raw.position,
    photo: raw.image,
    stats: statsFrom([
      raw.age != null ? { label: "Age", value: String(raw.age) } : null,
      raw.height ? { label: "Height", value: raw.height } : null,
      raw.weight ? { label: "Weight", value: raw.weight } : null,
      raw.college ? { label: "College", value: raw.college } : null,
      raw.experience != null ? { label: "Experience", value: `${raw.experience} yrs` } : null,
    ]),
  };
}

interface RawNbaPlayer {
  id: number;
  firstname: string;
  lastname: string;
  college?: string;
  height?: { feets?: string; inches?: string };
  weight?: { pounds?: string };
  nba?: { pro?: number };
  leagues?: { standard?: { pos?: string } };
}

function mapNbaPlayer(raw: RawNbaPlayer): Player {
  const feet = raw.height?.feets;
  const inches = raw.height?.inches;
  return {
    id: `nba-${raw.id}`,
    sport: "nba",
    name: `${raw.firstname} ${raw.lastname}`,
    team: null,
    position: raw.leagues?.standard?.pos,
    stats: statsFrom([
      feet && inches ? { label: "Height", value: `${feet}'${inches}"` } : null,
      raw.weight?.pounds ? { label: "Weight", value: `${raw.weight.pounds} lbs` } : null,
      raw.college ? { label: "College", value: raw.college } : null,
      raw.nba?.pro != null ? { label: "NBA Experience", value: `${raw.nba.pro} yrs` } : null,
    ]),
  };
}

/** Real API-Sports player search — NFL and NBA only (see REAL_PLAYER_SPORTS). */
export async function searchPlayersReal(sport: TeamSportId, query: string): Promise<Player[]> {
  if (sport === "nfl") {
    const data = await apiSportsFetch<RawNflPlayer>("nfl", `/players?search=${encodeURIComponent(query)}`);
    return data.response.map(mapNflPlayer);
  }
  if (sport === "nba") {
    const data = await apiSportsFetch<RawNbaPlayer>("nba", `/players?search=${encodeURIComponent(query)}`);
    return data.response.map(mapNbaPlayer);
  }
  return [];
}

/** Real API-Sports player detail lookup by our prefixed id (e.g. "nfl-1197"). */
export async function getPlayerReal(sport: TeamSportId, id: string): Promise<Player | null> {
  const numericId = id.split("-").pop();
  if (sport === "nfl") {
    const data = await apiSportsFetch<RawNflPlayer>("nfl", `/players?id=${numericId}`);
    return data.response[0] ? mapNflPlayer(data.response[0]) : null;
  }
  if (sport === "nba") {
    const data = await apiSportsFetch<RawNbaPlayer>("nba", `/players?id=${numericId}`);
    return data.response[0] ? mapNbaPlayer(data.response[0]) : null;
  }
  return null;
}
