import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { getGuide } from "@/lib/guides";
import { GuideLayout } from "@/components/layout/GuideLayout";
import { Formula, H2, P, UL } from "@/components/layout/Prose";

const guide = getGuide("how-parlays-are-priced")!;
export const metadata: Metadata = pageMetadata({ title: guide.title, description: guide.description, path: `/guides/${guide.slug}` });

export default function Page() {
  return (
    <GuideLayout guide={guide}>
      <P>
        A parlay combines several bets into one ticket that only pays if every leg wins. The sportsbook prices it by multiplying the
        decimal odds of each leg.
      </P>
      <H2>The pricing formula</H2>
      <Formula>{`parlay decimal = decimal₁ × decimal₂ × … × decimalₙ
payout = stake × parlay decimal
profit = payout − stake`}</Formula>
      <H2>Worked example: three -110 legs</H2>
      <P>
        Each -110 leg is 1.9091 in decimal. Multiply three of them to get 6.9579, or about +596. A $100 stake returns $695.79, a
        $595.79 profit. Another classic: legs at -300, -200, and -150 multiply to 3.333, which is +233.
      </P>
      <H2>Why the house edge gets bigger</H2>
      <P>
        If each leg were a true 50/50, three legs would all win 12.5% of the time, so a fair price is 8.00 decimal (+700). The book
        pays 6.9579 instead — a 13.0% hold, roughly three times the 4.55% on a single -110 bet. Vig compounds on every leg you add.
      </P>
      <H2>What happens on a push</H2>
      <P>
        A pushed leg (a tie against the number) is dropped, which is the same as multiplying by 1.00. The ticket is graded on the
        remaining legs at lower odds. If every leg pushes, the ticket is void and your stake is refunded.
      </P>
      <UL>
        <li>More legs means a bigger potential payout and a smaller chance of cashing.</li>
        <li>Correlated legs may be restricted or priced differently by some sportsbooks.</li>
      </UL>
    </GuideLayout>
  );
}
