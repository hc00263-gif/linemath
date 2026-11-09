import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { TodayGames } from "../TodayGames";
import type { TodayLeague } from "@/lib/hub/today";

const leagues: TodayLeague[] = [
  {
    slug: "nba",
    label: "NBA",
    dayLabel: "Today",
    isToday: true,
    more: 2,
    games: [
      {
        id: 1,
        away: "Spurs",
        home: "Suns",
        start: "2026-11-10T01:00:00Z",
        sides: [
          { label: "Spurs", decimal: 1.5, book: "draftkings" },
          { label: "Suns", decimal: 3.0, book: "espnbet" },
        ],
      },
    ],
  },
  { slug: "nhl", label: "NHL", dayLabel: "Today", isToday: true, more: 0, games: [] },
];

describe("TodayGames", () => {
  it("renders the first league's games with best prices and a link to the full board", () => {
    const html = renderToString(createElement(TodayGames, { leagues, updatedLabel: "prices as of test" })).replace(/<!-- -->/g, "");
    expect(html).toContain("Spurs");
    expect(html).toContain("-200");
    expect(html).toContain("+200");
    expect(html).toContain("DraftKings");
    expect(html).toContain('href="/best-odds/nba"');
    expect(html).toContain("See all 3 NBA games");
    expect(html).toContain("NHL");
  });
});
