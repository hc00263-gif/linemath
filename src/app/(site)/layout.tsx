import { Header } from "@/components/layout/Header";
import { RGFooter } from "@/components/layout/RGFooter";

/** Chrome for every normal site page. Embed pages live outside this group so they render bare. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <RGFooter />
    </>
  );
}
