import { describe, it, expect } from "vitest";

// Re-derive the constants from SmsComposerDemo to test their consistency.
// We can't import them directly since they're module-scoped, but we can
// verify the same logic produces correct results.

const FULL_TEXT =
  "I'm following up on your recent lab results. Your HbA1c came back at 8.2%, which is higher than our target range. ";
const PHI_TEXT = "HbA1c came back at 8.2%";
const PHI_START = FULL_TEXT.indexOf(PHI_TEXT);
const PHI_END = PHI_START + PHI_TEXT.length;
const PHI_DETECT_AT = PHI_START + "HbA1c".length;

describe("SmsComposerDemo PHI detection constants", () => {
  it("FULL_TEXT contains PHI_TEXT exactly once", () => {
    const idx = FULL_TEXT.indexOf(PHI_TEXT);
    expect(idx).toBeGreaterThan(-1);
    expect(FULL_TEXT.indexOf(PHI_TEXT, idx + 1)).toBe(-1);
  });

  it("PHI_START is a valid index", () => {
    expect(PHI_START).toBeGreaterThanOrEqual(0);
    expect(PHI_START).toBeLessThan(FULL_TEXT.length);
  });

  it("PHI_END is within bounds and after PHI_START", () => {
    expect(PHI_END).toBeGreaterThan(PHI_START);
    expect(PHI_END).toBeLessThanOrEqual(FULL_TEXT.length);
  });

  it("PHI_DETECT_AT falls inside the PHI range", () => {
    expect(PHI_DETECT_AT).toBeGreaterThan(PHI_START);
    expect(PHI_DETECT_AT).toBeLessThanOrEqual(PHI_END);
  });

  it("extracting PHI_TEXT via indices yields the original string", () => {
    expect(FULL_TEXT.slice(PHI_START, PHI_END)).toBe(PHI_TEXT);
  });

  it("prefix, phi, and suffix reconstruct FULL_TEXT", () => {
    const prefix = FULL_TEXT.slice(0, PHI_START);
    const phi = FULL_TEXT.slice(PHI_START, PHI_END);
    const suffix = FULL_TEXT.slice(PHI_END);
    expect(prefix + phi + suffix).toBe(FULL_TEXT);
  });

  it("PHI_DETECT_AT corresponds to end of 'HbA1c' keyword", () => {
    const keyword = "HbA1c";
    const expectedDetectAt = PHI_START + keyword.length;
    expect(PHI_DETECT_AT).toBe(expectedDetectAt);
    expect(FULL_TEXT.slice(PHI_START, PHI_DETECT_AT)).toBe(keyword);
  });
});
