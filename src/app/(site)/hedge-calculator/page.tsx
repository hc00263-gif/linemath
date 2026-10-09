import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { HedgeCalculator } from "@/components/calculators/HedgeCalculator";
import { CalculatorPageShell } from "@/components/layout/CalculatorPageShell";
import { Formula, H2, P, UL } from "@/components/layout/Prose";
import { getCalculator } from "@/lib/calculators";

const meta = getCalculator("hedge-calculator")!;

export const metadata: Metadata = pageMetadata({ title: meta.title, description: meta.description, path: `/${meta.slug}` });

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
  {
    question: "Should I always hedge a winning ticket?",
    answer:
      "Not necessarily. If you believe your original price still has positive expected value, hedging gives up some of that value in exchange for certainty. It’s a trade-off between variance and expected return.",
  },
  {
    question: "Can I hedge for a smaller loss instead of a profit?",
    answer:
      "Yes. If the line moved against you, a hedge can reduce the worst case; this calculator shows the guaranteed result of whichever hedge odds you enter, positive or negative.",
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
          <P>
            Enter your original stake and odds, plus the odds now available on the other side, and this hedge calculator finds the exact stake that locks in an equal result no matter which side wins.
          </P>
          <H2>The formula</H2>
          <Formula>{`total payout   = original stake × original decimal
hedge stake    = total payout / hedge decimal
guaranteed profit = total payout − original stake − hedge stake`}</Formula>
          <H2>Worked example</H2>
          <P>
            You bet $100 at +300 (a $400 total payout). The other side moves to -150. A $240 hedge locks in $60 either way: if your original wins, $400 − $100 − $240 = $60; if the hedge wins, $240 × 1.6667 = $400, and $400 − $340 = $60.
          </P>
          <H2>When hedging makes sense</H2>
          <UL>
            <li>You hold a futures or live ticket whose price has moved sharply in your favor.</li>
            <li>You want to guarantee a profit or cap a loss before a game ends.</li>
            <li>Remember a hedge gives up the upside — it is a risk decision, not a free profit.</li>
          </UL>
          <P>
            Guaranteed profit is before limits, line movement, and bet cancellation risk. Looking for a two-book split from scratch? Try the <a className="underline" href="/arbitrage-calculator">arbitrage calculator</a>.
          </P>
        </>
      }
    />
  );
}
