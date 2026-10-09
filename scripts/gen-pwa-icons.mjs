// Generates LegendRise PWA icons as real PNGs (no dependencies).
// Usage: node scripts/gen-pwa-icons.mjs  (writes static/icons/*)
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { deflateSync } from "node:zlib";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "static", "icons");
mkdirSync(outDir, { recursive: true });

// Brand palette (matches app.css violet+gold identity).
const VIOLET = [109, 40, 217, 255];
const VIOLET_DARK = [91, 33, 182, 255];
const GOLD = [245, 158, 11, 255];
const WHITE = [255, 255, 255, 255];

// --- Minimal PNG encoder (RGBA8) -------------------------------------------
const CRC_TABLE = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();
function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}
function encodePng(w, h, rgba) {
  const raw = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) {
    raw[y * (w * 4 + 1)] = 0; // filter byte: None
    Buffer.from(rgba.buffer, rgba.byteOffset + y * w * 4, w * 4).copy(raw, y * (w * 4 + 1) + 1);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type: RGBA
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([sig, chunk("IHDR", ihdr), chunk("IDAT", deflateSync(raw)), chunk("IEND", Buffer.alloc(0))]);
}

// --- Pixel canvas ------------------------------------------------------------
function canvas(s) {
  return { s, px: new Uint8ClampedArray(s * s * 4) };
}
function setPx(c, x, y, col) {
  if (x < 0 || y < 0 || x >= c.s || y >= c.s) return;
  const i = (y * c.s + x) * 4;
  c.px[i] = col[0]; c.px[i + 1] = col[1]; c.px[i + 2] = col[2]; c.px[i + 3] = col[3];
}
function fillCircle(c, cx, cy, r, col) {
  for (let y = Math.floor(cy - r); y <= Math.ceil(cy + r); y++)
    for (let x = Math.floor(cx - r); x <= Math.ceil(cx + r); x++) {
      const dx = x - cx, dy = y - cy;
      if (dx * dx + dy * dy <= r * r) setPx(c, x, y, col);
    }
}
function inRoundedRect(x, y, s, r) {
  const q = (cx, cy) => (x - cx) ** 2 + (y - cy) ** 2 <= r * r;
  if (x >= r && x < s - r) return true;
  if (y >= r && y < s - r) return true;
  if (x < r && y < r) return q(r, r);
  if (x >= s - r && y < r) return q(s - r - 1, r);
  if (x < r && y >= s - r) return q(r, s - r - 1);
  if (x >= s - r && y >= s - r) return q(s - r - 1, s - r - 1);
  return false;
}
// Rising-sun-over-peaks mark: violet tile, gold sun, white twin peaks.
function drawMark(c, scale = 1, dx = 0, dy = 0) {
  const s = c.s, u = s / 512; // unit relative to 512 grid
  const cx = s / 2 + dx, base = s * 0.66 + dy;
  // Sun (gold disc).
  fillCircle(c, cx + 118 * u * scale, base - 150 * u * scale, 62 * u * scale, GOLD);
  // Peaks (white triangles): back peak + front peak.
  const tri = (x0, y0, x1, apexY) => {
    for (let y = Math.ceil(apexY); y <= Math.floor(y0); y++) {
      const t = (y0 - y) / (y0 - apexY);
      const hw = ((x1 - x0) / 2) * (1 - t);
      const mid = (x0 + x1) / 2;
      for (let x = Math.ceil(mid - hw); x <= Math.floor(mid + hw); x++) setPx(c, x, y, WHITE);
    }
  };
  tri(cx - 190 * u * scale + dx * 0, base, cx + 10 * u * scale, base - 150 * u * scale);
  tri(cx - 60 * u * scale, base + 10 * u * scale, cx + 200 * u * scale, base - 190 * u * scale);
  // Gold snowcap accent on front peak.
  const capY = base - 190 * u * scale;
  for (let y = Math.ceil(capY); y <= Math.floor(capY + 34 * u * scale); y++) {
    const t = (y - capY) / (34 * u * scale);
    const hw = 14 * u * scale + t * 44 * u * scale;
    const mid = cx + 70 * u * scale;
    for (let x = Math.ceil(mid - hw); x <= Math.floor(mid + hw); x++) setPx(c, x, y, GOLD);
  }
}
function render(size, { maskable = false } = {}) {
  const c = canvas(size);
  const u = size / 512;
  // Background: full-bleed violet (maskable-safe), rounded tile otherwise.
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++) {
      const bg = maskable ? VIOLET : VIOLET_DARK;
      if (maskable || inRoundedRect(x, y, size, size * 0.225)) setPx(c, x, y, bg);
    }
  if (!maskable) {
    // Subtle inner tile edge.
    for (let y = 0; y < size; y++)
      for (let x = 0; x < size; x++)
        if (inRoundedRect(x, y, size, size * 0.225) && !inRoundedRect(x - 6 * u, y - 6 * u, size, size * 0.225)) {
          // keep edge clean (no-op guard for crisp corners)
        }
    drawMark(c, 0.86, 0, -8 * u);
    // Gold base bar.
    for (let y = Math.floor(size * 0.82); y < Math.floor(size * 0.865); y++)
      for (let x = Math.floor(size * 0.2); x < Math.floor(size * 0.8); x++)
        if (inRoundedRect(x, y, size, size * 0.225)) setPx(c, x, y, GOLD);
  } else {
    drawMark(c, 0.62, 0, 0); // centred in safe zone
  }
  return encodePng(size, size, c.px);
}

const jobs = [
  ["icon-192.png", 192, {}],
  ["icon-512.png", 512, {}],
  ["maskable-512.png", 512, { maskable: true }],
  ["apple-touch-icon.png", 180, {}],
  ["favicon-32x32.png", 32, {}],
  ["favicon-16x16.png", 16, {}],
];
for (const [name, size, opts] of jobs) {
  writeFileSync(join(outDir, name), render(size, opts));
  console.log(`wrote static/icons/${name} (${size}x${size})`);
}
