"use client";

import { useEffect, useState } from "react";

type Status = "unsupported" | "unconfigured" | "loading" | "off" | "on" | "denied";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

function urlBase64ToUint8Array(base64Url: string): Uint8Array {
  const padding = "=".repeat((4 - (base64Url.length % 4)) % 4);
  const base64 = (base64Url + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const bytes = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
  return bytes;
}

/** Computed once per mount, synchronously, so the initial render never needs a setState-in-effect
 * just to rule out "unconfigured"/"unsupported"/"denied" — only the async subscription lookup
 * (which genuinely needs an effect) runs after mount. */
function initialStatus(): Status {
  if (!VAPID_PUBLIC_KEY) return "unconfigured";
  if (typeof window === "undefined") return "loading";
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) return "unsupported";
  if (Notification.permission === "denied") return "denied";
  return "loading";
}

/** Lets a visitor opt into browser push notifications for major breaking news. Free — uses the
 * native Web Push API rather than a paid email/SMS provider. */
export function PushSubscribeButton() {
  const [status, setStatus] = useState<Status>(initialStatus);

  useEffect(() => {
    if (status !== "loading") return;
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => registration.pushManager.getSubscription())
      .then((subscription) => setStatus(subscription ? "on" : "off"))
      .catch(() => setStatus("unsupported"));
  }, [status]);

  async function subscribe() {
    if (!VAPID_PUBLIC_KEY) return;
    setStatus("loading");
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus(permission === "denied" ? "denied" : "off");
        return;
      }
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) as BufferSource,
      });
      const res = await fetch("/api/news/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription: subscription.toJSON() }),
      });
      setStatus(res.ok ? "on" : "off");
    } catch {
      setStatus("off");
    }
  }

  async function unsubscribe() {
    setStatus("loading");
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await fetch("/api/news/subscribe", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        });
        await subscription.unsubscribe();
      }
      setStatus("off");
    } catch {
      setStatus("on");
    }
  }

  if (status === "unsupported" || status === "unconfigured") return null;

  if (status === "denied") {
    return (
      <p className="text-xs text-ink-dim">
        Notifications are blocked in your browser settings — enable them for this site to get breaking-news alerts.
      </p>
    );
  }

  return (
    <button
      type="button"
      onClick={status === "on" ? unsubscribe : subscribe}
      disabled={status === "loading"}
      className="rounded-full border border-line px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition disabled:opacity-50 aria-pressed:bg-ink aria-pressed:text-surface"
      aria-pressed={status === "on"}
    >
      {status === "loading" ? "…" : status === "on" ? "Alerts on ✓" : "Get breaking news alerts"}
    </button>
  );
}
