import { notFound } from "next/navigation";
import { AgentPlayground } from "@/lib/case-studies/agent-playground";
import { Analytics } from "@/lib/case-studies/analytics";
import { ClinicAIAssistant } from "@/lib/case-studies/clinic-ai-assistant";
import { Joy } from "@/lib/case-studies/joy";
import { Onboarding } from "@/lib/case-studies/onboarding";
import { Orchid } from "@/lib/case-studies/orchid";
import { CaseStudyPlaceholder } from "@/lib/case-studies/placeholder";
import { PulseUI } from "@/lib/case-studies/pulse-ui";
import { ShopifyTax } from "@/lib/case-studies/shopify-tax";
import { SoutheastCommunityCenter } from "@/lib/case-studies/southeast-community-center";
import { TradingVault } from "@/lib/case-studies/trading-vault";
import { VoiceAgent } from "@/lib/case-studies/voice-agent";
import { projects } from "@/lib/projects";

export function generateStaticParams() {
  return projects.filter((p) => !p.inactive).map((p) => ({ slug: p.slug }));
}

function renderCaseStudy(slug: string, project: ReturnType<typeof projects.find>) {
  if (slug === "clinic-ai-assistant") return <ClinicAIAssistant />;
  if (slug === "pulse-ui") return <PulseUI />;
  if (slug === "agent-playground") return <AgentPlayground />;
  if (slug === "voice-agent") return <VoiceAgent />;
  if (slug === "shopify-tax") return <ShopifyTax />;
  if (slug === "joy") return <Joy />;
  if (slug === "orchid") return <Orchid />;
  if (slug === "onboarding") return <Onboarding />;
  if (slug === "analytics") return <Analytics />;
  if (slug === "southeast-community-center") return <SoutheastCommunityCenter />;
  if (slug === "trading-vault") return <TradingVault />;
  return project ? <CaseStudyPlaceholder project={project} /> : null;
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <div className="case-study-shrunk">{renderCaseStudy(slug, project)}</div>
  );
}
