import type { Metadata } from "next";
import { ParlayCalculator } from "@/components/calculators/ParlayCalculator";
import { CalculatorPageShell } from "@/components/layout/CalculatorPageShell";
import { getCalculator } from "@/lib/calculators";

const meta = getCalculator("parlay-calculator")!;

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: `/${meta.slug}` },
};

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
          <p>
            A parlay combines multiple bets into one ticket that only pays out if every leg
            wins — in exchange for much longer odds than betting each leg separately. Add up to
            12 legs, mark any that pushed, and see the true combined payout instantly.
          </p>
          <p>
            <strong>Worked example:</strong> Three legs at -110 each combine to roughly +596. A
            $100 stake pays out $695.79 total for $595.79 profit — far more than the $272.73
            you&apos;d win betting each leg separately for $100, but only if all three hit.
          </p>
        </>
      }
    />
  );
}
