import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { ClvCalculator } from "@/components/calculators/ClvCalculator";
import { CalculatorPageShell } from "@/components/layout/CalculatorPageShell";
import { Formula, H2, P, UL } from "@/components/layout/Prose";
import { getCalculator } from "@/lib/calculators";

const meta = getCalculator("clv-calculator")!;

export const metadata: Metadata = pageMetadata({ title: meta.title, description: meta.description, path: `/${meta.slug}` });

const faq = [
  {
    question: "What is closing line value (CLV)?",
    answer:
      "CLV compares the price you bet with the final price before the game starts. If you got better odds than the closing line, you beat the market — historically one of the best signs of a profitable bettor, because closing lines are the most efficient prices.",
  },
  {
    question: "How is CLV calculated?",
    answer:
      "Remove the vig from the closing line to get a fair closing probability, then compute your bet's decimal odds × that probability − 1. Betting +110 on a side that closes at a true 50% is +5.00% CLV.",
  },
  {
    question: "Why does the calculator ask for the other side's closing odds?",
    answer:
      "Closing prices include the sportsbook's margin. With both sides, the margin can be removed to get a fair closing probability. Without it, the closing probability is inflated and CLV is overstated.",
  },
  {
    question: "Does positive CLV mean my bet won?",
    answer:
      "No. CLV measures price quality, not results. You can beat the close and lose a single bet, and win a bet at a worse price than the close. It matters over many bets.",
  },
];

export default function ClvCalculatorPage() {
  return (
    <CalculatorPageShell
      h1="CLV Calculator — Closing Line Value"
      slug={meta.slug}
      category="clv"
      schemaDescription={meta.description}
      calculator={<ClvCalculator />}
      faq={faq}
      explainer={
        <>
          <P>
            Results are noisy; prices are not. Closing line value shows whether the odds you took were better than where the market finally settled — the fastest feedback on whether your betting has an edge. Enter your price and the closing odds on both sides to see your CLV.
          </P>
          <H2>The formulas</H2>
          <Formula>{`closing probability = (1/closeDec) / (1/closeDec + 1/oppositeDec)
CLV %    = bet decimal × closing probability − 1
CLV pts  = closing probability − your implied probability`}</Formula>
          <H2>Worked example</H2>
          <P>
            You bet +110 (implies 47.62%). The market closes -110 / -110, a fair 50% each. Your CLV is 2.10 × 0.50 − 1 = +5.00%, or +2.38 probability points — you beat the close.
          </P>
          <UL>
            <li>Track CLV bet by bet in the <a className="underline" href="/bet-tracker">bet tracker</a>.</li>
            <li>Get the fair closing line with the <a className="underline" href="/no-vig-calculator">no-vig calculator</a>.</li>
            <li>Turn an edge into a stake with the <a className="underline" href="/kelly-calculator">Kelly calculator</a>.</li>
          </UL>
        </>
      }
    />
  );
}
