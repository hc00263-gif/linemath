import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/seo";
import { HUB_LEAGUES, getHubLeague } from "@/lib/hub/leagues";
import { getHubBoard, isHubConfigured } from "@/lib/hub/store";
import { BestOddsBoard } from "@/components/odds/BestOddsBoard";
import { Freshness, NoData, PriceDisclaimer } from "@/components/odds/Freshness";
import { OddsSubnav } from "@/components/odds/OddsSubnav";

export const revalidate = 300;
export const dynamicParams = false;

export function generateStaticParams() {
  return HUB_LEAGUES.map((l) => ({ league: l.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ league: string }> }): Promise<Metadata> {
  const { league } = await params;
  const info = getHubLeague(league);
  if (!info) return {};
  return pageMetadata({
    title: `${info.label} Odds — Best Lines Across Sportsbooks`,
    description: `Compare ${info.label} moneyline, spread and total prices across sportsbooks and see the best available price on every side.`,
    path: `/best-odds/${info.slug}`,
  });
}

export default async function LeagueOddsPage({ params }: { params: Promise<{ league: string }> }) {
  const { league } = await params;
  const info = getHubLeague(league);
  if (!info) notFound();
  const board = await getHubBoard(info.slug);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8">
      <div className="flex flex-col gap-2">
        <Link href="/best-odds" className="text-sm text-ink-dim hover:text-ink">
          ← All leagues
        </Link>
        <h1 className="font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">{info.label} Odds</h1>
        <p className="text-sm text-ink-dim">
          Best price on every side, with every book a tap away. Highlighted prices are the best available.
        </p>
      </div>

      <OddsSubnav current="/best-odds" />

      {board && board.games.length > 0 ? (
        <>
          <Freshness updated={board.updated} />
          <BestOddsBoard board={board} />
        </>
      ) : (
        <>
          <NoData configured={isHubConfigured()} />
          {info.sport === "Soccer" && (
            <p className="text-sm text-ink-dim">
              Soccer boards fill in when matches are within a week, so they stay empty during international breaks.
            </p>
          )}
        </>
      )}

      <PriceDisclaimer />
    </div>
  );
}
