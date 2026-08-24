"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

/**
 * Reads/writes the active sport from the `?sport=` URL query param, mirroring
 * useOddsFormat's pattern so filtered sports pages are shareable links.
 */
export function useSportFilter<T extends string>(validSports: readonly T[], defaultSport: T): [T, (sport: T) => void] {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const sport = useMemo<T>(() => {
    const raw = searchParams.get("sport");
    return (validSports as readonly string[]).includes(raw ?? "") ? (raw as T) : defaultSport;
  }, [searchParams, validSports, defaultSport]);

  const setSport = useCallback(
    (next: T) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("sport", next);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  return [sport, setSport];
}
