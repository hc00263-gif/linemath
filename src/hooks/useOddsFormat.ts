"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { OddsFormat } from "@/lib/odds/convert";

const VALID_FORMATS: OddsFormat[] = ["american", "decimal", "fractional"];
const DEFAULT_FORMAT: OddsFormat = "american";

/**
 * Reads/writes the shared odds display format from the `?fmt=` URL query param, so a
 * shared calculator link preserves the format the sender was viewing. Implied isn't a
 * selectable input format (nobody types "40%" as their primary odds notation) so it's
 * intentionally excluded from the toggle.
 */
export function useOddsFormat(): [OddsFormat, (format: OddsFormat) => void] {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const format = useMemo<OddsFormat>(() => {
    const raw = searchParams.get("fmt");
    return VALID_FORMATS.includes(raw as OddsFormat) ? (raw as OddsFormat) : DEFAULT_FORMAT;
  }, [searchParams]);

  const setFormat = useCallback(
    (next: OddsFormat) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("fmt", next);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  return [format, setFormat];
}
