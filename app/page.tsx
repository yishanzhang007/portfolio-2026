import Link from "next/link";
import { FooterNav } from "@/components/FooterNav";
import { PageLoad } from "@/components/PageLoad";
import { ProjectIndex } from "@/components/ProjectIndex";

export default function Home() {
  return (
    <PageLoad>
    <main className="text-body">
      {/* Mobile layout (default, < 900px). 12px gutter on all sides at the
          narrowest viewports; bumps to 16px from the sm: breakpoint up so
          everything ≥ mobile keeps a 16px minimum gutter. Everything is
          left-aligned. */}
      <div className="landing-mobile md:hidden bg-cream min-h-screen w-full p-[12px] sm:p-[16px] flex flex-col">
        <div className="flex flex-col">
          <p className="text-header text-ink font-medium">Yishan Zhang</p>
          <p className="text-ink opacity-90">Product designer</p>
          <Link
            href="/about"
            className="text-ink opacity-90 hover:underline hover:[text-decoration-color:var(--color-underline)] hover:[text-decoration-thickness:10%] hover:[text-underline-offset:0.2em]"
          >
            About
          </Link>
        </div>

        <div className="flex-1 flex items-center">
          <ProjectIndex variant="mobile" />
        </div>

        <FooterNav />
      </div>

      {/* Desktop layout (≥ 900px) — content centered horizontally in a
          fixed-width grid. Outer 16px gutter guarantees a 16px minimum on
          either side; the inner shrinks below 960px when the viewport is
          tight (888–991px) so content never reaches the edge. */}
      <div className="hidden md:block bg-cream w-full min-h-screen px-[16px]">
        <div className="relative mx-auto h-screen w-full max-w-[960px] transition-layout">
          <p className="absolute left-0 top-[40px] text-header text-ink font-medium transition-layout">
            Yishan Zhang
          </p>
          <p className="absolute left-[320px] top-[40px] text-ink opacity-90 transition-layout">
            Product designer
          </p>
          <Link
            href="/about"
            className="absolute left-[640px] top-[40px] text-ink opacity-90 transition-layout hover:underline hover:[text-decoration-color:var(--color-underline)] hover:[text-decoration-thickness:10%] hover:[text-underline-offset:0.2em]"
          >
            About
          </Link>

          <div className="absolute left-0 top-1/2 -translate-y-1/2">
            <ProjectIndex variant="desktop" />
          </div>

          <div className="absolute left-0 bottom-[40px] transition-layout">
            <FooterNav />
          </div>
        </div>
      </div>
    </main>
    </PageLoad>
  );
}
