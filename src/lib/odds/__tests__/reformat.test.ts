import { describe, expect, it } from "vitest";
import { retextOdds } from "../reformat";

describe("retextOdds", () => {
  it("converts american text to decimal text", () => {
    expect(retextOdds("-110", "american", "decimal")).toBe("1.91");
  });

  it("converts decimal text to american text", () => {
    expect(retextOdds("2.50", "decimal", "american")).toBe("+150");
  });

  it("converts american text to fractional text", () => {
    expect(retextOdds("+150", "american", "fractional")).toBe("3/2");
  });

  it("returns the value unchanged when from === to", () => {
    expect(retextOdds("-110", "american", "american")).toBe("-110");
  });

  it("returns the original text unchanged if it fails to parse", () => {
    expect(retextOdds("garbage", "american", "decimal")).toBe("garbage");
  });

  it("passes through empty strings", () => {
    expect(retextOdds("", "american", "decimal")).toBe("");
  });
});
