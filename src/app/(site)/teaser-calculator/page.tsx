import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { TeaserCalculator } from "@/components/calculators/TeaserCalculator";
import { CalculatorPageShell } from "@/components/layout/CalculatorPageShell";
import { Formula, H2, P, UL } from "@/components/layout/Prose";
import { getCalculator } from "@/lib/calculators";

const meta = getCalculator("teaser-calculator")!;

export const metadata: Metadata = pageMetadata({ title: meta.title, description: meta.description, path: `/${meta.slug}` });

const faq = [
  {
    question: "What is a teaser bet?",
    answer:
      "A teaser is a parlay where you move the point spread or total in your favor on every leg — commonly 6, 6.5, or 7 points in football and 4, 4.5, or 5 points in basketball — in exchange for lower payout odds. Every leg still has to win.",
  },
  {
    question: "How are teaser payouts calculated?",
    answer:
      "The sportsbook posts a fixed payout for each number of teams, such as one price for a 2-team teaser and a longer one for a 3-team teaser. Payout = stake × the decimal of those odds. Prices vary by book, sport, and points, so enter the odds your book shows.",
  },
  {
    question: "What win rate do I need on each leg?",
    answer:
      "Take the break-even probability of the teaser odds and raise it to the power of 1 ÷ legs. A 2-team teaser at -120 breaks even at 54.55% for the whole ticket, which is about 73.85% per leg if both legs are equally likely.",
  },
  {
    question: "Does this calculator move the point spread for me?",
    answer:
      "No. It prices the ticket and shows the break-even rate; it doesn’t estimate how much extra win probability the extra points give you. That’s the judgment call every teaser comes down to.",
  },
];

export default function TeaserCalculatorPage() {
  return (
    <CalculatorPageShell
      h1="Teaser Calculator — Payout & Break-Even"
      slug={meta.slug}
      category="teaser"
      schemaDescription={meta.description}
      calculator={<TeaserCalculator />}
      faq={faq}
      explainer={
        <>
          <P>
            A teaser buys you extra points on every leg of a parlay, and you pay for them with a lower payout. Whether it’s a good bet depends on how much those points raise each leg’s chance of winning. Enter your stake, the number of teams, and the teaser odds your sportsbook shows to see the payout and the win rate each leg needs.
          </P>
          <H2>The formulas</H2>
          <Formula>{`payout              = stake × decimal(teaser odds)
break-even (ticket) = 1 / decimal
break-even per leg  = (1 / decimal) ^ (1 / legs)`}</Formula>
          <H2>Worked examples</H2>
          <UL>
            <li>$120 on a 2-team teaser at -120: $220 payout, $100 profit. Break-even is 54.55% for the ticket — about 73.85% per leg.</li>
            <li>A 3-team teaser at +180: each leg needs roughly 70.95% to break even.</li>
          </UL>
          <H2>How to use it</H2>
          <P>
            Compare the per-leg break-even with your honest estimate of how often each leg covers at the teased number. If you can’t reliably beat it, the teaser is just a parlay with a higher hold. Compare against a straight parlay on the <a className="underline" href="/parlay-calculator">parlay calculator</a>, or measure the margin with the <a className="underline" href="/vig-calculator">vig calculator</a>.
          </P>
        </>
      }
    />
  );
}
