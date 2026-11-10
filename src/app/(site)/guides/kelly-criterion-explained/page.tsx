import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { getGuide } from "@/lib/guides";
import { GuideLayout } from "@/components/layout/GuideLayout";
import { Formula, H2, P, UL } from "@/components/layout/Prose";

const guide = getGuide("kelly-criterion-explained")!;
export const metadata: Metadata = pageMetadata({ title: guide.title, description: guide.description, path: `/guides/${guide.slug}` });

export default function Page() {
  return (
    <GuideLayout guide={guide}>
      <P>
        The Kelly criterion gives the bet size that maximizes the long-run growth of your bankroll, given your edge. Stake too little and you grow
        slowly; stake too much and variance can wipe you out.
      </P>
      <H2>The formula</H2>
      <Formula>{`f* = (b × p − q) / b
b = decimal odds − 1   p = win probability   q = 1 − p`}</Formula>
      <P>
        Example: a 55% chance at -110 (b = 0.909). f* = (0.909 × 0.55 − 0.45) / 0.909 = 5.5% of your bankroll. If the result is zero or negative there
        is no edge and the right stake is nothing.
      </P>
      <H2>Why fractional Kelly</H2>
      <P>
        Full Kelly assumes your probability is exactly right. In practice estimates are noisy, so most bettors stake half or quarter Kelly. That
        gives up a little growth in exchange for much smaller drawdowns, and protects you when your edge is overestimated.
      </P>
      <UL>
        <li>Kelly sizes each bet from your current bankroll, so stakes shrink after losses and grow after wins.</li>
        <li>Cap any single bet at a sensible percentage no matter what the formula says.</li>
      </UL>
    </GuideLayout>
  );
}
