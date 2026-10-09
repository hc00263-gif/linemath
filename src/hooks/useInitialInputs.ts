"use client";

import { useSearchParams } from "next/navigation";

/**
 * Returns a getter that reads a calculator's starting value from the URL, falling back to its
 * default. Paired with <ShareButton>, this is what makes a copied link reopen the exact same
 * calculation. Use inside a useState initializer so the URL only seeds the first render.
 */
export function useInitialInputs(): (key: string, fallback: string) => string {
  const params = useSearchParams();
  return (key, fallback) => params.get(key) ?? fallback;
}
