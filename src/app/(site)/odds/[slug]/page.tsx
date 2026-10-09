import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { pageMetadata, SITE_URL } from "@/lib/seo";
import { ALL_ODDS, neighbors, oddsFacts, oddsLabel, oddsToSlug, slugToOdds } from "@/lib/oddsPages";
import { formatAmerican, formatCurrency, formatDecimal, formatFractional, formatImplied } from "@/lib/odds/format";
import { InfoPage } from "@/components/layout/InfoPage";
import { H2, P } from "@/components/layout/Prose";
import { BreadcrumbSchema, FaqSchema } from "@/components/layout/Schema";

export const dynamicParams = false;

export function generateStaticParams() {
  return ALL_ODDS.map((odds) => ({ slug: oddsToSlug(odds) }));
}

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const american = slugToOdds(slug);
  if (american === null) return {};
  const f = oddsFacts(american);
  return pageMetadata({
    title: `${f.label} Odds Explained: Payout, Decimal & Win Probability`,
    description: `${f.label} odds mean ${f.isFavorite ? `you bet ${formatCurrency(f.stakeToWin100)} to win $100` : `a $100 bet wins ${formatCurrency(100 * (f.odds.decimal - 1))}`}. That is ${formatDecimal(f.odds.decimal)} in decimal odds, ${formatFractional(f.odds.fractional)} fractional, and a ${formatImplied(f.odds.implied)} implied win probability.`,
    path: `/odds/${slug}`,
  });
}

