import type { Metadata } from "next";
import { DraftPickCalculator } from "@/components/calculators/DraftPickCalculator";
import { CalculatorPageShell } from "@/components/layout/CalculatorPageShell";
import { getCalculator } from "@/lib/calculators";

const meta = getCalculator("draft-pick-calculator")!;

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: `/${meta.slug}` },
};

const faq = [
  {
    question: "How does a snake draft order work?",
    answer:
      "Round 1 goes in order (pick 1 through the last team), then round 2 reverses (last team picks first), then round 3 goes back to the original order — alternating every round. This gives every team one early pick and one late pick across any two consecutive rounds.",
  },
  {
    question: "What is third-round reversal (3RR)?",
    answer:
      "In a standard snake, the team picking last in round 1 gets two picks back-to-back (the last pick of round 1, then the first pick of round 2) — a small edge. 3RR corrects for it: round 3 repeats round 2's direction instead of flipping back, so the team that picked first in round 1 gets an early pick again in round 3. Rounds 4 onward alternate normally.",
  },
  {
    question: "What's my exact pick number in round 5 if I have the 3rd slot in a 10-team draft?",
    answer:
      "Enter 10 teams, 5+ rounds, and slot 3 above — the calculator lists every overall pick number you'll have, including round 5.",
  },
];

export default function DraftPickCalculatorPage() {
  return (
    <CalculatorPageShell
      h1="Fantasy Draft Pick Calculator"
      slug={meta.slug}
      category="draft-calculator"
      schemaDescription={meta.description}
      calculator={<DraftPickCalculator />}
      faq={faq}
      explainer={
        <>
          <p>
            Enter your league size, number of rounds, and draft slot to see the exact overall
            pick number you&apos;ll have in every round — no more counting on your fingers during
            draft night. Toggle third-round reversal (3RR) if your league uses it.
          </p>
          <p>
            <strong>Worked example:</strong> In a 4-team, 4-round 3RR draft, the team in slot 1
            picks 1, 8, 12, and 13 overall — while the team in slot 4 picks 4, 5, 9, and 16,
            mirroring the wait times so neither team is stuck with the worst of both ends.
          </p>
        </>
      }
    />
  );
}
