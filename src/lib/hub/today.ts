import { getHubLeague } from "./leagues";
import { isStale } from "./store";
import type { HubBoard } from "./types";

export interface TodaySide {
  label: string;
  decimal: number;
  book: string;
}

export interface TodayGame {
  id: string | number;
  away: string;
  home: string;
  start: string;
  /** Moneyline / 3-way best prices in away, (draw), home order. */
  sides: TodaySide[];
}

export interface TodayLeague {
  slug: string;
  label: string;
  /** "Today" or a weekday/date such as "Sat, Nov 14" when nothing is left today. */
  dayLabel: string;
  isToday: boolean;
  games: TodayGame[];
  /** Games on that day beyond the ones shown. */
  more: number;
}

const ET_DAY = new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit" });
const ET_LABEL = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", weekday: "short", month: "short", day: "numeric" });

function parse(iso: string): Date {
  return new Date(/[zZ]|[+-]\d\d:\d\d$/.test(iso) ? iso : `${iso}Z`);
}

/** Calendar day in US Eastern, as YYYY-MM-DD. */
export function etDay(d: Date): string {
  return ET_DAY.format(d);
}

export const MAX_GAMES_PER_LEAGUE = 6;
const LOOKAHEAD_DAYS = 7;

/**
 * Per league, the games for today (US Eastern) that have not started, or — when none are left —
 * the next day that has games. "Major" games are the ones the most books are pricing.
 */
export function selectTodayGames(boards: HubBoard[], now: Date = new Date(), max = MAX_GAMES_PER_LEAGUE): TodayLeague[] {
  const today = etDay(now);
  const horizon = now.getTime() + LOOKAHEAD_DAYS * 86_400_000;
  const out: TodayLeague[] = [];
  for (const board of boards) {
    if (isStale(board.updated, now)) continue;
    const upcoming = board.games
      .map((g) => ({ g, t: parse(g.start) }))
      .filter(({ g, t }) => t.getTime() > now.getTime() && t.getTime() <= horizon && (g.markets.h2h?.length ?? 0) >= 2);
    if (upcoming.length === 0) continue;
    const days = upcoming.map(({ t }) => etDay(t)).sort();
    const day = days[0];
    const ofDay = upcoming.filter(({ t }) => etDay(t) === day);

    const ranked = [...ofDay].sort((a, b) => bookCount(b.g) - bookCount(a.g) || a.t.getTime() - b.t.getTime());
    const shown = ranked.slice(0, max).sort((a, b) => a.t.getTime() - b.t.getTime());
    out.push({
      slug: board.league,
      label: getHubLeague(board.league)?.label ?? board.league.toUpperCase(),
      dayLabel: day === today ? "Today" : ET_LABEL.format(shown[0].t),
      isToday: day === today,
      games: shown.map(({ g }) => ({ id: g.id, away: g.away, home: g.home, start: g.start, sides: moneyline(g) })),
      more: Math.max(0, ofDay.length - shown.length),
    });
  }
  return out;
}

function bookCount(g: HubBoard["games"][number]): number {
  return Math.max(0, ...(g.markets.h2h ?? []).map((s) => Object.keys(s.books).length));
}

function moneyline(g: HubBoard["games"][number]): TodaySide[] {
  const rank = (sel: string) => (sel === g.away ? 0 : sel === "Draw" ? 1 : sel === g.home ? 2 : 3);
  return [...(g.markets.h2h ?? [])]
    .filter((s) => s.point == null)
    .sort((a, b) => rank(a.selection) - rank(b.selection))
    .map((s) => ({ label: s.selection, decimal: s.best.decimal, book: s.best.book }));
}
