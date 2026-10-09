import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { InfoPage } from "@/components/layout/InfoPage";
import { H2, P } from "@/components/layout/Prose";

export const metadata: Metadata = pageMetadata({
  title: "Advertising Disclosure",
  description: "How LineMath earns money: sportsbook affiliate commissions on some links, and why that never changes our math.",
  path: "/advertising-disclosure",
});

export default function AdvertisingDisclosurePage() {
  return (
    <InfoPage title="Advertising Disclosure" intro="LineMath is free to use. We may earn a commission when you sign up with a sportsbook through some links on this site.">
      <H2>How it works</H2>
      <P>
        Pages that show sportsbook offers are labelled &quot;Advertising Disclosure.&quot; If you click one of those links and open an
        account or place a qualifying bet, the sportsbook may pay LineMath a referral fee at no extra cost to you.
      </P>
      <H2>What it does not change</H2>
      <P>
        Calculator results come from open formulas and are never adjusted for, or influenced by, any sportsbook relationship. Offers
        are placed next to relevant tools, not ranked as recommendations, and terms vary by state — check each sportsbook&apos;s own
        terms before signing up.
      </P>
      <H2>21+ only</H2>
      <P>Offers are for adults 21 and older where sports betting is legal. If you or someone you know has a gambling problem, call 1-800-GAMBLER.</P>
    </InfoPage>
  );
}
