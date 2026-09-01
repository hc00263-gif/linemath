export interface SportsToolMeta {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
}

/** Single source of truth for sports-data tool routes/nav/homepage cards. */
export const SPORTS_TOOLS: SportsToolMeta[] = [
  {
    slug: "calendar",
    title: "Sports Calendar — NBA, NFL, NHL, MLB & Tennis Majors",
    shortTitle: "Calendar",
    description: "Upcoming games across every major US league, plus all four tennis majors.",
  },
  {
    slug: "matches",
    title: "Match Lookup",
    shortTitle: "Match Lookup",
    description: "Search upcoming and recent games across NBA, NFL, NHL, and MLB.",
  },
  {
    slug: "players",
    title: "Player Lookup",
    shortTitle: "Player Lookup",
    description: "Search players by name across NBA, NFL, NHL, and MLB.",
  },
  {
    slug: "news",
    title: "Sports News — NFL, NBA, NHL, Tennis, UFC & Soccer",
    shortTitle: "News",
    description: "Major breaking news across NFL, NBA, NHL, tennis majors, UFC, European soccer, and USA soccer.",
  },
];

export function getSportsTool(slug: string): SportsToolMeta | undefined {
  return SPORTS_TOOLS.find((tool) => tool.slug === slug);
}
