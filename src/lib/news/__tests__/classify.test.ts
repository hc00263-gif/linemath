import { describe, expect, it } from "vitest";
import { parseClassifications } from "../classify";

describe("parseClassifications", () => {
  it("parses a clean JSON array", () => {
    const raw = '[{"id":"abc","isMajor":true,"summary":"Star player injured"}]';
    expect(parseClassifications(raw)).toEqual([{ id: "abc", isMajor: true, summary: "Star player injured" }]);
  });

  it("extracts a JSON array wrapped in prose or code fences", () => {
    const raw = 'Here you go:\n```json\n[{"id":"1","isMajor":false,"summary":""}]\n```\nHope that helps.';
    expect(parseClassifications(raw)).toEqual([{ id: "1", isMajor: false, summary: "" }]);
  });

  it("returns an empty array when no JSON array is present", () => {
    expect(parseClassifications("no json here")).toEqual([]);
  });

  it("drops malformed entries missing required fields", () => {
    const raw = '[{"id":"1"},{"id":"2","isMajor":true,"summary":"ok"}]';
    expect(parseClassifications(raw)).toEqual([{ id: "2", isMajor: true, summary: "ok" }]);
  });

  it("returns an empty array for invalid JSON", () => {
    expect(parseClassifications("[{not valid json}]")).toEqual([]);
  });
});
