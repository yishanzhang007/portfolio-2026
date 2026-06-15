import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import {
  pad,
  renderValue,
  renderObject,
  renderArray,
} from "@/components/TerminalCard";

function html(node: React.ReactNode): string {
  return renderToStaticMarkup(<>{node}</>);
}

describe("pad", () => {
  it("returns empty string for 0", () => {
    expect(pad(0)).toBe("");
  });

  it("returns correct indentation", () => {
    expect(pad(1)).toBe("  ");
    expect(pad(3)).toBe("      ");
  });
});

describe("renderValue", () => {
  it("renders null", () => {
    const out = html(renderValue(null, 0));
    expect(out).toContain("null");
  });

  it("renders boolean true", () => {
    const out = html(renderValue(true, 0));
    expect(out).toContain("true");
  });

  it("renders boolean false", () => {
    const out = html(renderValue(false, 0));
    expect(out).toContain("false");
  });

  it("renders a number with the number color class", () => {
    const out = html(renderValue(42, 0));
    expect(out).toContain("42");
    expect(out).toContain("text-[#098658]");
  });

  it("renders a string with quotes and string color class", () => {
    const out = html(renderValue("hello", 0));
    expect(out).toContain("&quot;hello&quot;");
    expect(out).toContain("text-[#a31515]");
  });
});

describe("renderObject", () => {
  it("renders empty object", () => {
    const out = html(renderObject({}, 0));
    expect(out).toBe("{}");
  });

  it("renders a flat object with keys and values", () => {
    const out = html(renderObject({ name: "test", count: 5 }, 0));
    expect(out).toContain("&quot;name&quot;");
    expect(out).toContain("&quot;test&quot;");
    expect(out).toContain("&quot;count&quot;");
    expect(out).toContain("5");
  });

  it("renders keys with the key color class", () => {
    const out = html(renderObject({ foo: "bar" }, 0));
    expect(out).toContain("text-[#0451a5]");
  });
});

describe("renderArray", () => {
  it("renders empty array", () => {
    const out = html(renderArray([], 0));
    expect(out).toBe("[]");
  });

  it("renders primitive array inline", () => {
    const out = html(renderArray(["a", "b", "c"], 0));
    expect(out).toContain("&quot;a&quot;");
    expect(out).toContain("&quot;b&quot;");
    expect(out).toContain("&quot;c&quot;");
    expect(out).toMatch(/^\[/);
  });

  it("renders mixed-type primitive array inline", () => {
    const out = html(renderArray([1, true, null, "x"], 0));
    expect(out).toContain("1");
    expect(out).toContain("true");
    expect(out).toContain("null");
    expect(out).toContain("&quot;x&quot;");
  });

  it("renders array of objects in block form", () => {
    const out = html(renderArray([{ key: "val" }], 0));
    expect(out).toContain("&quot;key&quot;");
    expect(out).toContain("&quot;val&quot;");
  });
});
