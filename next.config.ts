import type { NextConfig } from "next";

/** Security headers applied to every response. CSP is deliberately permissive on 'unsafe-inline'
 * for styles (Tailwind + Next's inline style injection) but locks down script sources, framing,
 * and object embeds — the combination that matters most for an XSS/clickjacking baseline on a
 * site with no user-generated content and no login. */
function buildHeaders(frameable: boolean) {
  return [
    ...(frameable ? [] : [{ key: "X-Frame-Options", value: "DENY" }]),
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    {
      key: "Content-Security-Policy",
      value: [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https:",
        "font-src 'self' data:",
        "connect-src 'self' https:",
        `frame-ancestors ${frameable ? "*" : "'none'"}`,
        "base-uri 'self'",
        "form-action 'self'",
      ].join("; "),
    },
  ];
}

const nextConfig: NextConfig = {
  async headers() {
    return [
      // Everything except the embeddable widgets stays un-frameable (clickjacking protection).
      { source: "/((?!embed/).*)", headers: buildHeaders(false) },
      // /embed/<tool> is meant to be iframed on other sites.
      { source: "/embed/:tool", headers: buildHeaders(true) },
    ];
  },
};

export default nextConfig;
