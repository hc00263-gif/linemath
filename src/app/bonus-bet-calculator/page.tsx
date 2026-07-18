import type { Metadata } from "next";
import { BonusBetCalculator } from "@/components/calculators/BonusBetCalculator";
import { CalculatorPageShell } from "@/components/layout/CalculatorPageShell";
import { getCalculator } from "@/lib/calculators";

const meta = getCalculator("bonus-bet-calculator")!;

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: `/${meta.slug}` },
};

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
          <p>
            Sportsbook promos hand out bonus bets (also called free bets) constantly, but they
            pay out winnings only — the stake is never returned. This calculator finds the hedge
            stake and guaranteed cash you&apos;d lock in by betting the other side, so you know
            exactly what a promo is really worth before you use it.
          </p>
          <p>
            <strong>Worked example:</strong> A $100 bonus bet at +200, hedged at -220, converts
            to $62.50 in guaranteed cash — a 62.5% conversion rate, with a $137.50 hedge stake.
          </p>
        </>
      }
    />
  );
}
