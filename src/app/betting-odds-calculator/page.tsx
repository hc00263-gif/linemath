import type { Metadata } from "next";
import { SingleBetCalculator } from "@/components/calculators/SingleBetCalculator";
import { CalculatorPageShell } from "@/components/layout/CalculatorPageShell";
import { getCalculator } from "@/lib/calculators";

const meta = getCalculator("betting-odds-calculator")!;

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: `/${meta.slug}` },
};

const faq = [
  {
    question: "How is my payout calculated?",
    answer:
      "Payout equals your stake multiplied by the decimal equivalent of your odds. At -110, decimal odds are 1.9091, so a $100 bet pays out $190.91 total — $90.91 profit plus your $100 stake back.",
  },
  {
    question: "Does the payout include my original stake?",
    answer:
      "Yes — \"Payout\" is your total return if the bet wins, stake included. \"Profit\" is what you actually gain: payout minus stake.",
  },
  {
    question: "What does implied probability tell me?",
    answer:
      "It's the win probability the odds represent. Comparing implied probability to your own estimate of a team's chances is the basis of finding value bets.",
  },
];

export default function BettingOddsCalculatorPage() {
  return (
    <CalculatorPageShell
      h1="Betting Odds Calculator — Payout & Profit"
      slug={meta.slug}
      category="single-bet"
      schemaDescription={meta.description}
      calculator={<SingleBetCalculator />}
      faq={faq}
      explainer={
        <>
          <p>
            Enter a stake and odds in any notation to see exactly what a single bet pays out —
            no mental math, no rounding errors. This is the calculation every parlay, hedge, and
            bonus bet tool on this site is built from.
          </p>
          <p>
            <strong>Worked example:</strong> A $100 bet at -110 (the standard vig on a spread or
            total) returns $190.91 total, for $90.91 profit, implying a 52.38% win probability.
          </p>
        </>
      }
    />
  );
}
