import { describe, it, expect } from "vitest";
import { projects } from "@/lib/projects";

// Mirror the logic from app/work/[slug]/page.tsx
function generateStaticParams() {
  return projects.filter((p) => !p.inactive).map((p) => ({ slug: p.slug }));
}

describe("generateStaticParams", () => {
  it("returns an array of slug objects", () => {
    const params = generateStaticParams();
    expect(Array.isArray(params)).toBe(true);
    expect(params.length).toBeGreaterThan(0);
    for (const p of params) {
      expect(p).toHaveProperty("slug");
      expect(typeof p.slug).toBe("string");
    }
  });

  it("excludes inactive projects", () => {
    const params = generateStaticParams();
    const slugs = params.map((p) => p.slug);
    const inactiveSlugs = projects
      .filter((p) => p.inactive)
      .map((p) => p.slug);
    for (const slug of inactiveSlugs) {
      expect(slugs).not.toContain(slug);
    }
  });

  it("includes all active projects", () => {
    const params = generateStaticParams();
    const slugs = params.map((p) => p.slug);
    const activeSlugs = projects
      .filter((p) => !p.inactive)
      .map((p) => p.slug);
    for (const slug of activeSlugs) {
      expect(slugs).toContain(slug);
    }
  });

  it("count matches active projects count", () => {
    const params = generateStaticParams();
    const activeCount = projects.filter((p) => !p.inactive).length;
    expect(params.length).toBe(activeCount);
  });
});

describe("slug → project lookup", () => {
  it("every active slug resolves to a project", () => {
    const params = generateStaticParams();
    for (const { slug } of params) {
      const found = projects.find((p) => p.slug === slug);
      expect(found).toBeDefined();
      expect(found!.inactive).toBeFalsy();
    }
  });

  it("non-existent slug returns undefined", () => {
    const found = projects.find((p) => p.slug === "nonexistent-slug");
    expect(found).toBeUndefined();
  });
});
