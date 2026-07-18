import type { Metadata } from "next";
import { OddsConverterCalculator } from "@/components/calculators/OddsConverterCalculator";
import { CalculatorPageShell } from "@/components/layout/CalculatorPageShell";
import { getCalculator } from "@/lib/calculators";

const meta = getCalculator("odds-converter")!;

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: `/${meta.slug}` },
};

const faq = [
  {
    question: "What's the difference between American, decimal, and fractional odds?",
    answer:
      "They're three ways of quoting the same payout. American odds show how much you win on a $100 bet (or how much you need to bet to win $100). Decimal odds show your total return per $1 staked, including your stake. Fractional odds show your profit as a ratio to your stake — 3/2 means you win $3 for every $2 wagered.",
  },
  {
    question: "How is implied probability calculated?",
    answer:
      "Implied probability is 1 divided by the decimal odds, shown as a percentage. It's the win probability the odds represent before accounting for the sportsbook's built-in margin (the vig).",
  },
  {
    question: "Why don't the implied probabilities on both sides of a game add up to 100%?",
    answer:
      "Because the book bakes in a margin, called the vig or juice. Add up the implied probability of both sides of a two-way market and you'll typically get somewhere around 104-107%, not 100%. Our no-vig calculator (coming soon) strips that margin out.",
  },
];

export default function OddsConverterPage() {
  return (
    <CalculatorPageShell
      h1="Odds Converter — American, Decimal & Fractional"
      slug={meta.slug}
      category="odds-converter"
      schemaDescription={meta.description}
      calculator={<OddsConverterCalculator />}
      faq={faq}
      explainer={
        <>
          <p>
            American odds are the default at every US sportsbook, but decimal and fractional
            notations show up constantly — European books use decimal, UK-influenced markets use
            fractional, and props are sometimes quoted as an implied percentage. This tool converts
            between all four instantly, with no rounding surprises.
          </p>
          <p>
            <strong>Worked example:</strong> +150 American odds equal 2.50 decimal, 3/2 fractional,
            and a 40.00% implied win probability. A $100 bet at +150 returns $250 total ($150
            profit) if it wins.
          </p>
        </>
      }
    />
  );
}
