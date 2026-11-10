import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { getGuide } from "@/lib/guides";
import { GuideLayout } from "@/components/layout/GuideLayout";
import { H2, P, UL } from "@/components/layout/Prose";

const guide = getGuide("how-to-read-point-spreads")!;
export const metadata: Metadata = pageMetadata({ title: guide.title, description: guide.description, path: `/guides/${guide.slug}` });

export default function Page() {
  return (
    <GuideLayout guide={guide}>
      <P>
        A point spread levels a game by giving the underdog a head start. The favorite carries a minus sign and must win by more than that many points;
        the underdog carries a plus sign and can lose by fewer points, or win outright, and still cover.
      </P>
      <H2>Reading a spread</H2>
      <UL>
        <li><strong>Chiefs -3.5:</strong> Kansas City must win by 4 or more to cover.</li>
        <li><strong>Bills +3.5:</strong> Buffalo covers if it wins, or loses by 3 or fewer.</li>
        <li><strong>Whole numbers:</strong> at -3, a 3-point win is a push and your stake is refunded.</li>
      </UL>
      <H2>Spread to moneyline</H2>
      <P>
        A spread and a moneyline describe the same game two ways. Because final margins in a sport are roughly normally distributed, a spread can be
        converted into an estimated win probability and then into a fair moneyline. The result is an estimate, not a market price, and real books add
        their own margin and adjust for key numbers like 3 and 7 in football.
      </P>
      <P>
        The spread-to-moneyline calculator does this conversion for NFL and NBA games, and can also work backwards from a moneyline to the spread it implies.
      </P>
      <UL>
        <li>Standard spread juice of -110 on both sides means you need to win 52.38% of bets to break even.</li>
        <li>Bigger spreads imply bigger moneyline gaps, but the relationship is not linear.</li>
      </UL>
    </GuideLayout>
  );
}
