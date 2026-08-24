import { describe, expect, it } from "vitest";
import { getUpcomingTennisMajors } from "../tennisMajors";

describe("getUpcomingTennisMajors", () => {
  it("excludes majors that have already ended", () => {
    const majors = getUpcomingTennisMajors(new Date("2026-08-23"));
    expect(majors.every((m) => m.endDate >= "2026-08-23")).toBe(true);
    expect(majors.some((m) => m.name === "US Open" && m.startDate === "2026-08-30")).toBe(true);
    expect(majors.some((m) => m.name === "Australian Open" && m.startDate === "2026-01-18")).toBe(
      false
    );
  });

  it("sorts by start date ascending", () => {
    const majors = getUpcomingTennisMajors(new Date("2026-01-01"));
    for (let i = 1; i < majors.length; i++) {
      expect(majors[i].startDate >= majors[i - 1].startDate).toBe(true);
    }
  });
});
