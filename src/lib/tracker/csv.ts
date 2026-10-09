import { decimalToAmerican, parseOdds } from "../odds/convert";
import { Bet, BetResult } from "./types";

export const CSV_HEADER = ["date", "sport", "type", "description", "odds", "stake", "result", "closing_odds"];

function escapeCell(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

export function betsToCsv(bets: Bet[]): string {
  const rows = bets.map((b) =>
    [b.date, b.sport, b.type, b.description, String(b.odds), String(b.stake), b.result, b.closingOdds === undefined ? "" : String(b.closingOdds)]
      .map(escapeCell)
      .join(",")
  );
  return [CSV_HEADER.join(","), ...rows].join("\n") + "\n";
}

/** Splits CSV text into rows of cells, honoring quoted fields (commas, doubled quotes, newlines). */
export function splitCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (ch === '"') quoted = false;
      else cell += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") {
      row.push(cell);
      cell = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(cell);
      cell = "";
      if (row.some((c) => c.trim() !== "")) rows.push(row);
      row = [];
    } else cell += ch;
  }
  row.push(cell);
  if (row.some((c) => c.trim() !== "")) rows.push(row);
  return rows;
}

function normalizeResult(raw: string): BetResult | null {
  const v = raw.trim().toLowerCase();
  if (["", "pending", "open", "p", "tbd"].includes(v)) return "pending";
  if (["w", "win", "won", "1"].includes(v)) return "win";
  if (["l", "loss", "lost", "lose", "0"].includes(v)) return "loss";
  if (["push", "tie", "void", "refund"].includes(v)) return "push";
  return null;
}

function normalizeDate(raw: string): string | null {
  const v = raw.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
  const parsed = new Date(v);
  if (v === "" || Number.isNaN(parsed.getTime())) return null;
  return `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, "0")}-${String(parsed.getDate()).padStart(2, "0")}`;
}

/** American odds from "+150", "-110", "150", or decimal like "2.5". Null if invalid. */
function normalizeOdds(raw: string): number | null {
  const v = raw.trim();
  if (v === "") return null;
  try {
    if (v.includes(".")) return decimalToAmerican(parseOdds(v, "decimal").decimal);
    return parseOdds(v, "american").american;
  } catch {
    return null;
  }
}

export interface ImportResult {
  bets: Omit<Bet, "id">[];
  skipped: number;
  problems: string[];
}

/**
 * Parses a bet-history CSV. Columns are matched by header name (any order; extra columns ignored).
 * `odds` and `stake` are required; rows with unreadable required values are skipped and reported.
 */
export function parseBetsCsv(text: string): ImportResult {
  const rows = splitCsv(text);
  if (rows.length < 2) return { bets: [], skipped: 0, problems: ["No data rows found. The first row must be a header."] };
  const header = rows[0].map((h) => h.trim().toLowerCase().replace(/[\s-]+/g, "_"));
  const col = (...names: string[]) => header.findIndex((h) => names.includes(h));
  const idx = {
    date: col("date"),
    sport: col("sport", "league"),
    type: col("type", "bet_type", "market"),
    description: col("description", "bet", "pick", "selection"),
    odds: col("odds", "price"),
    stake: col("stake", "wager", "risk", "amount"),
    result: col("result", "status", "outcome"),
    closing: col("closing_odds", "closing", "close", "closing_line"),
  };
  if (idx.odds < 0 || idx.stake < 0) {
    return { bets: [], skipped: 0, problems: ["Missing required columns: the header row needs at least “odds” and “stake”."] };
  }
  const bets: Omit<Bet, "id">[] = [];
  const problems: string[] = [];
  let skipped = 0;
  rows.slice(1).forEach((cells, i) => {
    const line = i + 2;
    const get = (index: number) => (index >= 0 ? (cells[index] ?? "").trim() : "");
    const odds = normalizeOdds(get(idx.odds));
    const stake = Number(get(idx.stake).replace(/[$,]/g, ""));
    const result = normalizeResult(get(idx.result));
    const date = idx.date >= 0 ? normalizeDate(get(idx.date)) : new Date().toISOString().slice(0, 10);
    const reason =
      odds === null
        ? "unreadable odds"
        : !Number.isFinite(stake) || stake <= 0
          ? "stake must be a positive number"
          : result === null
            ? `unknown result “${get(idx.result)}”`
            : date === null
              ? "unreadable date"
              : null;
    if (reason || odds === null || result === null || date === null) {
      skipped++;
      if (problems.length < 5) problems.push(`Line ${line}: ${reason}.`);
      return;
    }
    const closing = get(idx.closing) === "" ? undefined : (normalizeOdds(get(idx.closing)) ?? undefined);
    bets.push({
      date,
      sport: get(idx.sport) || "Other",
      type: get(idx.type) || "Other",
      description: get(idx.description),
      odds,
      stake,
      result,
      ...(closing !== undefined ? { closingOdds: closing } : {}),
    });
  });
  return { bets, skipped, problems };
}
