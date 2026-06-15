import { describe, it, expect } from "vitest";
import { projects } from "@/lib/projects";
import type { Role } from "@/lib/projects";

const VALID_ROLES: Role[] = [
  "Design",
  "PM",
  "Development",
  "Eval",
  "Prompt Engineering",
  "Design System",
  "Analytics",
  "Branding",
  "Typography",
  "Architecture",
];

describe("projects data integrity", () => {
  it("exports a non-empty array", () => {
    expect(Array.isArray(projects)).toBe(true);
    expect(projects.length).toBeGreaterThan(0);
  });

  it("every project has a non-empty slug", () => {
    for (const p of projects) {
      expect(p.slug).toBeTruthy();
      expect(typeof p.slug).toBe("string");
      expect(p.slug.trim().length).toBeGreaterThan(0);
    }
  });

  it("every project has a non-empty title", () => {
    for (const p of projects) {
      expect(p.title).toBeTruthy();
      expect(typeof p.title).toBe("string");
    }
  });

  it("slugs are unique", () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("every project has at least one role", () => {
    for (const p of projects) {
      expect(p.roles.length).toBeGreaterThan(0);
    }
  });

  it("every role is a valid Role type", () => {
    for (const p of projects) {
      for (const role of p.roles) {
        expect(VALID_ROLES).toContain(role);
      }
    }
  });

  it("slugs use lowercase kebab-case only", () => {
    for (const p of projects) {
      expect(p.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });

  it("inactive projects are a subset of all projects", () => {
    const inactive = projects.filter((p) => p.inactive);
    const active = projects.filter((p) => !p.inactive);
    expect(active.length).toBeGreaterThan(0);
    expect(inactive.length).toBeGreaterThan(0);
    expect(active.length + inactive.length).toBe(projects.length);
  });

  it("mobileTitle is only set on projects that need it", () => {
    const withMobile = projects.filter((p) => p.mobileTitle);
    for (const p of withMobile) {
      expect(typeof p.mobileTitle).toBe("string");
      expect(p.mobileTitle!.length).toBeGreaterThan(0);
      expect(p.mobileTitle!.length).toBeLessThan(p.title.length);
    }
  });
});

describe("projects known entries", () => {
  it("contains the expected active projects", () => {
    const activeSlugs = projects
      .filter((p) => !p.inactive)
      .map((p) => p.slug);
    expect(activeSlugs).toContain("clinic-ai-assistant");
    expect(activeSlugs).toContain("agent-playground");
    expect(activeSlugs).toContain("pulse-ui");
    expect(activeSlugs).toContain("joy");
  });

  it("contains the expected inactive projects", () => {
    const inactiveSlugs = projects
      .filter((p) => p.inactive)
      .map((p) => p.slug);
    expect(inactiveSlugs).toContain("patient-verification");
    expect(inactiveSlugs).toContain("note-memory");
  });
});
