import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { KellyCalculator } from "@/components/calculators/KellyCalculator";
import { CalculatorPageShell } from "@/components/layout/CalculatorPageShell";
import { Formula, H2, P, UL } from "@/components/layout/Prose";
import { getCalculator } from "@/lib/calculators";

const meta = getCalculator("kelly-calculator")!;

export const metadata: Metadata = pageMetadata({ title: meta.title, description: meta.description, path: `/${meta.slug}` });

const faq = [
  {
    question: "What is the Kelly criterion?",
    answer:
      "The Kelly criterion is a formula that gives the fraction of your bankroll to wager so as to maximize long-run growth, given the odds and your estimated probability of winning.",
  },
  {
    question: "What is the Kelly formula for betting?",
    answer:
      "f* = (b × p − q) / b, where b is the net odds (decimal odds minus 1), p is your win probability, and q is 1 − p. At +150 (decimal 2.50) with a 45% win chance, b = 1.5 and f* = (1.5 × 0.45 − 0.55) / 1.5 = 8.33% of your bankroll.",
  },
  {
    question: "Why do people use half or quarter Kelly?",
    answer:
      "Full Kelly is very volatile and assumes your probability is exactly right. Because real estimates are noisy, most bettors scale down to half or quarter Kelly, which sacrifices a little growth for far smaller drawdowns.",
  },
  {
    question: "What does 0% mean?",
    answer:
      "If your win probability is at or below the break-even probability for the odds, the bet has no edge and Kelly recommends staking nothing. This calculator never outputs a negative stake.",
  },
];

export default function KellyCalculatorPage() {
  return (
    <CalculatorPageShell
      h1="Kelly Criterion Calculator — Bet Sizing"
      slug={meta.slug}
      category="kelly"
      schemaDescription={meta.description}
      calculator={<KellyCalculator />}
      faq={faq}
      explainer={
        <>
          <P>
            Finding a +EV bet is only half the job — how much to stake decides whether you grow a bankroll or blow it up. The Kelly
            criterion sizes each bet to the size of your edge. Enter your bankroll, the odds, and your win probability to get a
            recommended stake.
          </P>
          <H2>The formula</H2>
          <Formula>{`b  = decimal − 1
f* = (b × p − (1 − p)) / b
stake = bankroll × max(0, f*) × multiplier`}</Formula>
          <H2>Worked example</H2>
          <P>
            At +150 (b = 1.5) with a 45% win probability, full Kelly is 8.33% of bankroll. On a $1,000 bankroll that&apos;s $83.33 at full
            Kelly, or $41.67 at half Kelly. At -110 with a 55% estimate, full Kelly is 5.5%.
          </P>
          <H2>Practical advice</H2>
          <UL>
            <li>Use half or quarter Kelly unless you&apos;re highly confident in your probabilities.</li>
            <li>Get probabilities from the no-vig calculator and confirm the edge with the EV calculator.</li>
            <li>Kelly assumes bets are independent and repeated; it&apos;s a sizing guide, not a guarantee.</li>
          </UL>
          <P>Informational and educational only — not betting advice. Gamble responsibly.</P>
        </>
      }
    />
  );
}
