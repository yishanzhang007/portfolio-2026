import { chromium } from "playwright";

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 1024 },
  deviceScaleFactor: 2,
});
const page = await ctx.newPage();
await page.goto("http://localhost:3001/work/clinic-ai-assistant", { waitUntil: "networkidle" });

const wrapper = page.locator(".font-sms").first().locator("..");
await wrapper.scrollIntoViewIfNeeded();
await page.waitForTimeout(100);

const t0 = Date.now();
// Detection fires ~T=5275ms. Banner slide is now 500ms transform + 350ms opacity (with 100ms delay).
const captures = [
  { delay: 5300, label: "slide-frame1-low-faded" },
  { delay: 5400, label: "slide-frame2-rising-fading-in" },
  { delay: 5500, label: "slide-frame3-near-final" },
  { delay: 5650, label: "slide-frame4-almost-done" },
  { delay: 5850, label: "slide-frame5-done" },
];

for (const { delay, label } of captures) {
  const wait = delay - (Date.now() - t0);
  if (wait > 0) await page.waitForTimeout(wait);

  const wbox = await wrapper.boundingBox();
  if (!wbox) continue;
  const path = `/tmp/sms-state-${label}.png`;
  await page.screenshot({
    path,
    clip: { x: wbox.x, y: wbox.y, width: wbox.width, height: wbox.height },
  });
  console.log(`${label} @ ${Date.now() - t0}ms -> ${path}`);
}

await browser.close();
