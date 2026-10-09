import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { SpreadConverterCalculator } from "@/components/calculators/SpreadConverterCalculator";
import { CalculatorPageShell } from "@/components/layout/CalculatorPageShell";
import { Formula, H2, P, UL } from "@/components/layout/Prose";
import { getCalculator } from "@/lib/calculators";

const meta = getCalculator("spread-to-moneyline-calculator")!;

export const metadata: Metadata = pageMetadata({ title: meta.title, description: meta.description, path: `/${meta.slug}` });

const faq = [
  {
    question: "How do you convert a point spread to a moneyline?",
    answer:
      "Estimate the favorite's chance of winning outright from the spread, then convert that probability to odds. This calculator treats the final scoring margin as a bell curve around the spread, which gives a fair (no-vig) moneyline estimate.",
  },
  {
    question: "How accurate is the conversion?",
    answer:
      "It is a statistical estimate, usually within a few percentage points of real markets, but it is weakest around NFL key numbers. Because 3 and 7 are such common margins, actual moneylines on 3- and 7-point favorites are typically somewhat steeper than the estimate. Treat it as a guide, not a price.",
  },
  {
    question: "What is a key number?",
    answer:
      "A final margin that occurs far more often than its neighbors. In the NFL, 3 and 7 are the big ones, which is why half a point around them is worth so much more than half a point elsewhere.",
  },
  {
    question: "Why are NFL and NBA different?",
    answer:
      "Basketball scores more and varies less game to game relative to the spread, so the same spread means a higher win probability in the NBA than in the NFL. The calculator uses a standard deviation of about 13.5 points for the NFL and 12 for the NBA.",
  },
];

export default function SpreadToMoneylineCalculatorPage() {
  return (
    <CalculatorPageShell
      h1="Spread to Moneyline Converter — NFL & NBA"
      slug={meta.slug}
      category="spread-moneyline"
      schemaDescription={meta.description}
      calculator={<SpreadConverterCalculator />}
      faq={faq}
      explainer={
        <>
          <P>
            A point spread and a moneyline are two prices on the same game. This converter estimates the fair moneyline for any NFL or NBA spread — and, going the other way, the spread implied by a pair of moneylines after the vig is removed.
          </P>
          <H2>How the estimate works</H2>
          <Formula>{`P(favorite wins) = Φ(points / σ)       σ ≈ 13.5 (NFL), 12 (NBA)
fair favorite odds = 1 / P
fair underdog odds = 1 / (1 − P)`}</Formula>
          <H2>Examples (estimates)</H2>
          <UL>
            <li>NFL -3: about a 58.8% favorite, fair moneyline ≈ -143 / +143.</li>
            <li>NFL -7: about 69.8%, fair moneyline ≈ -231 / +231.</li>
            <li>NBA -5: about 66.2%, fair moneyline ≈ -196 / +196.</li>
          </UL>
          <P>
            These are fair, no-vig numbers; real moneylines add margin, and around key numbers they run steeper than this model. For a market&apos;s true fair price, devig it with the <a className="underline" href="/no-vig-calculator">no-vig calculator</a>.
          </P>
        </>
      }
    />
  );
}
