export type Role =
  | "Design"
  | "PM"
  | "Development"
  | "Eval"
  | "Prompt Engineering"
  | "Design System"
  | "Analytics"
  | "Branding"
  | "Typography"
  | "Architecture";

export interface Project {
  slug: string;
  title: string;
  roles: Role[];
  /** Optional shorter title used only on the mobile project index, where the
   *  title column is narrower. Falls back to `title` when absent. */
  mobileTitle?: string;
  /** When true, the row renders as plain text on the index (no link, no
   *  hover/dim affordance) and the /work/{slug} page is not generated. */
  inactive?: boolean;
}

export const projects: Project[] = [
  { slug: "clinic-ai-assistant",        title: "Clinic AI assistant",        roles: ["Eval", "Prompt Engineering"] },
  { slug: "agent-playground",           title: "Agent playground",           roles: ["PM", "Design"] },
  { slug: "voice-agent",                title: "Conversational agent",                roles: ["Eval", "Prompt Engineering"] },
  { slug: "pulse-ui",                   title: "Pulse UI",                   roles: ["Design System", "Development"] },
  { slug: "onboarding",                 title: "Onboarding",                 roles: ["Design"] },
  { slug: "shopify-tax",                title: "Shopify Tax",                roles: ["Design"] },
  { slug: "analytics",                  title: "DevRev Analytics",           roles: ["Analytics", "Design System"] },
  { slug: "orchid",                     title: "Orchid",                     roles: ["Branding"] },
  { slug: "joy",                        title: "Joy Typeface",               roles: ["Typography"] },
  { slug: "trading-vault",              title: "Trading vault",              roles: ["Design"] },
  { slug: "southeast-community-center", title: "Southeast Community Center", mobileTitle: "Community Center", roles: ["Architecture"] },
  /* Listed below SCC, no case-study page, no hover affordance. */
  { slug: "patient-verification",       title: "Patient verification",       roles: ["PM", "Eval"], inactive: true },
  { slug: "note-memory",                title: "Note memory",                roles: ["Design"], inactive: true },
];
