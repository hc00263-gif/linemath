import type { Metadata } from "next";
import { FantasyPointsCalculator } from "@/components/calculators/FantasyPointsCalculator";
import { CalculatorPageShell } from "@/components/layout/CalculatorPageShell";
import { getCalculator } from "@/lib/calculators";

const meta = getCalculator("fantasy-points-calculator")!;

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: `/${meta.slug}` },
};

const faq = [
  {
    question: "What's the difference between Standard, Half-PPR, and PPR?",
    answer:
      "They differ only in how much a reception is worth: 0 points in Standard, 0.5 in Half-PPR, and 1 full point in PPR. Everything else — yardage, touchdowns, interceptions, fumbles — scores the same across all three.",
  },
  {
    question: "Why does a full-PPR line score so much higher than Standard for a receiver?",
    answer:
      "Because every catch is worth a full point on top of yardage and touchdowns. A receiver with 8 catches picks up 8 extra points in PPR that Standard scoring doesn't count at all — which is why high-volume, short-target receivers are valued differently across formats.",
  },
  {
    question: "Does this support custom league scoring?",
    answer:
      "Not yet — this first version covers the three most common formats (Standard, Half-PPR, PPR) using typical point values (4pt pass TD, 6pt rush/rec TD, -2 INT/fumble, 1pt per 25 pass yds or 10 rush/rec yds). Custom per-stat scoring is a natural next step.",
  },
];

export default function FantasyPointsCalculatorPage() {
  return (
    <CalculatorPageShell
      h1="Fantasy Football Points Calculator"
      slug={meta.slug}
      category="fantasy-points"
      schemaDescription={meta.description}
      calculator={<FantasyPointsCalculator />}
      faq={faq}
      explainer={
        <>
          <p>
            Enter a player&apos;s box score — passing, rushing, receiving, turnovers, two-point
            conversions — and see fantasy points instantly across the three most common scoring
            formats. No signup, no roster to build, just the stat line you already have in front
            of you.
          </p>
          <p>
            <strong>Worked example:</strong> 8 catches, 120 receiving yards, 1 receiving
            touchdown scores 18.0 points in Standard, 22.0 in Half-PPR, and 26.0 in full PPR — the
            8 receptions alone are worth the entire 8-point swing between formats.
          </p>
        </>
      }
    />
  );
}
