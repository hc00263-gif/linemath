import { Redis } from "@upstash/redis";
import { HUB_LEAGUES } from "./leagues";
import type { HubBoard, HubIndex } from "./types";

/** A board whose newest price is older than this is shown with a warning, never as current. */
export const STALE_AFTER_HOURS = 36;

let client: Redis | null = null;

export function isHubConfigured(): boolean {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

function getClient(): Redis {
  if (!client) {
    client = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  }
  return client;
}

async function readJson<T>(key: string): Promise<T | null> {
  if (!isHubConfigured()) return null;
  try {
    const raw = await getClient().get<T | string>(key);
    if (raw == null) return null;
    return (typeof raw === "string" ? JSON.parse(raw) : raw) as T;
  } catch {
    return null;
  }
}

export function getHubIndex(): Promise<HubIndex | null> {
  return readJson<HubIndex>("odds:v1:index");
}

export async function getHubBoard(league: string): Promise<HubBoard | null> {
  const board = await readJson<HubBoard>(`odds:v1:${league}`);
  return board && Array.isArray(board.games) ? board : null;
}

/** Every published league's board, skipping any that are missing. */
export async function getAllHubBoards(): Promise<HubBoard[]> {
  const boards = await Promise.all(HUB_LEAGUES.map((l) => getHubBoard(l.slug)));
  return boards.filter((b): b is HubBoard => b !== null);
}

export function ageHours(updatedIso: string, now: Date = new Date()): number {
  const t = Date.parse(updatedIso.endsWith("Z") || /[+-]\d\d:\d\d$/.test(updatedIso) ? updatedIso : `${updatedIso}Z`);
  return Number.isFinite(t) ? (now.getTime() - t) / 3_600_000 : Infinity;
}

export function isStale(updatedIso: string, now: Date = new Date()): boolean {
  return ageHours(updatedIso, now) > STALE_AFTER_HOURS;
}
