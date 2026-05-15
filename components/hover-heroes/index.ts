import type { ComponentType } from "react";
import { ClinicAiAssistantHero } from "./ClinicAiAssistantHero";
import { AgentPlaygroundHero } from "./AgentPlaygroundHero";
import { VoiceAgentHero } from "./VoiceAgentHero";
import { PulseUiHero } from "./PulseUiHero";
import { OnboardingHero } from "./OnboardingHero";
import { ShopifyTaxHero } from "./ShopifyTaxHero";
import { AnalyticsHero } from "./AnalyticsHero";
import { OrchidHero } from "./OrchidHero";
import { JoyHero } from "./JoyHero";
import { TradingVaultHero } from "./TradingVaultHero";
import { SoutheastCommunityCenterHero } from "./SoutheastCommunityCenterHero";

export const hoverHeroes: Record<string, ComponentType<{ visible?: boolean }>> = {
  "clinic-ai-assistant": ClinicAiAssistantHero,
  "agent-playground": AgentPlaygroundHero,
  "voice-agent": VoiceAgentHero,
  "pulse-ui": PulseUiHero,
  onboarding: OnboardingHero,
  "shopify-tax": ShopifyTaxHero,
  analytics: AnalyticsHero,
  orchid: OrchidHero,
  joy: JoyHero,
  "trading-vault": TradingVaultHero,
  "southeast-community-center": SoutheastCommunityCenterHero,
};
