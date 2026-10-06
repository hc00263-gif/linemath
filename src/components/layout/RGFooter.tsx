import Link from "next/link";

export function RGFooter() {
  return (
    <footer className="border-t border-line px-4 py-6 text-xs text-ink-dim">
      <div className="mx-auto flex max-w-4xl flex-col gap-2">
        <p>
          21+. Gambling problem? Call{" "}
          <a href="tel:1-800-426-2537" className="underline underline-offset-2">
            1-800-GAMBLER
          </a>
          . For help, visit the{" "}
          <a
            href="https://www.ncpgambling.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
          >
            National Council on Problem Gambling
          </a>
          .
        </p>
        <p>
          LineMath&apos;s calculators are informational and educational tools only. They are not
          financial or betting advice, and payouts can differ from what your sportsbook
          actually settles — always verify with your book before betting. LineMath may earn a
          commission from sportsbook offers linked on this site.
        </p>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-4">
          <Link href="/about" className="inline-block py-1 underline underline-offset-2">About &amp; methodology</Link>
          <Link href="/guides" className="inline-block py-1 underline underline-offset-2">Guides</Link>
          <Link href="/responsible-gambling" className="inline-block py-1 underline underline-offset-2">Responsible gambling</Link>
          <Link href="/advertising-disclosure" className="inline-block py-1 underline underline-offset-2">Advertising disclosure</Link>
          <Link href="/terms" className="inline-block py-1 underline underline-offset-2">Terms</Link>
          <Link href="/privacy" className="inline-block py-1 underline underline-offset-2">Privacy</Link>
        </nav>
        <p>© {new Date().getFullYear()} LineMath.</p>
      </div>
    </footer>
  );
}
