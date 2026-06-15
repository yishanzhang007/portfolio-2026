import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { renderInline } from "@/components/PromptCard";

function html(input: string): string {
  return renderToStaticMarkup(<>{renderInline(input)}</>);
}

describe("renderInline", () => {
  it("renders plain text without markers as-is", () => {
    const out = html("Hello world");
    expect(out).toBe("Hello world");
  });

  it("renders **bold** spans with the bold class", () => {
    const out = html("Say **hello** now");
    expect(out).toContain("font-semibold");
    expect(out).toContain("hello");
    expect(out).not.toContain("**");
  });

  it('renders "quoted" spans with the string class', () => {
    const out = html('Try "this approach" today');
    expect(out).toContain("text-[#a31515]");
    expect(out).toContain("&quot;this approach&quot;");
  });

  it("handles bold and quoted text in the same line", () => {
    const out = html('**Bold** and "quoted" text');
    expect(out).toContain("font-semibold");
    expect(out).toContain("text-[#a31515]");
    expect(out).toContain("Bold");
    // Two <span> elements
    const spans = out.match(/<span/g);
    expect(spans?.length).toBe(2);
  });

  it("treats unmatched ** as plain text", () => {
    const out = html("a ** b");
    expect(out).toBe("a ** b");
  });

  it("handles empty string", () => {
    const out = html("");
    expect(out).toBe("");
  });

  it("handles multiple bold segments", () => {
    const out = html("**a** and **b**");
    const boldMatches = out.match(/font-semibold/g);
    expect(boldMatches?.length).toBe(2);
    expect(out).toContain(">a<");
    expect(out).toContain(">b<");
  });
});
