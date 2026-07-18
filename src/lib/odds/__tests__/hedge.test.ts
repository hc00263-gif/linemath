import { describe, expect, it } from "vitest";
import { oddsFromAmerican } from "../convert";
import { hedgeStake } from "../hedge";

describe("hedgeStake", () => {
  it("$100 at +300, hedge at -150 -> $240 hedge stake, $60 guaranteed both sides", () => {
    const result = hedgeStake(100, oddsFromAmerican(300), oddsFromAmerican(-150));
    expect(result.hedgeStake).toBeCloseTo(240, 2);
    expect(result.guaranteedProfit).toBeCloseTo(60, 2);
    // Profit must be identical to the cent regardless of which side wins.
    expect(result.profitIfOriginalWins).toBeCloseTo(result.profitIfHedgeWins, 10);
    expect(result.profitIfOriginalWins).toBeCloseTo(60, 2);
    expect(result.profitIfHedgeWins).toBeCloseTo(60, 2);
  });

  it("rejects a non-positive original stake", () => {
    expect(() => hedgeStake(0, oddsFromAmerican(300), oddsFromAmerican(-150))).toThrow();
    expect(() => hedgeStake(-10, oddsFromAmerican(300), oddsFromAmerican(-150))).toThrow();
  });
});
