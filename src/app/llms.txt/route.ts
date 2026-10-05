import { CALCULATORS } from "@/lib/calculators";
import { GUIDES } from "@/lib/guides";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

/** Plain-text site summary for AI assistants and crawlers (llms.txt convention). */
export function GET() {
  const lines = [
    "# LineMath",
    "",
    "> Free, exact sports betting calculators for US bettors. American-odds native, no signup, all math runs in the browser.",
    "",
    "## Calculators",
    ...CALCULATORS.map((c) => `- [${c.shortTitle}](${SITE_URL}/${c.slug}): ${c.description}`),
    "",
    "## Guides",
    ...GUIDES.map((g) => `- [${g.title}](${SITE_URL}/guides/${g.slug}): ${g.description}`),
    "",
    "## About",
    `- [About & methodology](${SITE_URL}/about): how the math is computed and tested`,
    `- [Responsible gambling](${SITE_URL}/responsible-gambling): 21+, 1-800-GAMBLER`,
  ];
  return new Response(lines.join("\n") + "\n", { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
