import fs from 'fs';
import { PNG } from 'pngjs';

const png = PNG.sync.read(fs.readFileSync(process.argv[2]));
const { width, height, data } = png;
console.log(`size: ${width}x${height}`);

const samples = [
  [10, 870, "near-footer-About-x"],
  [50, 870, "above-footer-About"],
  [200, 880, "middle-bottom"],
  [10, 900, "near-bottom-edge"],
  [10, 800, "still-content-area"],
  [50, 50, "header-area"],
  [50, 300, "body-area"],
];

for (const [x, y, label] of samples) {
  const idx = (y * width + x) * 4;
  const r = data[idx], g = data[idx+1], b = data[idx+2], a = data[idx+3];
  console.log(`(${x},${y}) ${label}: rgba(${r},${g},${b},${a})`);
}
