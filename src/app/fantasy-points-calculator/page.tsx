import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { FantasyPointsCalculator } from "@/components/calculators/FantasyPointsCalculator";
import { CalculatorPageShell } from "@/components/layout/CalculatorPageShell";
import { Formula, H2, P, UL } from "@/components/layout/Prose";
import { getCalculator } from "@/lib/calculators";

const meta = getCalculator("fantasy-points-calculator")!;

export const metadata: Metadata = pageMetadata({ title: meta.title, description: meta.description, path: `/${meta.slug}` });

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
  {
    question: "Does this include kickers and defenses?",
    answer:
      "Not yet — this version scores offensive skill positions (QB, RB, WR, TE), which cover most roster decisions.",
  },
  {
    question: "Can I use my league’s custom scoring?",
    answer:
      "Custom per-stat values are not available yet; the three presets cover the most common formats.",
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
          <P>
            Enter a player’s box score — passing, rushing, receiving, turnovers, two-point conversions — and see fantasy points instantly across Standard, Half-PPR, and PPR. No signup, no roster to build.
          </P>
          <H2>Scoring used</H2>
          <Formula>{`Passing:    1 pt per 25 yds (0.04/yd), 4 pts per TD, -2 per INT
Rushing:    1 pt per 10 yds (0.1/yd), 6 pts per TD
Receiving:  1 pt per 10 yds (0.1/yd), 6 pts per TD
Reception:  0 (Standard), 0.5 (Half-PPR), 1 (PPR)
Fumble lost: -2     Two-point conversion: +2`}</Formula>
          <H2>Worked examples</H2>
          <UL>
            <li>Receiver, 8 catches / 120 yds / 1 TD: 18.0 Standard, 22.0 Half-PPR, 26.0 PPR — the 8 receptions are the whole difference.</li>
            <li>Quarterback, 300 pass yds / 3 TD / 1 INT / 10 rush yds: 12 + 12 − 2 + 1 = 23.0 in any format.</li>
          </UL>
          <P>
            Drafting soon? The <a className="underline" href="/draft-pick-calculator">draft pick calculator</a> shows exactly which picks you hold in a snake draft.
          </P>
        </>
      }
    />
  );
}
