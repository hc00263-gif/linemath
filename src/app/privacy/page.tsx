import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { InfoPage } from "@/components/layout/InfoPage";
import { H2, P, UL } from "@/components/layout/Prose";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description: "LineMath has no accounts and runs calculators in your browser. See exactly what limited data the site collects.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <InfoPage title="Privacy Policy" intro="LineMath has no accounts and doesn't ask for personal information.">
      <H2>Calculators</H2>
      <P>Stakes, odds, and results are computed in your browser and are never transmitted to or stored on our servers.</P>
      <H2>What we do collect</H2>
      <UL>
        <li>
          <strong className="text-ink">Aggregate analytics:</strong> we use Vercel Analytics to count page views and referrers. It is cookie-free and does not build personal profiles.
        </li>
        <li>
          <strong className="text-ink">Breaking-news alerts (optional):</strong> if you turn them on, your browser&apos;s push subscription (an anonymous endpoint and keys supplied by your browser) is stored so we can send alerts. Turn alerts off on the News page to delete it.
        </li>
        <li>
          <strong className="text-ink">Server logs:</strong> our host may keep standard request logs (such as IP address) for security and operations.
        </li>
      </UL>
      <H2>Third parties</H2>
      <P>If you click a sportsbook link, that company may set its own cookies and track the referral. Their privacy policy governs that data.</P>
    </InfoPage>
  );
}
