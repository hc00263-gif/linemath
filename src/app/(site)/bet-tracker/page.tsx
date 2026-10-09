import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { BetTracker } from "@/components/tracker/BetTracker";
import { CalculatorPageShell } from "@/components/layout/CalculatorPageShell";
import { Formula, H2, P, UL } from "@/components/layout/Prose";
import { getCalculator } from "@/lib/calculators";

const meta = getCalculator("bet-tracker")!;

export const metadata: Metadata = pageMetadata({ title: meta.title, description: meta.description, path: `/${meta.slug}` });

const faq = [
  {
    question: "Where is my bet data stored?",
    answer:
      "Only in your own browser's local storage on this device. LineMath has no accounts and never receives your bets. The tradeoff is that clearing your browser data deletes them, so export a CSV backup regularly.",
  },
  {
    question: "How is ROI calculated?",
    answer:
      "ROI is total profit divided by the total amount staked on settled (won or lost) bets. Pushes and pending bets are excluded from the stake total.",
  },
  {
    question: "What is the CLV column?",
    answer:
      "If you enter the closing odds for a bet, CLV shows how much better your decimal price was than the closing price: your decimal odds ÷ closing decimal odds − 1. It does not remove the vig; for a de-vigged figure use the CLV calculator.",
  },
  {
    question: "Can I import bets from a spreadsheet or another tracker?",
    answer:
      "Yes. Import a CSV with a header row. Only odds and stake are required; date, sport, type, description, result, and closing_odds are used when present, in any column order. Rows that can't be read are skipped and listed.",
  },
];

export default function BetTrackerPage() {
  return (
    <CalculatorPageShell
      h1="Bet Tracker — Free Sports Betting Tracker & ROI"
      slug={meta.slug}
      category="tracker"
      schemaDescription={meta.description}
      calculator={<BetTracker />}
      faq={faq}
      explainer={
        <>
          <P>
            You can&apos;t improve what you don&apos;t measure. Log every bet and see your profit, ROI, win rate, and how you perform by sport, bet type, and odds range — plus a profit curve and closing line value. No account, no cost, and your data never leaves your browser.
          </P>
          <H2>How the numbers work</H2>
          <Formula>{`win profit  = stake × (decimal − 1)
loss        = −stake
ROI         = profit / staked (won + lost bets)
CLV         = bet decimal / closing decimal − 1`}</Formula>
          <H2>Getting the most out of it</H2>
          <UL>
            <li>Record closing odds whenever you can — beating the close is the clearest early sign of a real edge.</li>
            <li>Compare your win rate with the <a className="underline" href="/break-even-calculator">break-even win rate</a> for your typical odds.</li>
            <li>Judge results over hundreds of bets, not a handful; short samples are mostly noise.</li>
          </UL>
        </>
      }
    />
  );
}
