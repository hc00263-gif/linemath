/**
 * NFL fantasy points calculator. Pure math over a box-score stat line — no external
 * data source, same model as the odds library.
 */

export interface ScoringSettings {
  passYardPoints: number;
  passTouchdownPoints: number;
  interceptionPoints: number;
  rushYardPoints: number;
  rushTouchdownPoints: number;
  receptionPoints: number;
  receivingYardPoints: number;
  receivingTouchdownPoints: number;
  fumbleLostPoints: number;
  twoPointConversionPoints: number;
}

export interface StatLine {
  passYards: number;
  passTouchdowns: number;
  interceptions: number;
  rushYards: number;
  rushTouchdowns: number;
  receptions: number;
  receivingYards: number;
  receivingTouchdowns: number;
  fumblesLost: number;
  twoPointConversions: number;
}

export const STAT_LINE_FIELDS: (keyof StatLine)[] = [
  "passYards",
  "passTouchdowns",
  "interceptions",
  "rushYards",
  "rushTouchdowns",
  "receptions",
  "receivingYards",
  "receivingTouchdowns",
  "fumblesLost",
  "twoPointConversions",
];

export const EMPTY_STAT_LINE: StatLine = {
  passYards: 0,
  passTouchdowns: 0,
  interceptions: 0,
  rushYards: 0,
  rushTouchdowns: 0,
  receptions: 0,
  receivingYards: 0,
  receivingTouchdowns: 0,
  fumblesLost: 0,
  twoPointConversions: 0,
};

/** Standard (non-PPR): 1pt/25 pass yds, 1pt/10 rush or rec yds, 4pt pass TD, 6pt rush/rec TD, -2 INT/fumble. */
export const STANDARD_SCORING: ScoringSettings = {
  passYardPoints: 0.04,
  passTouchdownPoints: 4,
  interceptionPoints: -2,
  rushYardPoints: 0.1,
  rushTouchdownPoints: 6,
  receptionPoints: 0,
  receivingYardPoints: 0.1,
  receivingTouchdownPoints: 6,
  fumbleLostPoints: -2,
  twoPointConversionPoints: 2,
};

export const HALF_PPR_SCORING: ScoringSettings = { ...STANDARD_SCORING, receptionPoints: 0.5 };
export const PPR_SCORING: ScoringSettings = { ...STANDARD_SCORING, receptionPoints: 1 };

export type ScoringPreset = "standard" | "half-ppr" | "ppr" | "custom";

export const SCORING_PRESETS: Record<Exclude<ScoringPreset, "custom">, ScoringSettings> = {
  standard: STANDARD_SCORING,
  "half-ppr": HALF_PPR_SCORING,
  ppr: PPR_SCORING,
};

/**
 * Total fantasy points for a stat line under a given scoring format.
 * points = sum(stat[i] * scoring[i]) across every scored category.
 */
export function calculateFantasyPoints(stats: StatLine, scoring: ScoringSettings): number {
  return (
    stats.passYards * scoring.passYardPoints +
    stats.passTouchdowns * scoring.passTouchdownPoints +
    stats.interceptions * scoring.interceptionPoints +
    stats.rushYards * scoring.rushYardPoints +
    stats.rushTouchdowns * scoring.rushTouchdownPoints +
    stats.receptions * scoring.receptionPoints +
    stats.receivingYards * scoring.receivingYardPoints +
    stats.receivingTouchdowns * scoring.receivingTouchdownPoints +
    stats.fumblesLost * scoring.fumbleLostPoints +
    stats.twoPointConversions * scoring.twoPointConversionPoints
  );
}
