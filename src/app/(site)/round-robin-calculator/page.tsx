import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { RoundRobinCalculator } from "@/components/calculators/RoundRobinCalculator";
import { CalculatorPageShell } from "@/components/layout/CalculatorPageShell";
import { Formula, H2, P, UL } from "@/components/layout/Prose";
import { getCalculator } from "@/lib/calculators";

const meta = getCalculator("round-robin-calculator")!;

export const metadata: Metadata = pageMetadata({ title: meta.title, description: meta.description, path: `/${meta.slug}` });

const faq = [
  {
    question: "What is a round robin bet?",
    answer:
      "A round robin is a set of smaller parlays built from the same group of picks. Choose 3 teams and 2-leg parlays and you place 3 separate bets — every possible pair — so you can still profit when one pick loses.",
  },
  {
    question: "How many bets are in a round robin?",
    answer:
      "The number of combinations: C(n, k). Three picks in 2-leg parlays is 3 bets, four picks in 2-leg parlays is 6, and five picks in 3-leg parlays is 10. Your total stake is that count times the stake per parlay.",
  },
  {
    question: "Is a round robin better than one big parlay?",
    answer:
      "It trades payout for safety. A single parlay pays the most but needs every leg to win; a round robin pays less when everything hits but cashes some tickets when one or two picks lose. Each parlay still carries the sportsbook’s margin, so it isn’t a free hedge.",
  },
  {
    question: "Why does the payout depend on which picks win?",
    answer:
      "If your picks have different odds, winning the long shots pays more than winning the favorites. That’s why the calculator shows a best-to-worst range for each number of winning picks.",
  },
];

export default function RoundRobinCalculatorPage() {
  return (
    <CalculatorPageShell
      h1="Round Robin Calculator — Parlay Combinations"
      slug={meta.slug}
      category="round-robin"
      schemaDescription={meta.description}
      calculator={<RoundRobinCalculator />}
      faq={faq}
      explainer={
        <>
          <P>
            A round robin turns one group of picks into several smaller parlays, so one bad pick doesn’t wipe out the whole ticket. Enter your selections, choose the parlay size and the stake per parlay, and see your total outlay and the profit for every win/loss scenario.
          </P>
          <H2>How it works</H2>
          <Formula>{`parlays      = C(n, k)
total stake  = parlays × stake per parlay
parlay payout = stake × Π decimal odds of its legs
total payout  = sum of every parlay whose legs all won`}</Formula>
          <H2>Worked example</H2>
          <P>
            Three -110 picks in 2-leg parlays at $10 each: 3 parlays, $30 staked, and each pays $36.45. If all three win, all three parlays cash for $109.34 — a $79.34 profit. If only two win, exactly one parlay hits: $36.45 back, a $6.45 profit. If one or none win, you lose the $30.
          </P>
          <H2>Things to know</H2>
          <UL>
            <li>The more legs in each parlay, the more all-win upside and the more wins you need to profit.</li>
            <li>Every parlay carries the sportsbook’s margin — see <a className="underline" href="/guides/how-parlays-are-priced">how parlays are priced</a>.</li>
            <li>Pricing a single combined ticket instead? Use the <a className="underline" href="/parlay-calculator">parlay calculator</a>.</li>
          </UL>
        </>
      }
    />
  );
}
