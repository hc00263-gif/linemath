import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LineMath — Sports Betting Calculators",
    short_name: "LineMath",
    description: "Fast, free sports betting calculators for US bettors.",
    start_url: "/",
    display: "standalone",
    background_color: "#0c0e11",
    theme_color: "#0c0e11",
    icons: [
      { src: "/icons/192", sizes: "192x192", type: "image/png" },
      { src: "/icons/512", sizes: "512x512", type: "image/png" },
    ],
  };
}
