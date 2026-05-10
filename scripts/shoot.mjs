import { chromium } from "playwright";

const [, , url, outPath, w, h, hoverArg] = process.argv;
if (!url || !outPath || !w || !h) {
  console.error("Usage: node scripts/shoot.mjs <url> <out.png> <w> <h> [hoverSelector|x,y]");
  process.exit(1);
}

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: Number(w), height: Number(h) },
  deviceScaleFactor: 1,
});
const page = await ctx.newPage();
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(300);

if (hoverArg) {
  // Coordinates "x,y" or a selector
  const m = hoverArg.match(/^(\d+),(\d+)$/);
  if (m) {
    await page.mouse.move(Number(m[1]), Number(m[2]));
  } else {
    await page.locator(hoverArg).first().hover();
  }
  await page.waitForTimeout(200);
}

await page.screenshot({ path: outPath, omitBackground: false });
await browser.close();
console.log(`shot ${w}x${h} -> ${outPath}`);
