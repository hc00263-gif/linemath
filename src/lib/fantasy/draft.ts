/**
 * Snake draft pick order calculator. Pure logic — number of teams and rounds in,
 * full pick order out. No external data source.
 */

export interface DraftPick {
  round: number;
  pickInRound: number;
  overallPick: number;
  teamSlot: number;
}

const MIN_TEAMS = 2;
const MAX_TEAMS = 32;
const MIN_ROUNDS = 1;
const MAX_ROUNDS = 40;

function assertValidDraft(teams: number, rounds: number, teamSlot?: number): void {
  if (!Number.isInteger(teams) || teams < MIN_TEAMS || teams > MAX_TEAMS) {
    throw new Error(`Invalid team count: ${teams}. Must be an integer between ${MIN_TEAMS} and ${MAX_TEAMS}.`);
  }
  if (!Number.isInteger(rounds) || rounds < MIN_ROUNDS || rounds > MAX_ROUNDS) {
    throw new Error(`Invalid round count: ${rounds}. Must be an integer between ${MIN_ROUNDS} and ${MAX_ROUNDS}.`);
  }
  if (teamSlot !== undefined && (!Number.isInteger(teamSlot) || teamSlot < 1 || teamSlot > teams)) {
    throw new Error(`Invalid draft slot: ${teamSlot}. Must be an integer between 1 and ${teams}.`);
  }
}

/**
 * Direction for a given round.
 * Standard snake: alternates every round (1 forward, 2 reverse, 3 forward, ...).
 * Third-round-reversal (3RR): round 3 repeats round 2's direction instead of flipping
 * back, which balances out the back-to-back-picks advantage the last team in round 1
 * gets in round 2 — rounds 4+ then resume normal alternation.
 */
function directionForRound(round: number, thirdRoundReversal: boolean): "forward" | "reverse" {
  if (!thirdRoundReversal || round <= 2) {
    return round % 2 === 1 ? "forward" : "reverse";
  }
  if (round === 3) return "reverse";
  return (round - 3) % 2 === 1 ? "forward" : "reverse";
}

/** Full pick-by-pick draft order for every team, every round. */
export function generateSnakeDraftOrder(
  teams: number,
  rounds: number,
  thirdRoundReversal = false
): DraftPick[] {
  assertValidDraft(teams, rounds);
  const picks: DraftPick[] = [];
  let overallPick = 0;
  for (let round = 1; round <= rounds; round++) {
    const direction = directionForRound(round, thirdRoundReversal);
    for (let i = 0; i < teams; i++) {
      overallPick++;
      const teamSlot = direction === "forward" ? i + 1 : teams - i;
      picks.push({ round, pickInRound: i + 1, overallPick, teamSlot });
    }
  }
  return picks;
}

/** Just one team's picks across the whole draft, in order. */
export function getTeamPicks(
  teams: number,
  rounds: number,
  teamSlot: number,
  thirdRoundReversal = false
): DraftPick[] {
  assertValidDraft(teams, rounds, teamSlot);
  return generateSnakeDraftOrder(teams, rounds, thirdRoundReversal).filter(
    (pick) => pick.teamSlot === teamSlot
  );
}
