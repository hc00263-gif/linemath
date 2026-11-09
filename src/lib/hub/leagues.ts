/** Leagues the hub publishes, in display order. `slug` is the key used in Redis and in URLs. */
export const HUB_LEAGUES = [
  { slug: "nfl", label: "NFL", sport: "Football" },
  { slug: "nba", label: "NBA", sport: "Basketball" },
  { slug: "nhl", label: "NHL", sport: "Hockey" },
  { slug: "ncaaf", label: "College Football", sport: "Football" },
  { slug: "ufc", label: "UFC / MMA", sport: "MMA" },
] as const;

export type HubLeagueSlug = (typeof HUB_LEAGUES)[number]["slug"];

export function getHubLeague(slug: string) {
  return HUB_LEAGUES.find((l) => l.slug === slug);
}

const BOOK_LABELS: Record<string, string> = {
  draftkings: "DraftKings",
  fanduel: "FanDuel",
  betmgm: "BetMGM",
  williamhill_us: "Caesars",
  caesars: "Caesars",
  espnbet: "ESPN BET",
  bovada: "Bovada",
  unibet: "Unibet",
  unibet_us: "Unibet",
  pointsbet: "PointsBet",
  pointsbetus: "PointsBet",
  williamhill: "William Hill",
  betrivers: "BetRivers",
  hardrockbet: "Hard Rock Bet",
  fanatics: "Fanatics",
  pinnacle: "Pinnacle",
  betonlineag: "BetOnline",
  mybookieag: "MyBookie",
  lowvig: "LowVig",
  superbook: "SuperBook",
  wynnbet: "WynnBET",
  betus: "BetUS",
  bet365: "bet365",
  thescore: "theScore",
  fliff: "Fliff",
};

export function bookLabel(key: string): string {
  if (BOOK_LABELS[key]) return BOOK_LABELS[key];
  return key.replace(/[_.-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
