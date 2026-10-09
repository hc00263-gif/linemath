import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { BonusBetCalculator } from "@/components/calculators/BonusBetCalculator";
import { CalculatorPageShell } from "@/components/layout/CalculatorPageShell";
import { Formula, H2, P, UL } from "@/components/layout/Prose";
import { getCalculator } from "@/lib/calculators";

const meta = getCalculator("bonus-bet-calculator")!;

export const metadata: Metadata = pageMetadata({ title: meta.title, description: meta.description, path: `/${meta.slug}` });

const faq = [
  {
    question: "Why is a bonus bet worth less than its face value?",
    answer:
      "Because a bonus or free bet doesn't return your stake if it wins — you only collect the winnings. A $100 free bet at +200 wins $200, not $300, which is why converting it to cash always recovers less than 100% of its face value.",
  },
  {
    question: "How is the conversion rate calculated?",
    answer:
      "We size a hedge bet on the opposing side so that the cash you end up with is identical whether the free bet or the hedge wins, then express that guaranteed cash as a percentage of the original bonus amount.",
  },
  {
    question: "What's a realistic conversion rate?",
    answer:
      "It depends entirely on how close the hedge odds are to a fair mirror of the bonus bet's odds. Tighter, closer-to-even markets convert at a higher rate; lopsided or heavily vigged matchups convert lower.",
  },
  {
    question: "Why is a bonus bet worth less than its face value?",
    answer:
      "Because a free bet doesn’t return your stake if it wins — you only collect the winnings. A $100 free bet at +200 wins $200, not $300, so a hedge can recover at most roughly 60–75% as cash.",
  },
  {
    question: "Is a profit boost the same as a bonus bet?",
    answer:
      "No. A profit boost raises the payout on a bet you place with your own money, so the stake is returned on a win. Use the betting odds calculator to price a boosted line.",
  },
];

export default function BonusBetCalculatorPage() {
  return (
    <CalculatorPageShell
      h1="Bonus Bet Calculator — Free Bet Conversion Calculator"
      slug={meta.slug}
      category="bonus-bet"
      schemaDescription={meta.description}
      calculator={<BonusBetCalculator />}
      faq={faq}
      explainer={
        <>
          <P>
            Sportsbook promos hand out bonus bets (also called free bets) constantly, but they pay out winnings only — the stake is never returned. This calculator finds the hedge stake and guaranteed cash you lock in by betting the other side, so you know what a promo is really worth.
          </P>
          <H2>The formula</H2>
          <Formula>{`winnings if bonus wins = bonus × (bonus decimal − 1)   ← stake NOT returned
hedge stake = winnings / hedge decimal
guaranteed cash = hedge stake × (hedge decimal − 1)
conversion rate = guaranteed cash / bonus × 100`}</Formula>
          <H2>Worked example</H2>
          <P>
            A $100 bonus bet at +200 wins $200 (not $300). Hedged at -220, the hedge stake is $137.50 and you lock in $62.50 either way — a 62.5% conversion. Hedge at a nearer-to-fair -200 and the same bonus converts at 66.67%.
          </P>
          <H2>Getting a better conversion</H2>
          <UL>
            <li>Use longer odds on the bonus side (+200 or more) — conversion rises with the underdog price.</li>
            <li>Find a tight market with low vig on the opposite side; see the <a className="underline" href="/vig-calculator">vig calculator</a>.</li>
            <li>Many calculators wrongly return the stake on a win and overstate conversion — this one doesn’t.</li>
          </UL>
        </>
      }
    />
  );
}