export default async function OddsPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const american = slugToOdds(slug);
  if (american === null) notFound();
  const f = oddsFacts(american);
  const { prev, next } = neighbors(american);
  const win100 = 100 * (f.odds.decimal - 1);

  const meaning = f.isFavorite
    ? `${f.label} means you must bet ${formatCurrency(f.stakeToWin100)} to win $100 in profit. A winning ${formatCurrency(f.stakeToWin100)} bet returns ${formatCurrency(f.stakeToWin100 + 100)} — your stake plus $100.`
    : `${f.label} means a $100 bet wins ${formatCurrency(win100)} in profit. A winning $100 bet returns ${formatCurrency(100 + win100)} — your stake plus ${formatCurrency(win100)}.`;

  const faq = [
    {
      question: `How much do you win on a $100 bet at ${f.label}?`,
      answer: `A $100 bet at ${f.label} wins ${formatCurrency(win100)} in profit and returns ${formatCurrency(100 + win100)} in total, including your stake.`,
    },
    {
      question: `What win rate do you need to break even at ${f.label}?`,
      answer: `${formatImplied(f.breakEven)}. Over 100 bets at ${f.label} you need at least ${f.minWinsOf100} wins to finish in profit, assuming flat stakes.`,
    },
    {
      question: `Is ${f.label} a favorite or an underdog?`,
      answer: f.isFavorite
        ? `${f.label} is the favorite's price: the negative number means the sportsbook thinks this side is more likely to win than not.`
        : american === 100
          ? "+100 is even money: a $100 bet wins $100, and the market treats the outcome as roughly a coin flip."
          : `${f.label} is the underdog's price: a positive number means you win more than you risk, because the outcome is less likely than not.`,
    },
    {
      question: `What are ${f.label} odds in decimal and fractional?`,
      answer: `${f.label} is ${formatDecimal(f.odds.decimal)} in decimal odds and ${formatFractional(f.odds.fractional)} in fractional odds.`,
    },
  ];

  return (
    <InfoPage title={`What Does ${f.label} Mean in Betting?`} intro={meaning}>
      <FaqSchema items={faq} />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Odds explained", url: `${SITE_URL}/odds` },
          { name: f.label, url: `${SITE_URL}/odds/${slug}` },
        ]}
      />

      <H2>{f.label} in every format</H2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["American", formatAmerican(f.odds.american)],
          ["Decimal", formatDecimal(f.odds.decimal)],
          ["Fractional", formatFractional(f.odds.fractional)],
          ["Implied win %", formatImplied(f.odds.implied)],
        ].map(([k, v]) => (
          <div key={k} className="rounded-xl border border-line bg-surface p-4">
            <div className="text-xs text-ink-dim">{k}</div>
            <div className="mt-1 font-mono text-xl font-semibold tabular-nums text-ink">{v}</div>
          </div>
        ))}
      </div>

      <H2>{f.label} payout table</H2>
      <div className="overflow-x-auto rounded-xl border border-line bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="text-xs text-ink-dim">
            <tr>
              <th className="px-4 py-2 font-medium">Stake</th>
              <th className="px-2 py-2 text-right font-medium">Profit if it wins</th>
              <th className="px-4 py-2 text-right font-medium">Total payout</th>
            </tr>
          </thead>
          <tbody className="font-mono tabular-nums text-ink">
            {f.rows.map((r) => (
              <tr key={r.stake} className="border-t border-line">
                <td className="px-4 py-2">{formatCurrency(r.stake)}</td>
                <td className="px-2 py-2 text-right text-positive">{formatCurrency(r.profit)}</td>
                <td className="px-4 py-2 text-right">{formatCurrency(r.payout)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <H2>What win rate does {f.label} need?</H2>
      <P>
        To break even at {f.label} you have to win {formatImplied(f.breakEven)} of your bets. Over 100 flat-stake bets that means at
        least {f.minWinsOf100} wins to be in profit. {f.isFavorite ? "Favorites win often but pay less than they risk, so the break-even rate is above 50%." : american === 100 ? "At even money you simply need to win more than half." : "Underdogs win less often but pay more than they risk, so the break-even rate is below 50%."}
      </P>

      <H2>{f.label} in a parlay</H2>
      <P>
        Parlay legs multiply. Two legs at {f.label} combine to {formatAmerican(f.twoLeg.american)} — a $100 bet pays{" "}
        {formatCurrency(f.twoLegPayout100)} — and three legs combine to {formatAmerican(f.threeLeg.american)}, paying{" "}
        {formatCurrency(f.threeLegPayout100)}. All legs must win.
      </P>

      <H2>Try it with your numbers</H2>
      <div className="flex flex-wrap gap-2">
        {[
          [`/betting-odds-calculator?odds=${encodeURIComponent(f.label)}&stake=100`, "Payout calculator"],
          [`/odds-converter?odds=${encodeURIComponent(f.label)}`, "Odds converter"],
          [`/break-even-calculator?odds=${encodeURIComponent(f.label)}`, "Break-even calculator"],
          [`/parlay-calculator?legs=${encodeURIComponent(`${f.label},${f.label},${f.label}`)}`, "Parlay calculator"],
        ].map(([href, text]) => (
          <Link key={href} href={href} className="rounded-lg border border-line px-3 py-2 text-sm font-medium text-ink transition-colors hover:border-accent/50">
            {text} →
          </Link>
        ))}
      </div>

      <H2>Frequently asked questions</H2>
      <div className="flex flex-col gap-4">
        {faq.map((item) => (
          <div key={item.question}>
            <h3 className="font-medium text-ink">{item.question}</h3>
            <p className="text-sm">{item.answer}</p>
          </div>
        ))}
      </div>

      <nav aria-label="Nearby odds" className="mt-2 flex flex-wrap items-center justify-between gap-2 text-sm">
        {prev !== null ? (
          <Link href={`/odds/${oddsToSlug(prev)}`} className="rounded-full border border-line px-3 py-1.5 hover:border-accent/50">
            ← {oddsLabel(prev)}
          </Link>
        ) : (
          <span />
        )}
        <Link href="/odds" className="underline underline-offset-2">
          All odds
        </Link>
        {next !== null ? (
          <Link href={`/odds/${oddsToSlug(next)}`} className="rounded-full border border-line px-3 py-1.5 hover:border-accent/50">
            {oddsLabel(next)} →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </InfoPage>
  );
}
