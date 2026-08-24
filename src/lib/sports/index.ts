import { mockProvider } from "./providers/mock";
import { SportsProvider } from "./provider";

/**
 * True until real API-Sports keys are configured. The UI shows a "Demo data" badge
 * whenever this is true so fixture data is never mistaken for a live schedule/score.
 */
export const usingMockData = !process.env.API_SPORTS_KEY;

/**
 * Returns the active sports data provider. Currently always the mock provider —
 * swap in a real API-Sports-backed implementation here once API_SPORTS_KEY is set.
 */
export function getSportsProvider(): SportsProvider {
  return mockProvider;
}

export * from "./types";
export * from "./provider";
