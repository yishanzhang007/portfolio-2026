import { chromium } from "playwright";
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1024 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
await page.goto("http://localhost:3001/work/clinic-ai-assistant", { waitUntil: "networkidle" });
await page.waitForTimeout(500);
await page.screenshot({ path: "/tmp/cs-1440-full.png", fullPage: true });
await browser.close();
console.log("done");
