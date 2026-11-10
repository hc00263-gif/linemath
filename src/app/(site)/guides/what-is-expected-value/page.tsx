import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { getGuide } from "@/lib/guides";
import { GuideLayout } from "@/components/layout/GuideLayout";
import { Formula, H2, P, UL } from "@/components/layout/Prose";

const guide = getGuide("what-is-expected-value")!;
export const metadata: Metadata = pageMetadata({ title: guide.title, description: guide.description, path: `/guides/${guide.slug}` });

export default function Page() {
  return (
    <GuideLayout guide={guide}>
      <P>
        Expected value (EV) is the average amount a bet wins or loses per dollar if you could place it many times. A bet is +EV when your true win
        probability is higher than the odds imply.
      </P>
      <H2>A concrete example</H2>
      <P>
        Suppose you estimate a team has a 55% chance to win and you can bet them at -110. A winning $100 bet profits $90.91; a losing one costs $100.
      </P>
      <Formula>{`EV = P(win) × profit − P(lose) × stake
   = 0.55 × 90.91 − 0.45 × 100 = +$5.00 per $100  (a 5% edge)`}</Formula>
      <H2>Where the probability comes from</H2>
      <P>
        EV is only as good as your probability estimate. A common starting point is the no-vig price from a sharp book: strip the margin out of the
        market and treat the fair probability as your baseline, then ask whether another book is offering a better price than that.
      </P>
      <UL>
        <li>At -110 you break even at 52.38%. Anything above that is +EV; anything below loses money over time.</li>
        <li>A +EV bet can still lose. EV describes the average over many bets, not the next one.</li>
        <li>Pair EV with the Kelly calculator to size the bet sensibly.</li>
      </UL>
    </GuideLayout>
  );
}
