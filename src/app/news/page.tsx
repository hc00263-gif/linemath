import type { Metadata } from "next";
import { getSportsTool } from "@/lib/sportsTools";
import { getRecentItems } from "@/lib/news/store";
import { isStoreConfigured } from "@/lib/news/store";
import { NewsFeed } from "@/components/news/NewsFeed";
import { PushSubscribeButton } from "@/components/news/PushSubscribeButton";

export const dynamic = "force-dynamic";

const meta = getSportsTool("news")!;

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: `/${meta.slug}` },
};

export default async function NewsPage() {
  const configured = isStoreConfigured();
  const items = configured ? await getRecentItems(200) : [];

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">{meta.title}</h1>
        <p className="text-sm text-ink-dim">{meta.description}</p>
        <div>
          <PushSubscribeButton />
        </div>
      </div>

      {!configured ? (
        <p className="rounded-xl border border-line bg-surface p-4 text-sm text-ink-dim">
          News monitoring isn&apos;t configured yet — set the Upstash Redis environment variables to enable this
          page.
        </p>
      ) : items.length === 0 ? (
        <p className="rounded-xl border border-line bg-surface p-4 text-sm text-ink-dim">
          No stories ingested yet. The feed updates automatically every few minutes.
        </p>
      ) : (
        <NewsFeed items={items} />
      )}
    </div>
  );
}
