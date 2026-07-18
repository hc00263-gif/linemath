import { ReactNode, Suspense } from "react";
import { AffiliateSlot } from "./AffiliateSlot";
import { RelatedCalculators } from "./RelatedCalculators";
import { FaqItem, FaqSchema, WebApplicationSchema } from "./Schema";

/** Reserves roughly a calculator's height so the Suspense fallback doesn't shift layout (CLS). */
function CalculatorSkeleton() {
  return <div className="h-[420px] animate-pulse rounded-xl bg-black/[.03] dark:bg-white/[.04]" />;
}

export interface CalculatorPageShellProps {
  h1: string;
  slug: string;
  category: string;
  schemaDescription: string;
  calculator: ReactNode;
  explainer: ReactNode;
  faq: FaqItem[];
}

const SITE_URL = "https://linemath.com";

/**
 * Shared layout for every calculator page: H1, calculator above the fold, affiliate
 * slot, explainer copy, FAQ (rendered + JSON-LD), and internal links to other tools.
 */
export function CalculatorPageShell({
  h1,
  slug,
  category,
  schemaDescription,
  calculator,
  explainer,
  faq,
}: CalculatorPageShellProps) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-8">
      <WebApplicationSchema name={h1} description={schemaDescription} url={`${SITE_URL}/${slug}`} />
      <FaqSchema items={faq} />

      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{h1}</h1>

      <Suspense fallback={<CalculatorSkeleton />}>{calculator}</Suspense>

      <AffiliateSlot category={category} />

      <div className="flex flex-col gap-3 text-sm leading-relaxed text-black/70 dark:text-white/70">
        {explainer}
      </div>

      <section aria-label="Frequently asked questions" className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">FAQ</h2>
        {faq.map((item) => (
          <div key={item.question}>
            <h3 className="font-medium">{item.question}</h3>
            <p className="text-sm text-black/70 dark:text-white/70">{item.answer}</p>
          </div>
        ))}
      </section>

      <RelatedCalculators exclude={slug} />
    </div>
  );
}
