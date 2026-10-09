import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { getGuide } from "@/lib/guides";
import { GuideLayout } from "@/components/layout/GuideLayout";
import { Formula, H2, P, UL } from "@/components/layout/Prose";

const guide = getGuide("how-to-read-american-odds")!;
export const metadata: Metadata = pageMetadata({ title: guide.title, description: guide.description, path: `/guides/${guide.slug}` });

export default function Page() {
  return (
    <GuideLayout guide={guide}>
      <P>
        American (moneyline) odds are the standard at US sportsbooks. Every price is a number that is either positive or negative,
        and the sign tells you which way to read it.
      </P>
      <H2>Negative odds: the favorite</H2>
      <P>A negative number is how much you must bet to win $100. At -150 you risk $150 to win $100. At -110 you risk $110 to win $100.</P>
      <H2>Positive odds: the underdog</H2>
      <P>A positive number is how much you win on a $100 bet. At +150 a $100 bet wins $150. At +300 it wins $300.</P>
      <H2>Converting to decimal odds</H2>
      <Formula>{`positive:  decimal = 1 + odds / 100     (+150 → 2.50)
negative:  decimal = 1 + 100 / |odds|   (-200 → 1.50)`}</Formula>
      <P>Decimal odds are your total return per $1 staked, stake included — which is why every other calculation starts there.</P>
      <H2>Converting to implied probability</H2>
      <P>Implied probability is 1 divided by the decimal odds. It is the win chance the price needs to break even.</P>
      <Formula>{`+150 → 2.50 decimal → 40.00%
+100 → 2.00 decimal → 50.00%
-110 → 1.91 decimal → 52.38%
-200 → 1.50 decimal → 66.67%`}</Formula>
      <H2>Why -110 isn&apos;t 50%</H2>
      <P>
        A fair coin flip would be +100 on both sides. At -110 you must win 52.38% of the time to break even, and the 2.38 extra
        points on each side are the sportsbook&apos;s margin — see <a className="underline" href="/guides/what-is-vig">what is vig</a>.
      </P>
      <H2>Quick reminders</H2>
      <UL>
        <li>American odds never fall between -100 and +100; even money is +100.</li>
        <li>Payout includes your stake; profit does not.</li>
      </UL>
    </GuideLayout>
  );
}
