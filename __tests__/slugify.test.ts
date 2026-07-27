import { describe, it, expect } from "vitest";
import { slugify } from "@/components/CaseStudySection";

describe("slugify", () => {
  it("converts a simple string to lowercase kebab-case", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("handles multiple spaces and special characters", () => {
    expect(slugify("Design & Development")).toBe("design-development");
  });

  it("strips leading and trailing hyphens", () => {
    expect(slugify("  --Hello--  ")).toBe("hello");
  });

  it("returns undefined for non-string input", () => {
    expect(slugify(42 as unknown as string)).toBeUndefined();
    expect(slugify(null as unknown as string)).toBeUndefined();
    expect(slugify(undefined as unknown as string)).toBeUndefined();
  });

  it("returns undefined for an empty string", () => {
    expect(slugify("")).toBeUndefined();
  });

  it("returns undefined for whitespace-only string", () => {
    expect(slugify("   ")).toBeUndefined();
  });

  it("handles real case study section labels", () => {
    expect(slugify("DevRev Analytics")).toBe("devrev-analytics");
    expect(slugify("Clinic AI assistant")).toBe("clinic-ai-assistant");
    expect(slugify("Joy Typeface")).toBe("joy-typeface");
  });

  it("collapses consecutive non-alphanumeric chars into a single hyphen", () => {
    expect(slugify("foo---bar")).toBe("foo-bar");
    expect(slugify("a  &  b")).toBe("a-b");
  });
});
