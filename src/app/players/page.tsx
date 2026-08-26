import type { Metadata } from "next";
import { Suspense } from "react";
import { PlayerSearch } from "@/components/sports/PlayerSearch";
import { getSportsTool } from "@/lib/sportsTools";

const meta = getSportsTool("players")!;

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: `/${meta.slug}` },
};

export default function PlayersPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-8">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{meta.title}</h1>
      <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-black/[.03] dark:bg-white/[.04]" />}>
        <PlayerSearch />
      </Suspense>
    </div>
  );
}
