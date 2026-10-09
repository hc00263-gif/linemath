import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { InfoPage } from "@/components/layout/InfoPage";
import { H2, P, UL } from "@/components/layout/Prose";

export const metadata: Metadata = pageMetadata({
  title: "Responsible Gambling — Help & Resources",
  description: "LineMath is for adults 21+. Find help for problem gambling: call 1-800-GAMBLER and visit the National Council on Problem Gambling.",
  path: "/responsible-gambling",
});

export default function ResponsibleGamblingPage() {
  return (
    <InfoPage title="Responsible Gambling" intro="Betting should be entertainment, never a way to make money you need or to chase losses.">
      <H2>Get help now</H2>
      <UL>
        <li>
          Call or text <a className="underline" href="tel:1-800-426-2537">1-800-GAMBLER (1-800-426-2537)</a> — free, confidential, 24/7 in the US.
        </li>
        <li>
          Visit the <a className="underline" href="https://www.ncpgambling.org/" target="_blank" rel="noopener noreferrer">National Council on Problem Gambling</a> for chat, text, and local resources.
        </li>
      </UL>
      <H2>Our position</H2>
      <P>
        LineMath is intended for people aged 21 and over where sports betting is legal. Our calculators show math, not guarantees:
        expected value and arbitrage results are long-run or before-risk figures, and no tool here can promise a profit.
      </P>
      <H2>Healthy limits</H2>
      <UL>
        <li>Only wager money you can afford to lose.</li>
        <li>Set a budget and time limit before you start, and stick to it.</li>
        <li>Never chase losses or bet to fix a financial problem.</li>
        <li>Use your sportsbook&apos;s deposit limits, cool-off, and self-exclusion tools.</li>
      </UL>
    </InfoPage>
  );
}
