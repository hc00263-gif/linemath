import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { ImpliedProbabilityCalculator } from "@/components/calculators/ImpliedProbabilityCalculator";
import { CalculatorPageShell } from "@/components/layout/CalculatorPageShell";
import { Formula, H2, P } from "@/components/layout/Prose";
import { getCalculator } from "@/lib/calculators";

const meta = getCalculator("implied-probability-calculator")!;

export const metadata: Metadata = pageMetadata({ title: meta.title, description: meta.description, path: `/${meta.slug}` });

const faq = [
  {
    question: "What is implied probability?",
    answer:
      "Implied probability is the chance of winning that a set of odds represents: 1 divided by the decimal odds. +150 implies 40%, -110 implies 52.38%, and -200 implies 66.67%.",
  },
  {
    question: "How do I convert American odds to a percentage?",
    answer:
      "For negative odds, divide the odds (without the minus sign) by itself plus 100: 200 ÷ 300 = 66.67% at -200. For positive odds, divide 100 by the odds plus 100: 100 ÷ 250 = 40% at +150.",
  },
  {
    question: "Why does implied probability add up to more than 100%?",
    answer:
      "Because the sportsbook builds in a margin. Two -110 prices imply 52.38% each, 104.76% in total. The extra is the vig; remove it with the no-vig calculator to get true fair probabilities.",
  },
  {
    question: "How do I turn a probability into odds?",
    answer:
      "Fair decimal odds are 1 divided by the probability. A 60% chance is 1.667 decimal, or -150; a 25% chance is 4.00 decimal, or +300. Switch the tool to Probability → odds.",
  },
];

export default function ImpliedProbabilityCalculatorPage() {
  return (
    <CalculatorPageShell
      h1="Implied Probability Calculator — Odds to Win %"
      slug={meta.slug}
      category="implied-probability"
      schemaDescription={meta.description}
      calculator={<ImpliedProbabilityCalculator />}
      faq={faq}
      explainer={
        <>
          <P>
            Every set of odds is a claim about how likely something is. This implied probability calculator turns any American, decimal, or fractional price into the win percentage it implies, and works the other way too — enter a probability to get the fair odds.
          </P>
          <H2>The formulas</H2>
          <Formula>{`implied probability = 1 / decimal odds
negative American:  |odds| / (|odds| + 100)
positive American:  100 / (odds + 100)
fair decimal odds   = 1 / probability`}</Formula>
          <H2>Reference</H2>
          <Formula>{`+300 → 25.00%    +150 → 40.00%    +100 → 50.00%
-110 → 52.38%    -150 → 60.00%    -200 → 66.67%`}</Formula>
          <H2>Implied vs. true probability</H2>
          <P>
            Implied probability is what the price needs, not what is true. It includes the sportsbook&apos;s margin, so it overstates every outcome slightly. Strip that out with the <a className="underline" href="/no-vig-calculator">no-vig calculator</a>, measure it with the <a className="underline" href="/vig-calculator">vig calculator</a>, or read the guide on <a className="underline" href="/guides/how-to-read-american-odds">how to read American odds</a>.
          </P>
        </>
      }
    />
  );
}
