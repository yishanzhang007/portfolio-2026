import Link from "next/link";
import { FooterNav } from "@/components/FooterNav";
import { PageLoad } from "@/components/PageLoad";

function ArrowLeft() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className="shrink-0"
    >
      <path
        d="M9 14L4 9L9 4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 20v-7a4 4 0 0 0-4-4H4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IntroParagraphs() {
  return (
    <div className="flex flex-col gap-[24px] text-ink">
      <p>
        Hi, I&apos;m Yishan. I used to be an architect, and I still judge things the same way I judged buildings: does it stand up, does it make sense to be in, does it work for real people?
      </p>
      <p>
        That&apos;s probably why I can&apos;t pick one role — research, design, code, leading teams. A great product is beyond design, and I care deeply about every aspect of it.
      </p>
      <p>
        Right now I&apos;m spending a lot of time with AI tools. Not in a &ldquo;future of work&rdquo; way — more: how to move faster, try weirder ideas, and maybe finally take a crack at problems I&apos;d always shelved as too hard.
      </p>
    </div>
  );
}

function RecentWorkList() {
  return (
    <div className="flex flex-col text-ink">
      <p>Clinic AI assistant at Freed.ai;</p>
      <p>Automatic tax filing at Shopify;</p>
      <p>Analytics platform at DevRev.</p>
    </div>
  );
}

export default function AboutPage() {
  return (
    <PageLoad>
      <main className="text-body md:text-[14px]">
        {/* Mobile (< md) */}
        <div className="landing-mobile md:hidden bg-cream min-h-dvh w-full p-[12px] sm:p-[16px] flex flex-col">
          <Link
            href="/"
            className="flex items-center gap-[9px] text-muted hover:underline hover:[text-decoration-color:var(--color-underline)] hover:[text-decoration-thickness:10%] hover:[text-underline-offset:0.2em]"
          >
            <span><ArrowLeft /></span>
            <span>Index</span>
          </Link>

          <div className="flex-1 flex items-center">
            <div className="flex flex-col w-full">
              <p className="text-header font-medium mb-[24px]">About</p>
              <div className="flex flex-col gap-[40px] w-full">
                <IntroParagraphs />
                <div className="flex flex-col gap-[8px]">
                  <p className="text-muted">Recent work</p>
                  <RecentWorkList />
                </div>
              </div>
            </div>
          </div>

          <FooterNav />
        </div>

        {/* Desktop (≥ md) */}
        <div className="hidden md:block bg-cream w-full min-h-screen px-[16px]">
          <div className="relative mx-auto h-screen w-full max-w-[960px] transition-layout">
            <Link
              href="/"
              className="absolute -left-[31px] top-[40px] flex items-center gap-[9px] text-muted transition-layout hover:underline hover:[text-decoration-color:var(--color-underline)] hover:[text-decoration-thickness:10%] hover:[text-underline-offset:0.2em]"
            >
              <span><ArrowLeft /></span>
              <span>Index</span>
            </Link>

            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[560px] flex flex-col transition-layout">
              <p className="text-header font-medium mb-[24px]">About</p>
              <div className="flex flex-col gap-[40px]">
                <IntroParagraphs />
                <div className="flex flex-col gap-[8px]">
                  <p className="text-muted">Recent work</p>
                  <RecentWorkList />
                </div>
              </div>
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
