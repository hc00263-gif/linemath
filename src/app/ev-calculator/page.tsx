import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { EvCalculator } from "@/components/calculators/EvCalculator";
import { CalculatorPageShell } from "@/components/layout/CalculatorPageShell";
import { Formula, H2, P, UL } from "@/components/layout/Prose";
import { getCalculator } from "@/lib/calculators";

const meta = getCalculator("ev-calculator")!;

export const metadata: Metadata = pageMetadata({ title: meta.title, description: meta.description, path: `/${meta.slug}` });

const faq = [
  {
    question: "What is expected value (EV) in sports betting?",
    answer:
      "Expected value is the average amount you'd win or lose per bet if you placed the same bet many times. A positive-EV (+EV) bet is one where your estimated chance of winning is higher than the odds imply.",
  },
  {
    question: "How do I calculate EV?",
    answer:
      "EV = (probability of winning × profit if you win) − (probability of losing × your stake). For $100 at +120 with a 50% chance, that's 0.5 × $120 − 0.5 × $100 = +$10.",
  },
  {
    question: "Where does the win probability come from?",
    answer:
      "From you — that's the hard part. Common sources are a model, or the devigged price from a sharp sportsbook. Use the no-vig calculator to turn a market's odds into fair probabilities, then plug that in here.",
  },
  {
    question: "Does +EV mean I'll win this bet?",
    answer:
      "No. EV is a long-run average. A +EV bet still loses often; the edge only shows up across many bets, and only if your probability estimate is accurate.",
  },
];

export default function EvCalculatorPage() {
  return (
    <CalculatorPageShell
      h1="EV Calculator — Sports Betting Expected Value"
      slug={meta.slug}
      category="ev"
      schemaDescription={meta.description}
      calculator={<EvCalculator />}
      faq={faq}
      explainer={
        <>
          <P>
            Expected value is the foundation of sharp betting: the question isn&apos;t &quot;will this win?&quot; but &quot;is the price
            right?&quot; Enter your stake, the odds, and your own estimated win probability to see the bet&apos;s EV in dollars and as a
            percentage of your stake.
          </P>
          <H2>The formula</H2>
          <Formula>{`profit if win = stake × (decimal − 1)
EV            = p × profit − (1 − p) × stake
EV %          = EV / stake
break-even p  = 1 / decimal`}</Formula>
          <H2>Worked example</H2>
          <P>
            A $110 bet at -110 with a 55% chance of winning: profit if it wins is $100, so EV = 0.55 × $100 − 0.45 × $110 = +$5.50,
            or +5% of the stake. The break-even probability at -110 is 52.38%, so a 55% estimate is a 2.62-point edge.
          </P>
          <H2>How to use it well</H2>
          <UL>
            <li>Get a fair probability by devigging a sharp line with the no-vig calculator.</li>
            <li>Size a +EV bet with the Kelly calculator rather than guessing.</li>
            <li>Remember EV is only as accurate as your probability. Small errors turn a &quot;+EV&quot; bet into a losing one.</li>
          </UL>
          <P>This tool is informational, not betting advice. Verify all payouts with your sportsbook.</P>
        </>
      }
    />
  );
}
