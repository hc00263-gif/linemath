import { Bet, BetResult } from "./types";

const KEY = "linemath:bets:v1";
const EMPTY: Bet[] = [];
const RESULTS: BetResult[] = ["pending", "win", "loss", "push"];

let cache: Bet[] | null = null;
const listeners = new Set<() => void>();

function isBet(value: unknown): value is Bet {
  if (!value || typeof value !== "object") return false;
  const b = value as Record<string, unknown>;
  return (
    typeof b.id === "string" &&
    typeof b.date === "string" &&
    typeof b.sport === "string" &&
    typeof b.type === "string" &&
    typeof b.description === "string" &&
    typeof b.odds === "number" &&
    Number.isFinite(b.odds) &&
    typeof b.stake === "number" &&
    b.stake > 0 &&
    RESULTS.includes(b.result as BetResult) &&
    (b.closingOdds === undefined || typeof b.closingOdds === "number")
  );
}

function read(): Bet[] {
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    cache = Array.isArray(parsed) ? parsed.filter(isBet) : [];
  } catch {
    cache = [];
  }
  return cache;
}

function emit() {
  listeners.forEach((listener) => listener());
}

/** useSyncExternalStore subscribe: also reacts to edits made in another tab. */
export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === KEY) {
      cache = null;
      emit();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export const getSnapshot = (): Bet[] => read();
export const getServerSnapshot = (): Bet[] => EMPTY;

/** Persists the full bet list. Storage failures (private mode, quota) are swallowed; the in-memory list still updates. */
export function saveBets(next: Bet[]): void {
  cache = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable — keep working in memory for this session */
  }
  emit();
}

export function newBetId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
