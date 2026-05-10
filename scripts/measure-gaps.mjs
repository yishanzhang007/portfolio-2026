import { chromium } from "playwright";
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1024 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
await page.goto("http://localhost:3001/work/clinic-ai-assistant", { waitUntil: "networkidle" });
await page.waitForTimeout(500);

const gaps = await page.evaluate(() => {
  const out = [];
  const findP = (text) => Array.from(document.querySelectorAll("p")).find(p => p.textContent.trim().startsWith(text));

  const insights = findP("Insights");
  if (insights) {
    const greyBox = insights.nextElementSibling;
    out.push({
      pair: "Insights → grey box",
      headerBottom: insights.getBoundingClientRect().bottom,
      contentTop: greyBox.getBoundingClientRect().top,
      gap: greyBox.getBoundingClientRect().top - insights.getBoundingClientRect().bottom,
      headerMarginBottom: getComputedStyle(insights).marginBottom,
      contentMarginTop: getComputedStyle(greyBox).marginTop,
    });
  }
  const promptChange = findP("Prompt change");
  if (promptChange) {
    const next = promptChange.nextElementSibling;
    out.push({
      pair: "Prompt change → image",
      gap: next.getBoundingClientRect().top - promptChange.getBoundingClientRect().bottom,
      headerMarginBottom: getComputedStyle(promptChange).marginBottom,
      contentMarginTop: getComputedStyle(next).marginTop,
    });
  }
  const call = findP("Call abandoned");
  if (call) {
    const next = call.nextElementSibling;
    out.push({
      pair: "Call abandoned → chart",
      gap: next.getBoundingClientRect().top - call.getBoundingClientRect().bottom,
      headerMarginBottom: getComputedStyle(call).marginBottom,
      contentMarginTop: getComputedStyle(next).marginTop,
    });
  }
  return out;
});

console.log(JSON.stringify(gaps, null, 2));
await browser.close();
