"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Copies a link that reopens this calculator with the current inputs filled in. The URL is also
 * written to the address bar, so the link can still be copied by hand if the clipboard is blocked.
 */
export function ShareButton({ params }: { params: Record<string, string> }) {
  const pathname = usePathname();
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  async function share() {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== "") query.set(key, value);
    }
    // Inside an embed, share the real calculator page rather than the (noindex) embed URL.
    const embedded = pathname.startsWith("/embed/");
    const sharePath = embedded ? pathname.slice("/embed".length) : pathname;
    const url = `${embedded ? "https://www.linemath.com" : window.location.origin}${sharePath}?${query.toString()}`;
    if (!embedded) window.history.replaceState(null, "", url);
    try {
      await navigator.clipboard.writeText(url);
      setState("copied");
    } catch {
      setState("failed");
    }
    window.setTimeout(() => setState("idle"), 2500);
  }

  return (
    <button
      type="button"
      onClick={share}
      className="self-start rounded-lg border border-line px-3 py-1.5 text-sm font-medium text-ink transition-colors hover:border-accent/50"
      aria-live="polite"
    >
      {state === "copied" ? "Link copied ✓" : state === "failed" ? "Copy the link from your address bar" : "Copy link to this result"}
    </button>
  );
}
