import { chromium } from "playwright";
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1024 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
await page.goto("http://localhost:3001/work/clinic-ai-assistant", { waitUntil: "networkidle" });
await page.waitForTimeout(500);
await page.evaluate(() => {
  const headers = Array.from(document.querySelectorAll("p"));
  const insights = headers.find(p => p.textContent === "Insights");
  if (insights) insights.scrollIntoView({ block: "start" });
});
await page.waitForTimeout(200);
await page.screenshot({ path: "/tmp/cs-design.png", fullPage: false });
await browser.close();
