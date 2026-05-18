import { chromium } from "playwright";
const [, , url, mobilePath, desktopPath] = process.argv;
const browser = await chromium.launch();
// Mobile (iPhone 14 — 390×844, DPR 2)
{
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
  });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  await page.screenshot({ path: mobilePath, fullPage: false });
  await ctx.close();
}
// Desktop (1440×900)
{
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  await page.screenshot({ path: desktopPath, fullPage: false });
  await ctx.close();
}
await browser.close();
console.log(`mobile: ${mobilePath}`);
console.log(`desktop: ${desktopPath}`);
