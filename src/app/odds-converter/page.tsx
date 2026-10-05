import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { OddsConverterCalculator } from "@/components/calculators/OddsConverterCalculator";
import { CalculatorPageShell } from "@/components/layout/CalculatorPageShell";
import { Formula, H2, P, UL } from "@/components/layout/Prose";
import { getCalculator } from "@/lib/calculators";

const meta = getCalculator("odds-converter")!;

export const metadata: Metadata = pageMetadata({ title: meta.title, description: meta.description, path: `/${meta.slug}` });

const faq = [
  {
    question: "What's the difference between American, decimal, and fractional odds?",
    answer:
      "They're three ways of quoting the same payout. American odds show how much you win on a $100 bet (or how much you need to bet to win $100). Decimal odds show your total return per $1 staked, including your stake. Fractional odds show your profit as a ratio to your stake — 3/2 means you win $3 for every $2 wagered.",
  },
  {
    question: "How is implied probability calculated?",
    answer:
      "Implied probability is 1 divided by the decimal odds, shown as a percentage. It's the win probability the odds represent before accounting for the sportsbook's built-in margin (the vig).",
  },
  {
    question: "Why don't the implied probabilities on both sides of a game add up to 100%?",
    answer:
      "Because the book bakes in a margin, called the vig or juice. Add up the implied probability of both sides of a two-way market and you'll typically get somewhere around 104-107%, not 100%. Our no-vig calculator strips that margin out, and the vig calculator measures it.",
  },
  {
    question: "Why can’t American odds be between -100 and +100?",
    answer:
      "American odds are quoted as the amount you risk to win $100 (negative) or win on $100 (positive), so even money is +100 and the numbers jump straight from -100 to +100. Anything in between has no valid meaning, which is why this calculator rejects it.",
  },
  {
    question: "What is -110 in decimal odds?",
    answer:
      "-110 is 1.9091 in decimal (1 + 100/110), 10/11 in fractional, and a 52.38% implied probability.",
  },
  {
    question: "Are the conversions exact?",
    answer:
      "Yes. Everything is calculated at full precision and rounded only for display. Fractional odds use the simplest exact fraction, so -110 shows as 10/11 rather than a rounded 91/100.",
  },
];

export default function OddsConverterPage() {
  return (
    <CalculatorPageShell
      h1="Odds Converter — American, Decimal & Fractional"
      slug={meta.slug}
      category="odds-converter"
      schemaDescription={meta.description}
      calculator={<OddsConverterCalculator />}
      faq={faq}
      explainer={
        <>
          <P>
            American odds are the default at every US sportsbook, but decimal and fractional notation show up constantly — European books quote decimal, UK-influenced markets use fractional, and analysts talk in implied probability. This odds converter translates between all four instantly, with no rounding surprises, and shows the equivalents as you type.
          </P>
          <H2>How the conversion works</H2>
          <Formula>{`positive American:  decimal = 1 + odds / 100       (+150 → 2.50)
negative American:  decimal = 1 + 100 / |odds|     (-200 → 1.50)
fractional:         numerator/denominator = decimal − 1
implied probability = 1 / decimal`}</Formula>
          <H2>Reference table</H2>
          <Formula>{`American   Decimal   Fractional   Implied win %
+150       2.50      3/2          40.00%
+100       2.00      1/1          50.00%
-110       1.91      10/11        52.38%
-200       1.50      1/2          66.67%`}</Formula>
          <H2>Reading each format</H2>
          <UL>
            <li><strong>American:</strong> positive = profit on a $100 bet; negative = stake needed to profit $100.</li>
            <li><strong>Decimal:</strong> total return per $1 staked, stake included.</li>
            <li><strong>Fractional:</strong> profit relative to stake — 3/2 wins $3 for every $2 wagered.</li>
            <li><strong>Implied probability:</strong> the win chance the price needs to break even, before removing the sportsbook’s margin.</li>
          </UL>
          <P>
            New to American odds? Read the guide on <a className="underline" href="/guides/how-to-read-american-odds">how to read American odds</a>, then try the <a className="underline" href="/betting-odds-calculator">betting odds calculator</a> to turn any price into a payout.
          </P>
        </>
      }
    />
  );
}
