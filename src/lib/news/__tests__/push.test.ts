import { describe, expect, it } from "vitest";
import { subscriptionKey } from "../push";

describe("subscriptionKey", () => {
  it("is deterministic for the same endpoint", () => {
    const endpoint = "https://fcm.googleapis.com/fcm/send/abc123";
    expect(subscriptionKey(endpoint)).toBe(subscriptionKey(endpoint));
  });

  it("differs for different endpoints", () => {
    const a = subscriptionKey("https://fcm.googleapis.com/fcm/send/abc123");
    const b = subscriptionKey("https://fcm.googleapis.com/fcm/send/xyz789");
    expect(a).not.toBe(b);
  });

  it("returns a bounded-length hex string safe as a Redis hash field", () => {
    const key = subscriptionKey("https://example.com/push/endpoint");
    expect(key).toMatch(/^[0-9a-f]+$/);
    expect(key.length).toBeLessThanOrEqual(32);
  });
});
