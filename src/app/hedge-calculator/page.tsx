import type { Metadata } from "next";
import { HedgeCalculator } from "@/components/calculators/HedgeCalculator";
import { CalculatorPageShell } from "@/components/layout/CalculatorPageShell";
import { getCalculator } from "@/lib/calculators";

const meta = getCalculator("hedge-calculator")!;

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: `/${meta.slug}` },
};

const faq = [
  {
    question: "What does hedging a bet mean?",
    answer:
      "Hedging means betting the opposite side of your original bet, usually after the line has moved in your favor, so that you profit (or minimize a loss) no matter which side wins.",
  },
  {
    question: "How is the hedge stake calculated?",
    answer:
      "The hedge stake is your original bet's total potential payout divided by the hedge odds' decimal value. That sizing is what makes the profit identical regardless of which side wins.",
  },
  {
    question: "Is the profit really guaranteed?",
    answer:
      "The math is exact, but real-world execution risk exists — bet limits, line movement between placing your two bets, and the rare bet cancellation can all affect the outcome before it locks in.",
  },
];

export default function HedgeCalculatorPage() {
  return (
    <CalculatorPageShell
      h1="Hedge Calculator — Lock In Guaranteed Profit"
      slug={meta.slug}
      category="hedge"
      schemaDescription={meta.description}
      calculator={<HedgeCalculator />}
      faq={faq}
      explainer={
        <>
          <p>
            Enter your original stake and odds, plus the odds now available on the other side,
            and this tool finds the exact hedge stake that locks in an equal profit before
            limits, line movement, and bet cancellation risk — no matter which side wins.
          </p>
          <p>
            <strong>Worked example:</strong> $100 at +300 (a $400 potential payout), hedged at
            -150, calls for a $240 hedge stake — locking in $60 of profit regardless of the
            outcome.
          </p>
        </>
      }
    />
  );
}
