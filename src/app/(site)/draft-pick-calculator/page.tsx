import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { DraftPickCalculator } from "@/components/calculators/DraftPickCalculator";
import { CalculatorPageShell } from "@/components/layout/CalculatorPageShell";
import { Formula, H2, P, UL } from "@/components/layout/Prose";
import { getCalculator } from "@/lib/calculators";

const meta = getCalculator("draft-pick-calculator")!;

export const metadata: Metadata = pageMetadata({ title: meta.title, description: meta.description, path: `/${meta.slug}` });

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
  {
    question: "Where should I draft in a 12-team league?",
    answer:
      "There is no universally best slot; early slots get the top player, middle slots get balance, and late slots get back-to-back picks. Use this tool to see the pick gaps for your slot.",
  },
  {
    question: "Does auction or linear draft work here?",
    answer:
      "No — this calculator covers snake drafts (with optional 3RR). A linear draft keeps the same order every round.",
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
          <P>
            Enter your league size, number of rounds, and draft slot to see the exact overall pick number you hold in every round — no more counting on your fingers on draft night. Toggle third-round reversal (3RR) if your league uses it.
          </P>
          <H2>How a snake draft works</H2>
          <Formula>{`odd rounds:   picks run slot 1 → N
even rounds:  picks run slot N → 1
overall pick = (round − 1) × N + position in that round`}</Formula>
          <H2>Worked examples</H2>
          <UL>
            <li>12 teams, slot 1: picks 1, 24, 25, 48, 49 — the first and last pick of consecutive rounds nearly back to back.</li>
            <li>12 teams, slot 6: picks 6, 19, 30 — round 2 you pick 7th, round 3 you pick 6th.</li>
            <li>4 teams, 4 rounds, 3RR, slot 4: picks 4, 5, 9, 16.</li>
          </UL>
          <H2>Why 3RR exists</H2>
          <P>
            In a standard snake the last-slot team picks twice in a row between rounds 1 and 2. 3RR repeats the round-2 direction in round 3 so the first-slot team gets an early pick back. Once you have your picks, check player value with the <a className="underline" href="/fantasy-points-calculator">fantasy points calculator</a>.
          </P>
        </>
      }
    />
  );
}
