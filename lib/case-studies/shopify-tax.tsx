import { CaseStudyHero } from "@/components/CaseStudyHero";
import { CaseStudyLayout } from "@/components/CaseStudyLayout";
import { CaseStudySection } from "@/components/CaseStudySection";

export function ShopifyTax() {
  return (
    <CaseStudyLayout
      hero={
        <>
          <CaseStudyHero
            src="/work/clinic-ai-assistant/EU.svg"
            srcMobile="/work/clinic-ai-assistant/EU.png"
            alt="Shopify Tax EU/UK — VAT settings surface."
            width={1102}
            height={883}
            centered
          />
          {/* Second hero. Desktop renders three rasters composed in a
              1000×743 reference canvas (mirrors CaseStudyHero's tile
              structure — same padding, colour, 5% bottom-bleed clip).
              Mobile renders a single flat PNG that bakes the same
              composition (sharper on iOS than the layered SVGs). */}
          <section className="-mt-[4px] md:-mt-[32px] w-full pt-[12px] md:pt-[48px] px-[12px] md:px-[16px] overflow-hidden">
            <div
              style={{ backgroundColor: "#464644", maxWidth: 1320 }}
              className="w-full mx-auto rounded-[6px] md:rounded-[8px] flex justify-center overflow-hidden"
            >
              {/* Mobile: single combined PNG. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/work/clinic-ai-assistant/Shopify%20tax%202.png"
                alt="Shopify Tax EU/UK — invoice doc, order timeline, and VAT card together."
                className="md:hidden block w-[calc(100%-48px)] h-auto"
                style={{
                  maxWidth: 1000,
                  marginTop: "clamp(24px, 5.33vw, 64px)",
                  marginBottom: "clamp(-37px, -3.72vw, 0px)",
                }}
              />
              {/* Desktop: composed 1000×743 canvas. */}
              <div
                className="hidden md:block relative w-[calc(100%-48px)]"
                style={{
                  maxWidth: 1000,
                  aspectRatio: "1000 / 743",
                  marginTop: "clamp(24px, 5.33vw, 64px)",
                  marginBottom: "clamp(-37px, -3.72vw, 0px)",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/work/clinic-ai-assistant/Amount%20off%20products.svg"
                  alt="Shopify Tax EU/UK — generated VAT invoice document."
                  loading="lazy"
                  decoding="async"
                  className="absolute right-0 top-0 h-auto"
                  style={{ width: "60.3%", imageRendering: "-webkit-optimize-contrast" }}
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/work/clinic-ai-assistant/Timeline.svg"
                  alt="Shopify Tax EU/UK — order timeline with VAT events."
                  loading="lazy"
                  decoding="async"
                  className="absolute h-auto"
                  style={{ left: "12%", top: "37%", width: "60.5%", imageRendering: "-webkit-optimize-contrast" }}
                />
                {/* Wrapper carries the backdrop-filter so anything behind the
                    card (timeline / tile) is blurred where the card sits. */}
                <div
                  className="absolute overflow-hidden"
                  style={{
                    left: 0,
                    top: "calc(85.5% - 24px)",
                    width: "30%",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    borderRadius: 8,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/work/clinic-ai-assistant/VAT%20Invoices.svg"
                    alt="Shopify Tax EU/UK — VAT invoice summary card."
                    loading="lazy"
                    decoding="async"
                    className="block h-auto w-full"
                    style={{ imageRendering: "-webkit-optimize-contrast" }}
                  />
                </div>
              </div>
            </div>
          </section>
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
