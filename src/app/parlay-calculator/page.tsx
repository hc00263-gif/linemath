import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { ParlayCalculator } from "@/components/calculators/ParlayCalculator";
import { CalculatorPageShell } from "@/components/layout/CalculatorPageShell";
import { Formula, H2, P, UL } from "@/components/layout/Prose";
import { getCalculator } from "@/lib/calculators";

const meta = getCalculator("parlay-calculator")!;

export const metadata: Metadata = pageMetadata({ title: meta.title, description: meta.description, path: `/${meta.slug}` });

const faq = [
  {
    question: "How are parlay odds calculated?",
    answer:
      "Every leg's decimal odds are multiplied together. Three legs at -110 each combine to roughly +596 — much steeper than any single leg, because you're compounding the payout across every leg you add.",
  },
  {
    question: "What happens if one leg of my parlay pushes?",
    answer:
      "A pushed leg (a tie or a line that lands exactly on the number) is removed from the parlay and the rest of the bet is graded normally at reduced odds — it does not void the whole ticket. If every leg pushes, the entire parlay is void and your stake is refunded.",
  },
  {
    question: "How many legs can a parlay have?",
    answer:
      "This calculator supports up to 12 legs. Most sportsbooks cap parlays somewhere between 10 and 25 legs, but the odds get so long past 6-8 legs that the practical ceiling is usually your own risk tolerance.",
  },
  {
    question: "What’s the chance of winning a 3-leg parlay at -110?",
    answer:
      "Each -110 leg needs 52.38% to break even, so all three need 0.5238³ = 14.37%. If your true win rate per leg is 50%, you’ll cash only 12.5% of the time.",
  },
  {
    question: "Do parlays have a worse payout than single bets?",
    answer:
      "Usually yes in expectation: the margin on every leg compounds, so the effective hold on a parlay is much higher than on a straight bet.",
  },
];

export default function ParlayCalculatorPage() {
  return (
    <CalculatorPageShell
      h1="Parlay Calculator — Free Parlay Odds & Payout Calculator"
      slug={meta.slug}
      category="parlay"
      schemaDescription={meta.description}
      calculator={<ParlayCalculator />}
      faq={faq}
      explainer={
        <>
          <P>
            A parlay combines multiple bets into one ticket that only pays if every leg wins — in exchange for much longer odds than betting each leg separately. Add up to 12 legs, mark any that pushed, and see the true combined odds and payout instantly.
          </P>
          <H2>How parlay odds are calculated</H2>
          <Formula>{`parlay decimal = decimal₁ × decimal₂ × … × decimalₙ
payout = stake × parlay decimal
profit = payout − stake`}</Formula>
          <H2>Worked examples</H2>
          <UL>
            <li>Three -110 legs: 1.9091³ = 6.9579 → about +596. A $100 stake pays $695.79 ($595.79 profit).</li>
            <li>Legs at -300, -200, and -150: 1.3333 × 1.5 × 1.6667 = 3.333 → +233.</li>
          </UL>
          <H2>What a push does</H2>
          <P>
            A pushed leg is removed and the ticket is graded on the remaining legs at lower odds. If every leg pushes, the parlay is void and the stake is refunded.
          </P>
          <H2>The catch: compounding vig</H2>
          <P>
            Each leg carries the sportsbook’s margin, and a parlay multiplies it. Three true 50/50 legs should pay +700, but three -110 legs pay about +596 — a 13% hold versus 4.5% on a single bet. Read <a className="underline" href="/guides/how-parlays-are-priced">how parlays are priced</a>, and use the <a className="underline" href="/ev-calculator">EV calculator</a> before you build one.
          </P>
        </>
      }
    />
  );
}
