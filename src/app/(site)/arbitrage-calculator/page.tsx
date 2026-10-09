import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { ArbitrageCalculator } from "@/components/calculators/ArbitrageCalculator";
import { CalculatorPageShell } from "@/components/layout/CalculatorPageShell";
import { Formula, H2, P, UL } from "@/components/layout/Prose";
import { getCalculator } from "@/lib/calculators";

const meta = getCalculator("arbitrage-calculator")!;

export const metadata: Metadata = pageMetadata({ title: meta.title, description: meta.description, path: `/${meta.slug}` });

const faq = [
  {
    question: "What is sports betting arbitrage?",
    answer:
      "Arbitrage (an \"arb\") is betting every outcome of an event across different sportsbooks at prices so favorable that you profit no matter who wins. It exists when the combined implied probability of the best available prices is under 100%.",
  },
  {
    question: "How do I know if an arb exists?",
    answer:
      "Add up 1 ÷ decimal odds for each outcome. If the total is below 1 (below 100%), there's an arbitrage. At +105 and -102 the total is 99.28%, which is a 0.73% return on the money staked.",
  },
  {
    question: "Is arbitrage really risk-free?",
    answer:
      "The math is exact, but real-world execution isn't: lines move between placing bets, books limit or void winning arbers, and a bet can be cancelled or settled differently across books. Treat it as profit before limits, line movement, and bet cancellation risk.",
  },
  {
    question: "Why does the calculator show a loss sometimes?",
    answer:
      "When the combined implied probability is over 100% (as with -110 / -110), splitting your stake locks in a guaranteed loss. The calculator shows that honestly instead of hiding it.",
  },
];

export default function ArbitrageCalculatorPage() {
  return (
    <CalculatorPageShell
      h1="Arbitrage Calculator — Sports Betting Arb Finder"
      slug={meta.slug}
      category="arbitrage"
      schemaDescription={meta.description}
      calculator={<ArbitrageCalculator />}
      faq={faq}
      explainer={
        <>
          <P>
            When two sportsbooks disagree enough, you can bet both sides and lock in a profit either way. Enter the best price you
            can find on each outcome and your total stake; the arbitrage calculator tells you whether an arb exists, exactly how
            much to put on each side, and what you&apos;ll collect.
          </P>
          <H2>The formula</H2>
          <Formula>{`inv_i   = 1 / decimal_i
arb %   = Σ inv_i          (arb exists when < 100%)
stake_i = total × inv_i / Σ inv
payout  = total / Σ inv`}</Formula>
          <H2>Worked example: +105 / -102 with $1,000</H2>
          <P>
            The combined implied probability is 99.28%. Stake $491.36 on the +105 side and $508.64 on the -102 side: either way you
            collect $1,007.30 — a $7.30 profit, or 0.73%. At -110 / -110 the total is 104.76%, so there&apos;s no arb.
          </P>
          <H2>Before you try it</H2>
          <UL>
            <li>Profit is guaranteed only before limits, line movement, and bet cancellation risk.</li>
            <li>Arbs disappear fast — confirm both prices are still live before placing either bet.</li>
            <li>Related: the hedge calculator and vig calculator.</li>
          </UL>
        </>
      }
    />
  );
}
