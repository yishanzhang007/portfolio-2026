import fs from 'fs';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const [, , aPath, bPath, outPath] = process.argv;
if (!aPath || !bPath || !outPath) {
  console.error('Usage: node scripts/diff.mjs <a.png> <b.png> <diff.png>');
  process.exit(1);
}

const a = PNG.sync.read(fs.readFileSync(aPath));
const b = PNG.sync.read(fs.readFileSync(bPath));

if (a.width !== b.width || a.height !== b.height) {
  console.error(`Size mismatch: ${aPath} ${a.width}x${a.height} vs ${bPath} ${b.width}x${b.height}`);
  process.exit(2);
}

const { width, height } = a;
const diff = new PNG({ width, height });
const mismatched = pixelmatch(a.data, b.data, diff.data, width, height, {
  threshold: 0.1,
  alpha: 0.3,
  diffColor: [255, 0, 0],
  aaColor: [255, 255, 0],
});
fs.writeFileSync(outPath, PNG.sync.write(diff));
const total = width * height;
const pct = ((mismatched / total) * 100).toFixed(3);
console.log(`size:       ${width}x${height}`);
console.log(`mismatched: ${mismatched.toLocaleString()} / ${total.toLocaleString()} (${pct}%)`);
console.log(`diff out:   ${outPath}`);
