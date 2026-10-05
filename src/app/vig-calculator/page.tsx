import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { MarketCalculator } from "@/components/calculators/MarketCalculator";
import { CalculatorPageShell } from "@/components/layout/CalculatorPageShell";
import { Formula, H2, P, UL } from "@/components/layout/Prose";
import { getCalculator } from "@/lib/calculators";

const meta = getCalculator("vig-calculator")!;

export const metadata: Metadata = pageMetadata({ title: meta.title, description: meta.description, path: `/${meta.slug}` });

const faq = [
  {
    question: "What is vig (juice) in sports betting?",
    answer:
      "Vig — short for vigorish, also called juice — is the commission a sportsbook builds into its odds. Instead of charging a fee, the book prices both sides of a market so the implied probabilities add up to more than 100%. The excess is its margin.",
  },
  {
    question: "What's the difference between vig, overround, and hold?",
    answer:
      "Overround is the total implied probability minus 100% (4.76% at -110/-110). Hold is that same margin as a share of total money wagered (4.55% at -110/-110). People often use \"vig\" loosely for either; this calculator shows both so you can compare like with like.",
  },
  {
    question: "How much vig is normal?",
    answer:
      "Standard -110/-110 point spreads and totals carry about 4.5% hold. Reduced-juice markets at -105/-105 carry about 2.4%. Moneylines, props, parlays, and futures commonly run much higher.",
  },
  {
    question: "How much does the vig cost me?",
    answer:
      "At -110 you risk $110 to win $100, so you need to win 52.38% of the time just to break even. Every point of vig you avoid raises your long-run return.",
  },
];

export default function VigCalculatorPage() {
  return (
    <CalculatorPageShell
      h1="Vig Calculator — Sportsbook Hold & Juice"
      slug={meta.slug}
      category="vig"
      schemaDescription={meta.description}
      calculator={<MarketCalculator mode="vig" />}
      faq={faq}
      explainer={
        <>
          <P>
            The vig is the single most reliable way sportsbooks make money, and it&apos;s hidden in plain sight inside every price.
            Enter the odds for each outcome of a market and this vig calculator shows exactly how much margin you&apos;re paying.
          </P>
          <H2>The formula</H2>
          <Formula>{`sum        = Σ (1 / decimal_i)
overround  = (sum − 1) × 100
hold       = (1 − 1 / sum) × 100`}</Formula>
          <H2>Worked example: -110 / -110</H2>
          <P>
            Each side implies 52.38%, so the total is 104.76%. The overround is 4.76% and the hold is 4.55%. Cut the price to -105 /
            -105 and the total drops to 102.44% — a hold of just 2.38%.
          </P>
          <H2>Why it matters</H2>
          <UL>
            <li>Shopping for lower-juice lines is the easiest edge a bettor can buy.</li>
            <li>A market with negative overround — total under 100% — is an arbitrage; check the arbitrage calculator.</li>
            <li>Remove the vig entirely with the no-vig calculator to see the fair odds.</li>
          </UL>
        </>
      }
    />
  );
}
