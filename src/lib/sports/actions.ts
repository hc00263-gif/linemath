"use server";

import { getSportsProvider } from "./index";
import { Player, TeamSportId } from "./types";

/** Client-callable search — real data hits API-Sports server-side, key never reaches the browser. */
export async function searchPlayersAction(sport: TeamSportId, query: string): Promise<Player[]> {
  return getSportsProvider().searchPlayers(sport, query);
}
