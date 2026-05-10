import fs from 'fs';
import { PNG } from 'pngjs';

const png = PNG.sync.read(fs.readFileSync(process.argv[2]));
const { width, height, data } = png;

// Detect "white" rows (where the canvas is) vs "cream" rows (body bg behind)
function isMostlyWhite(y) {
  let whiteCount = 0;
  for (let x = 0; x < width; x++) {
    const idx = (y * width + x) * 4;
    if (data[idx] === 255 && data[idx+1] === 255 && data[idx+2] === 255) whiteCount++;
  }
  return whiteCount / width;
}

console.log(`size: ${width}x${height}`);
console.log("white-ratio per row (sample every 20):");
for (let y = 0; y < height; y += 20) {
  const r = isMostlyWhite(y);
  const bar = "█".repeat(Math.floor(r * 40));
  console.log(`y=${String(y).padStart(3)}: ${r.toFixed(2)} ${bar}`);
}
