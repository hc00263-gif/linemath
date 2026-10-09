import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { InfoPage } from "@/components/layout/InfoPage";
import { H2, P } from "@/components/layout/Prose";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Use",
  description: "LineMath's calculators are informational and educational tools. Read the terms for using this site.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <InfoPage title="Terms of Use" intro="By using LineMath you agree to these terms. They are a plain-language summary, not legal advice.">
      <H2>Informational use only</H2>
      <P>
        All calculators, guides, news, schedules, and player data are provided for information and education. They are not
        financial, legal, or betting advice, and we make no guarantee of profit. Verify every payout with your sportsbook before betting.
      </P>
      <H2>No warranty</H2>
      <P>
        We work to keep results exact and tested, but the site is provided &quot;as is.&quot; Sports data and news may be delayed,
        incomplete, or wrong. LineMath is not liable for losses arising from use of the site.
      </P>
      <H2>Eligibility</H2>
      <P>You must be 21 or older, and sports betting must be legal where you are, to act on any information here.</P>
      <H2>Third-party links</H2>
      <P>We link to sportsbooks and news sources we don&apos;t control; their terms and privacy practices apply once you leave LineMath.</P>
      <H2>Changes</H2>
      <P>We may update these terms and the site at any time.</P>
    </InfoPage>
  );
}
