export interface EmbedTool {
  slug: string;
  title: string;
  /** Calculator page the widget links back to. */
  page: string;
  /** Suggested iframe height in px. */
  height: number;
}

/** Calculators that can be embedded on other sites via /embed/<slug>. */
export const EMBED_TOOLS: EmbedTool[] = [
  { slug: "odds-converter", title: "Odds Converter", page: "/odds-converter", height: 460 },
  { slug: "betting-odds-calculator", title: "Betting Odds Calculator", page: "/betting-odds-calculator", height: 520 },
  { slug: "parlay-calculator", title: "Parlay Calculator", page: "/parlay-calculator", height: 680 },
  { slug: "hedge-calculator", title: "Hedge Calculator", page: "/hedge-calculator", height: 560 },
  { slug: "ev-calculator", title: "EV Calculator", page: "/ev-calculator", height: 600 },
  { slug: "kelly-calculator", title: "Kelly Calculator", page: "/kelly-calculator", height: 640 },
];

export function getEmbedTool(slug: string): EmbedTool | undefined {
  return EMBED_TOOLS.find((tool) => tool.slug === slug);
}
