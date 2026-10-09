import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { InfoPage } from "@/components/layout/InfoPage";
import { H2, P, UL } from "@/components/layout/Prose";

export const metadata: Metadata = pageMetadata({
  title: "About LineMath & How Our Math Is Verified",
  description:
    "LineMath builds free, exact sports betting calculators. See how every payout is computed, tested, and kept free of the common errors found on other calculator sites.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <InfoPage
      title="About LineMath"
      intro="LineMath is a set of fast, free, no-signup betting calculators for US bettors — built so the numbers are right."
    >
      <H2>Why it exists</H2>
      <P>
        Most betting calculators are buried in ad-heavy content pages, slow on mobile, and quietly wrong in places. LineMath does one
        thing: put an exact answer on screen the instant you type, with no account, no paywall, and no clutter.
      </P>
      <H2>How we keep the math right</H2>
      <UL>
        <li>Every calculator runs entirely in your browser. Your stakes and odds are never sent to a server.</li>
        <li>All odds, parlay, hedge, bonus-bet, no-vig, EV, Kelly, and arbitrage formulas live in one shared, unit-tested library.</li>
        <li>
          Tests check known answers to the cent — for example, three -110 legs must pay $695.79 on a $100 stake, and a $100 bonus
          bet at +200 hedged at -220 must convert to 62.5% in cash.
        </li>
        <li>
          Bonus bets are modelled correctly: a free bet does not return its stake, a mistake that overstates conversion on many other sites.
        </li>
        <li>Inputs that can&apos;t produce a valid result show an inline message — never a blank or NaN.</li>
      </UL>
      <H2>What we are not</H2>
      <P>
        LineMath is not a sportsbook, doesn&apos;t accept bets, and doesn&apos;t give betting advice. Results are informational and
        educational; payouts can differ from what your sportsbook settles, so always verify with your book. Some pages link to
        sportsbooks, and we may earn a commission — see our <Link className="underline" href="/advertising-disclosure">advertising disclosure</Link>.
      </P>
      <H2>Play responsibly</H2>
      <P>
        You must be 21+. If gambling is a problem, call 1-800-GAMBLER. More on our <Link className="underline" href="/responsible-gambling">responsible gambling</Link> page.
      </P>
    </InfoPage>
  );
}
