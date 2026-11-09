// Paints over arms that Gemini baked onto a parts sheet's body piece, by copying nearby body texture
// through a feathered ellipse. Input: art-src/old/parts-N-v1.png → art-src/raw/parts-N.png (same layout).
import sharp from 'sharp';
const PATCHES = {
  // dest ellipse (centre, radii, rotation°) and the source offset to copy texture from
  0: [{ cx: 512, cy: 516, rx: 74, ry: 98, rot: -12, dx: 118, dy: 4 }, { cx: 448, cy: 512, rx: 26, ry: 66, rot: -8, dx: 190, dy: 0 }],
  11: [{ cx: 682, cy: 522, rx: 84, ry: 86, rot: 0, dx: 0, dy: -175 }],
  6: [{ cx: 487, cy: 484, rx: 70, ry: 100, rot: 0, dx: 128, dy: 0 }],
};
for (const [n, list] of Object.entries(PATCHES)) {
  let img = sharp(`art-src/old/parts-${n}-v1.png`);
  const { width, height } = await img.metadata();
  let buf = await img.png().toBuffer();
  for (const p of list) {
    const w = p.rx * 2 + 40, h = p.ry * 2 + 40, x = Math.round(p.cx - w / 2), y = Math.round(p.cy - h / 2);
    const mask = Buffer.from(`<svg width="${w}" height="${h}"><defs><filter id="f"><feGaussianBlur stdDeviation="7"/></filter></defs>
      <ellipse cx="${w / 2}" cy="${h / 2}" rx="${p.rx}" ry="${p.ry}" transform="rotate(${p.rot} ${w / 2} ${h / 2})" fill="#fff" filter="url(#f)"/></svg>`);
    const patch = await sharp(buf).extract({ left: x + p.dx, top: y + p.dy, width: w, height: h })
      .composite([{ input: mask, blend: 'dest-in' }]).png().toBuffer();
    buf = await sharp(buf).composite([{ input: patch, left: x, top: y }]).png().toBuffer();
  }
  await sharp(buf).toFile(`art-src/raw/parts-${n}.png`);
  console.log(`patched parts-${n} (${width}x${height})`);
}
