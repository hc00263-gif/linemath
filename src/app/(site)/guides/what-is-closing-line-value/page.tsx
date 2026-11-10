import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { getGuide } from "@/lib/guides";
import { GuideLayout } from "@/components/layout/GuideLayout";
import { Formula, H2, P, UL } from "@/components/layout/Prose";

const guide = getGuide("what-is-closing-line-value")!;
export const metadata: Metadata = pageMetadata({ title: guide.title, description: guide.description, path: `/guides/${guide.slug}` });

export default function Page() {
  return (
    <GuideLayout guide={guide}>
      <P>
        Closing line value (CLV) compares the price you bet with the price the market settled on right before the game started. The closing line is the
        most informed price of the day, so consistently getting a better number than it is strong evidence that your bets have an edge.
      </P>
      <H2>A concrete example</H2>
      <P>
        You bet a side at +110 (decimal 2.10). By kickoff it has moved to -110 (decimal 1.909). You got a better price than the market ended up
        offering:
      </P>
      <Formula>{`CLV = your decimal odds / closing decimal odds − 1
    = 2.10 / 1.909 − 1 = 10.0%`}</Formula>
      <H2>Why it matters</H2>
      <P>
        Results are noisy: a bettor with a real 3% edge can still lose over hundreds of bets. CLV is far less noisy because it measures the price,
        not the outcome. A positive average CLV over a few hundred bets is a better signal than a short winning streak.
      </P>
      <H2>Raw close versus no-vig close</H2>
      <P>
        The closing odds include the sportsbook&apos;s margin. Comparing against the raw close overstates CLV. When you have both sides of the closing
        market, remove the vig first (see the no-vig calculator) and compare against the fair closing price.
      </P>
      <UL>
        <li>CLV is a signal, not a guarantee: it assumes the closing line is efficient, which is truer in liquid markets than in thin props.</li>
        <li>Track closing odds for every bet in the bet tracker to see your average CLV by sport and bet type.</li>
      </UL>
    </GuideLayout>
  );
}
