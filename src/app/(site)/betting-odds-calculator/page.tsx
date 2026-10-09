import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { SingleBetCalculator } from "@/components/calculators/SingleBetCalculator";
import { CalculatorPageShell } from "@/components/layout/CalculatorPageShell";
import { Formula, H2, P, UL } from "@/components/layout/Prose";
import { getCalculator } from "@/lib/calculators";

const meta = getCalculator("betting-odds-calculator")!;

export const metadata: Metadata = pageMetadata({ title: meta.title, description: meta.description, path: `/${meta.slug}` });

const faq = [
  {
    question: "How is my payout calculated?",
    answer:
      "Payout equals your stake multiplied by the decimal equivalent of your odds. At -110, decimal odds are 1.9091, so a $100 bet pays out $190.91 total — $90.91 profit plus your $100 stake back.",
  },
  {
    question: "Does the payout include my original stake?",
    answer:
      "Yes — \"Payout\" is your total return if the bet wins, stake included. \"Profit\" is what you actually gain: payout minus stake.",
  },
  {
    question: "What does implied probability tell me?",
    answer:
      "It's the win probability the odds represent. Comparing implied probability to your own estimate of a team's chances is the basis of finding value bets.",
  },
  {
    question: "How much do I need to bet to win $100?",
    answer:
      "At negative odds it’s the odds number — $110 at -110. At positive odds it’s 10,000 ÷ odds, so $66.67 at +150.",
  },
  {
    question: "How do I calculate winnings on a -110 bet?",
    answer:
      "Divide your stake by 1.10 to get profit: a $55 bet at -110 wins $50. Add your stake back for the payout.",
  },
];

export default function BettingOddsCalculatorPage() {
  return (
    <CalculatorPageShell
      h1="Betting Odds Calculator — Payout & Profit"
      slug={meta.slug}
      category="single-bet"
      schemaDescription={meta.description}
      calculator={<SingleBetCalculator />}
      faq={faq}
      explainer={
        <>
          <P>
            Enter a stake and odds in any notation to see exactly what a single bet pays — no mental math. This is the calculation every parlay, hedge, and bonus bet tool on LineMath is built from.
          </P>
          <H2>The formulas</H2>
          <Formula>{`positive odds:  profit = stake × odds / 100
negative odds:  profit = stake × 100 / |odds|
payout = stake + profit
implied probability = 1 / decimal odds`}</Formula>
          <H2>Worked examples</H2>
          <UL>
            <li>$100 at -110 returns $190.91 total — $90.91 profit — and implies a 52.38% win chance.</li>
            <li>$50 at +200 returns $150 total — $100 profit.</li>
            <li>$220 at -220 returns $320 total — $100 profit.</li>
          </UL>
          <H2>Payout vs. profit</H2>
          <P>
            Payout is everything you get back if the bet wins, including your stake. Profit is only the gain. Sportsbooks often advertise the “to win” amount, which is the profit — check which one you’re looking at before comparing prices.
          </P>
          <P>
            Betting several games at once? Use the <a className="underline" href="/parlay-calculator">parlay calculator</a>. Want to know whether a price is worth it at all? See the <a className="underline" href="/ev-calculator">EV calculator</a>.
          </P>
        </>
      }
    />
  );
}
