import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { MarketCalculator } from "@/components/calculators/MarketCalculator";
import { CalculatorPageShell } from "@/components/layout/CalculatorPageShell";
import { Formula, H2, P, UL } from "@/components/layout/Prose";
import { getCalculator } from "@/lib/calculators";

const meta = getCalculator("no-vig-calculator")!;

export const metadata: Metadata = pageMetadata({ title: meta.title, description: meta.description, path: `/${meta.slug}` });

const faq = [
  {
    question: "What does \"no-vig\" or \"fair odds\" mean?",
    answer:
      "No-vig (also called devigged or fair) odds are what a line would be if the sportsbook charged no margin. The book's vig is baked into both sides of a market so their implied probabilities add to more than 100%; removing it rescales them to exactly 100%.",
  },
  {
    question: "How do you remove the vig from -110/-110?",
    answer:
      "Each side implies 52.38%, for a total of 104.76%. Dividing each by 104.76% gives 50% / 50%, which is +100 / +100 — the fair price of a true coin flip. The 4.55% difference is the book's hold.",
  },
  {
    question: "Which devig method does this calculator use?",
    answer:
      "The proportional (multiplicative) method: every implied probability is divided by the total. It's the standard baseline. On very lopsided lines it slightly understates the favorite's true probability compared with power or Shin methods, so treat it as a close estimate, not gospel.",
  },
  {
    question: "Why do sharp bettors care about no-vig odds?",
    answer:
      "Fair odds from a sharp market are the best available estimate of a true probability. Comparing a soft book's price against that fair number is how bettors find positive expected value — see the EV calculator.",
  },
];

export default function NoVigCalculatorPage() {
  return (
    <CalculatorPageShell
      h1="No-Vig Calculator — Fair Odds & Devig Calculator"
      slug={meta.slug}
      category="no-vig"
      schemaDescription={meta.description}
      calculator={<MarketCalculator mode="novig" />}
      faq={faq}
      explainer={
        <>
          <P>
            Every sportsbook price includes a built-in margin called the vig (or juice). It&apos;s why both sides of a spread at -110
            add up to more than 100% — and why the odds you see are never the odds a bet is really worth. This no-vig calculator
            removes that margin so you can see the market&apos;s true, fair view of the matchup.
          </P>
          <H2>How the math works</H2>
          <P>Convert each price to an implied probability, add them up, then divide each by the total:</P>
          <Formula>{`implied_i  = 1 / decimal_i
total      = Σ implied
fair_i     = implied_i / total
fair odds  = 1 / fair_i`}</Formula>
          <H2>Worked example: -200 / +170</H2>
          <P>
            -200 implies 66.67% and +170 implies 37.04%, a total of 103.70%. Dividing through gives fair probabilities of 64.29% and
            35.71% — fair odds of -180 and +180. The 3.57% gap is the hold the book is charging on this moneyline.
          </P>
          <H2>When to use it</H2>
          <UL>
            <li>Finding the true price of a line before you decide whether a bet is worth it.</li>
            <li>Comparing a soft sportsbook against a sharp market&apos;s devigged number.</li>
            <li>Converting a three-way soccer market (home / draw / away) to fair probabilities — tick the three-way box.</li>
          </UL>
          <P>
            Fair odds are an estimate, not a guarantee of how a game will play out. Always verify prices with your sportsbook.
          </P>
        </>
      }
    />
  );
}
