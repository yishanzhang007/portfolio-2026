import type { Metadata } from "next";
import { AgentPlaygroundFinalUi } from "@/components/AgentPlaygroundFinalUi";

export const metadata: Metadata = {
  title: "Agent Customization Hero",
};

export default function AgentCustomizationHeroPage() {
  return (
    <div className="case-study-shrunk">
      <main className="min-h-screen overflow-x-clip bg-cream text-body text-ink">
        <AgentPlaygroundFinalUi autoplay={false} frame="none" />
      </main>
    </div>
  );
}
