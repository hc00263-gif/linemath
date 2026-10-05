import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { getGuide } from "@/lib/guides";
import { GuideLayout } from "@/components/layout/GuideLayout";
import { Formula, H2, P, UL } from "@/components/layout/Prose";

const guide = getGuide("what-is-vig")!;
export const metadata: Metadata = pageMetadata({ title: guide.title, description: guide.description, path: `/guides/${guide.slug}` });

export default function Page() {
  return (
    <GuideLayout guide={guide}>
      <P>
        Vig — short for vigorish, also called juice — is the margin a sportsbook builds into its odds. Books don&apos;t charge a visible
        fee; they shade both sides of a market so that, together, the implied probabilities add up to more than 100%.
      </P>
      <H2>A concrete example</H2>
      <P>
        A point spread at -110 / -110 looks symmetrical, but each side implies a 52.38% chance. Add them: 104.76%. That extra 4.76%
        is the overround; as a share of the money wagered it is a 4.55% hold.
      </P>
      <Formula>{`overround = (Σ 1/decimal − 1) × 100   → 4.76% at -110/-110
hold      = (1 − 1 / Σ 1/decimal) × 100 → 4.55% at -110/-110`}</Formula>
      <H2>What it costs you</H2>
      <P>
        At -110 you need to win 52.38% of bets just to break even. If you split a bet evenly across both sides of a -110 market you
        lose about 4.5 cents on every dollar wagered. Reduced-juice lines at -105 / -105 cut that to a 2.38% hold.
      </P>
      <H2>Removing the vig</H2>
      <P>
        To find fair odds, divide each implied probability by the total. For -200 / +170 that gives 64.29% and 35.71% — fair odds of
        -180 / +180, with a 3.57% hold removed. Fair prices are the starting point for finding +EV bets.
      </P>
      <UL>
        <li>Shop several books: the cheapest price on the same bet is the lowest-vig version of it.</li>
        <li>Parlays, props, and futures usually carry far more vig than a main spread.</li>
      </UL>
    </GuideLayout>
  );
}
