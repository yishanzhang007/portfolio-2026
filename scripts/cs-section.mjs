import { chromium } from "playwright";
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1200 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
await page.goto("http://localhost:3001/work/clinic-ai-assistant", { waitUntil: "networkidle" });
await page.waitForTimeout(500);
// Scroll to body sections
await page.evaluate(() => window.scrollTo(0, 700));
await page.waitForTimeout(200);
await page.screenshot({ path: "/tmp/cs-body.png", fullPage: false });
await browser.close();
console.log("done");
