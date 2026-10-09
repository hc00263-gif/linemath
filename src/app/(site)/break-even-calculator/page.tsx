import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { BreakEvenCalculator } from "@/components/calculators/BreakEvenCalculator";
import { CalculatorPageShell } from "@/components/layout/CalculatorPageShell";
import { Formula, H2, P, UL } from "@/components/layout/Prose";
import { getCalculator } from "@/lib/calculators";

const meta = getCalculator("break-even-calculator")!;

export const metadata: Metadata = pageMetadata({ title: meta.title, description: meta.description, path: `/${meta.slug}` });

const faq = [
  {
    question: "What win rate do I need to break even betting -110?",
    answer:
      "52.38%. At -110 you risk $110 to win $100, so you must win more than 52.38% of bets to profit — about 53 wins out of every 100.",
  },
  {
    question: "How is the break-even win rate calculated?",
    answer:
      "It is 1 divided by the decimal odds. At +150 (2.50 decimal) the break-even rate is 40%; at -200 (1.50) it is 66.67%.",
  },
  {
    question: "Why can I win more than half my bets and still lose money?",
    answer:
      "Because the vig sets the break-even rate above 50%. At -110 a 52% win rate loses money; 55-45 makes 5 units on 100 bets, a 5% return.",
  },
  {
    question: "What does ROI mean here?",
    answer:
      "Return on investment: profit divided by total amount wagered, assuming one unit per bet at the same odds. Different stake sizes or odds will change the real figure.",
  },
];

export default function BreakEvenCalculatorPage() {
  return (
    <CalculatorPageShell
      h1="Break-Even Win Rate Calculator — Sports Betting"
      slug={meta.slug}
      category="break-even"
      schemaDescription={meta.description}
      calculator={<BreakEvenCalculator />}
      faq={faq}
      explainer={
        <>
          <P>
            The most useful number in betting is the one you have to beat. Enter your average odds and your win-loss record to see the break-even win rate, how many wins you need to be profitable, and your profit and ROI so far.
          </P>
          <H2>The formulas</H2>
          <Formula>{`break-even win rate = 1 / decimal odds
profit (units)      = wins × (decimal − 1) − losses
ROI                 = profit / (wins + losses)
fewest wins to profit in n bets = floor(n / decimal) + 1`}</Formula>
          <H2>Worked example</H2>
          <P>
            At -110 you need 52.38%. A 55-45 record earns 55 × 0.909 − 45 = +5.0 units on 100 bets — a 5% ROI — while 52-48 loses 0.7 units, even though it is a winning record.
          </P>
          <UL>
            <li>Lower the bar by shopping for cheaper prices — see the <a className="underline" href="/vig-calculator">vig calculator</a>.</li>
            <li>Check whether a bet clears the bar with the <a className="underline" href="/ev-calculator">EV calculator</a>.</li>
            <li>Size bets to your edge with the <a className="underline" href="/kelly-calculator">Kelly calculator</a>.</li>
          </UL>
        </>
      }
    />
  );
}
