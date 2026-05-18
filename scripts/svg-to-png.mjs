import { chromium } from "playwright";
import { promises as fs } from "fs";
import path from "path";

const inputs = process.argv.slice(2);
if (inputs.length === 0) {
  console.error("Usage: node scripts/svg-to-png.mjs <svg-path> [<svg-path>...]");
  process.exit(1);
}

const browser = await chromium.launch();

for (const inputPath of inputs) {
  const svg = await fs.readFile(inputPath, "utf-8");
  // Extract intrinsic dimensions
  const wMatch = svg.match(/<svg[^>]*\swidth="([\d.]+)/);
  const hMatch = svg.match(/<svg[^>]*\sheight="([\d.]+)/);
  const vbMatch = svg.match(/<svg[^>]*viewBox="[\d.\-\s]+\s([\d.]+)\s([\d.]+)"/);
  const W = wMatch ? parseFloat(wMatch[1]) : (vbMatch ? parseFloat(vbMatch[1]) : 1200);
  const H = hMatch ? parseFloat(hMatch[1]) : (vbMatch ? parseFloat(vbMatch[2]) : 900);

  const SCALE = 3;
  const targetW = Math.round(W * SCALE);
  const targetH = Math.round(H * SCALE);

  const context = await browser.newContext({
    viewport: { width: targetW, height: targetH },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  // Use the actual SVG markup, scaled to fill the viewport. No CSS scaling —
  // the SVG element gets explicit pixel dimensions so its content rasterizes
  // at the target pixel grid.
  const dataUri = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
  await page.setContent(`
    <html><body style="margin:0;padding:0;background:transparent;">
      <img src="${dataUri}" style="display:block;width:${targetW}px;height:${targetH}px;">
    </body></html>
  `);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(200);

  const outPath = inputPath.replace(/\.svg$/i, "@3x.png");
  await page.screenshot({
    path: outPath,
    omitBackground: true,
    clip: { x: 0, y: 0, width: targetW, height: targetH },
  });
  await context.close();

  const stats = await fs.stat(outPath);
  console.log(`  ${path.basename(inputPath)} → ${path.basename(outPath)}  ${targetW}×${targetH}  ${(stats.size/1024).toFixed(0)}KB`);
}

await browser.close();
