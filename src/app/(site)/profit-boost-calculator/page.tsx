import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { BoostCalculator } from "@/components/calculators/BoostCalculator";
import { CalculatorPageShell } from "@/components/layout/CalculatorPageShell";
import { Formula, H2, P, UL } from "@/components/layout/Prose";
import { getCalculator } from "@/lib/calculators";

const meta = getCalculator("profit-boost-calculator")!;

export const metadata: Metadata = pageMetadata({ title: meta.title, description: meta.description, path: `/${meta.slug}` });

const faq = [
  {
    question: "How is a profit boost calculated?",
    answer:
      "A profit boost multiplies the profit, not the stake. A 25% boost on a bet that would profit $90.91 pays $113.64 instead — $22.73 more — and your $100 stake is still returned on a win.",
  },
  {
    question: "Is a profit boost the same as a bonus bet?",
    answer:
      "No. A boost improves the payout of a bet you place with your own money, so the stake comes back if it wins. A bonus (free) bet uses the sportsbook's money and does not return the stake — see the bonus bet calculator.",
  },
  {
    question: "Is a boosted bet always +EV?",
    answer:
      "Not automatically. A boost only helps if the boosted price is better than the fair price. Take the fair odds from the no-vig calculator and compare them with the boosted odds shown here; maximum-stake caps on boosts also limit the value.",
  },
  {
    question: "What does the break-even number mean?",
    answer:
      "It is the win probability you need for the bet to pay for itself. A 25% boost lowers the break-even win rate on a -110 bet from 52.38% to 46.81%.",
  },
];

export default function ProfitBoostCalculatorPage() {
  return (
    <CalculatorPageShell
      h1="Profit Boost Calculator — Odds Boost Payout"
      slug={meta.slug}
      category="boost"
      schemaDescription={meta.description}
      calculator={<BoostCalculator />}
      faq={faq}
      explainer={
        <>
          <P>
            Sportsbooks advertise profit boosts and odds boosts as percentages, but what matters is the new payout and the price you are really getting. Enter your stake, the original odds, and the boost to see the extra profit, the effective boosted odds, and how much easier the bet is to break even.
          </P>
          <H2>The formula</H2>
          <Formula>{`boosted profit  = stake × (decimal − 1) × (1 + boost%)
boosted decimal = 1 + (decimal − 1) × (1 + boost%)
break-even win % = 1 / decimal`}</Formula>
          <H2>Worked examples</H2>
          <UL>
            <li>$100 at -110 with a 25% boost: profit rises from $90.91 to $113.64 (+$22.73), the effective price becomes +114, and the break-even win rate drops from 52.38% to 46.81%.</li>
            <li>A 50% boost on +200 turns a $200 profit into $300 — the same as betting at +300.</li>
          </UL>
          <H2>Check the boost is worth taking</H2>
          <P>
            Devig the market with the <a className="underline" href="/no-vig-calculator">no-vig calculator</a> and compare its fair odds with the boosted odds above, then confirm the edge with the <a className="underline" href="/ev-calculator">EV calculator</a>. Informational only; always verify payouts with your sportsbook.
          </P>
        </>
      }
    />
  );
}
