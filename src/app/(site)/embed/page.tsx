import type { Metadata } from "next";
import { pageMetadata, SITE_URL } from "@/lib/seo";
import { EMBED_TOOLS } from "@/lib/embeds";
import { InfoPage } from "@/components/layout/InfoPage";
import { H2, P } from "@/components/layout/Prose";

export const metadata: Metadata = pageMetadata({
  title: "Embed LineMath Calculators on Your Site",
  description: "Add a free LineMath betting calculator to your blog or site with one line of HTML. No signup, no API key.",
  path: "/embed",
});

function snippet(slug: string, title: string, height: number) {
  return `<iframe src="${SITE_URL}/embed/${slug}" width="100%" height="${height}" style="border:0;max-width:640px" loading="lazy" title="${title} by LineMath"></iframe>`;
}

export default function EmbedDocsPage() {
  const preview = EMBED_TOOLS[0];
  return (
    <InfoPage title="Embed a Calculator" intro="Put a LineMath calculator on your own site. Copy the line of HTML below — it's free, needs no signup, and keeps working on its own.">
      <H2>Live preview</H2>
      <iframe
        src={`/embed/${preview.slug}`}
        width="100%"
        height={preview.height}
        loading="lazy"
        title={`${preview.title} preview`}
        className="max-w-xl rounded-xl border border-line"
      />
      <H2>Choose a calculator</H2>
      <div className="flex flex-col gap-5">
        {EMBED_TOOLS.map((tool) => (
          <div key={tool.slug}>
            <h3 className="mb-1.5 font-medium text-ink">{tool.title}</h3>
            <pre className="overflow-x-auto rounded-lg border border-line bg-surface px-4 py-3 font-mono text-[12.5px] leading-relaxed whitespace-pre-wrap text-ink">{snippet(tool.slug, tool.title, tool.height)}</pre>
          </div>
        ))}
      </div>
      <H2>Good to know</H2>
      <P>
        Each embed shows a small &quot;by LineMath&quot; credit that links to the full calculator; please leave it in place. Calculations run in
        the visitor&apos;s browser, and embedded pages are kept out of search results so they never compete with your own page. The
        calculators are informational only and are intended for adults 21+.
      </P>
    </InfoPage>
  );
}
