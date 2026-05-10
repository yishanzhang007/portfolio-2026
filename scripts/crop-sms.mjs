import { chromium } from "playwright";

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 1024 },
  deviceScaleFactor: 2,
});
const page = await ctx.newPage();
await page.goto("http://localhost:3001/work/clinic-ai-assistant", { waitUntil: "networkidle" });
await page.waitForTimeout(500);

// Scroll to the SMS section's CaseStudyImage
const handle = await page.locator('[aria-label="Send"], img').first();
// Find the SMS section by looking for the "Remove PHI" text
const smsBox = await page.locator('p:has-text("Remove PHI to enable SMS")').first().boundingBox();
if (!smsBox) {
  console.error("not found");
  process.exit(1);
}
// The section's gray-tile container is the parent .CaseStudyImage. Use a selector that looks for the wrapper.
// Just clip to the SMS demo's bg-sms-bg layer.
const wrapper = page.locator('.bg-sms-bg').first();
await wrapper.scrollIntoViewIfNeeded();
await page.waitForTimeout(200);
const wbox = await wrapper.boundingBox();
if (!wbox) {
  console.error("wrapper not found");
  process.exit(1);
}
await page.screenshot({
  path: "/tmp/sms-static-crop.png",
  clip: { x: wbox.x, y: wbox.y, width: wbox.width, height: wbox.height },
});
await browser.close();
console.log(`shot ${wbox.width}x${wbox.height} -> /tmp/sms-static-crop.png`);
