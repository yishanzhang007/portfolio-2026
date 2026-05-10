import { CaseStudyHero } from "@/components/CaseStudyHero";
import { CaseStudyLayout } from "@/components/CaseStudyLayout";
import { CaseStudySection } from "@/components/CaseStudySection";

export function ShopifyTax() {
  return (
    <CaseStudyLayout
      hero={
        <>
          <CaseStudyHero
            src="/work/clinic-ai-assistant/Shopify%201.svg"
            alt="Shopify Tax EU/UK — VAT invoice generation surface."
            width={1298}
            height={1026}
            centered
          />
          <div className="-mt-[4px] md:-mt-[48px]">
            <CaseStudyHero
              src="/work/clinic-ai-assistant/shopify%202.svg"
              alt="Shopify Tax EU/UK — additional product screen."
              width={1000}
              height={743}
            />
          </div>
        </>
      }
    >
      <CaseStudySection label="Shopify Tax">
        <p>
          Shopify Tax EU/UK lets merchants automatically generate and send
          VAT invoices, addressing the top tax challenges for EMEA merchants
          and supporting Shopify&rsquo;s push into the region. As lead
          designer and project champion, I drove design, research, and PM
          end-to-end. Shipped to 100 Early Access merchants in August 2024
          and launched broadly in October 2024.
        </p>
      </CaseStudySection>
    </CaseStudyLayout>
  );
}
