import { describe, expect, it } from "vitest";
import { oddsFromAmerican } from "../convert";
import { bonusBetConversion } from "../bonusbet";

describe("bonusBetConversion", () => {
  it("$100 bonus at +200, hedge at -220 -> $137.50 hedge stake, 62.5% conversion", () => {
    const result = bonusBetConversion(100, oddsFromAmerican(200), oddsFromAmerican(-220));
    expect(result.hedgeStake).toBeCloseTo(137.5, 2);
    expect(result.guaranteedCash).toBeCloseTo(62.5, 2);
    expect(result.conversionRate).toBeCloseTo(62.5, 2);
  });

  it("does NOT treat the bonus stake as returned (the #1 competitor bug)", () => {
    const result = bonusBetConversion(100, oddsFromAmerican(200), oddsFromAmerican(-220));
    // A calculator that wrongly returns the stake would compute winnings as
    // bonusAmount * decimal (300) instead of bonusAmount * (decimal - 1) (200),
    // producing a hedge stake of $206.25 and a conversion rate of 93.75%.
    expect(result.hedgeStake).not.toBeCloseTo(206.25, 1);
    expect(result.conversionRate).not.toBeCloseTo(93.75, 1);
  });

  it("guaranteed cash is identical whether the bonus bet or the hedge wins", () => {
    const bonusAmount = 100;
    const bonusOdds = oddsFromAmerican(200);
    const hedgeOdds = oddsFromAmerican(-220);
    const result = bonusBetConversion(bonusAmount, bonusOdds, hedgeOdds);

    const cashIfBonusWins =
      bonusAmount * (bonusOdds.decimal - 1) - result.hedgeStake;
    const cashIfHedgeWins = result.hedgeStake * hedgeOdds.decimal - result.hedgeStake;

    expect(cashIfBonusWins).toBeCloseTo(cashIfHedgeWins, 6);
    expect(cashIfBonusWins).toBeCloseTo(result.guaranteedCash, 6);
  });

  it("rejects a non-positive bonus amount", () => {
    expect(() => bonusBetConversion(0, oddsFromAmerican(200), oddsFromAmerican(-220))).toThrow();
    expect(() => bonusBetConversion(-50, oddsFromAmerican(200), oddsFromAmerican(-220))).toThrow();
  });
});
