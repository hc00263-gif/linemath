import majorsJson from "@/content/tennis-majors.json";
import { TennisMajor } from "./types";

/**
 * Hand-maintained tournament windows for the four majors — no live API in this phase
 * since dates are fixed and known far in advance. Update this file once a year when
 * the next year's dates are announced (source: each major's official site).
 */
const TENNIS_MAJORS = majorsJson as TennisMajor[];

export function getUpcomingTennisMajors(fromDate: Date = new Date()): TennisMajor[] {
  const cutoff = fromDate.toISOString().slice(0, 10);
  return TENNIS_MAJORS.filter((major) => major.endDate >= cutoff).sort((a, b) =>
    a.startDate.localeCompare(b.startDate)
  );
}
