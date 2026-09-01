import { describe, expect, it } from "vitest";
import { newsItemId } from "../rss";

describe("newsItemId", () => {
  it("is deterministic for the same link", () => {
    const link = "https://www.espn.com/nfl/story/_/id/12345/some-headline";
    expect(newsItemId(link)).toBe(newsItemId(link));
  });

  it("differs for different links", () => {
    const a = newsItemId("https://www.espn.com/nfl/story/_/id/1/a");
    const b = newsItemId("https://www.espn.com/nfl/story/_/id/2/b");
    expect(a).not.toBe(b);
  });

  it("returns a hex string", () => {
    expect(newsItemId("https://example.com/x")).toMatch(/^[0-9a-f]+$/);
  });
});
