import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { BestOddsBoard } from "../BestOddsBoard";
import type { HubBoard } from "@/lib/hub/types";

const board: HubBoard = {
  league: "nfl",
  updated: "2026-11-09T04:19:34+00:00",
  games: [
    {
      id: 7,
      home: "Chicago Bears",
      away: "Tampa Bay Buccaneers",
      start: "2026-11-09T18:00:00Z",
      vig: { h2h: 0.0312 },
      markets: {
        h2h: [
          { selection: "Chicago Bears", point: null, best: { book: "fanduel", decimal: 1.5, american: -200 }, books: { fanduel: 1.5, draftkings: 1.45, williamhill_us: 1.47 } },
          { selection: "Tampa Bay Buccaneers", point: null, best: { book: "draftkings", decimal: 2.8, american: 180 }, books: { draftkings: 2.8, fanduel: 2.7 } },
        ],
      },
    },
  ],
};

describe("BestOddsBoard", () => {
  // React inserts <!-- --> markers between adjacent text nodes; strip them to assert on visible text.
  const html = renderToString(createElement(BestOddsBoard, { board })).replace(/<!-- -->/g, "");

  it("shows the matchup, kickoff in ET, and best prices in American odds", () => {
    expect(html).toContain("Tampa Bay Buccaneers");
    expect(html).toContain("Chicago Bears");
    expect(html).toContain("1:00 PM ET");
    expect(html).toContain("-200");
    expect(html).toContain("+180");
  });

  it("labels books readably and offers a comparison", () => {
    expect(html).toContain("FanDuel");
    expect(html).toContain("Caesars");
    expect(html).toContain("Compare 3 books");
  });

  it("shows the best-price hold", () => {
    expect(html).toContain("Best-price hold 3.1%");
  });
});
