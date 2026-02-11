// dev/generate-icons.ts
import sharp from "sharp";
import path from "path";

const ICON_DIR = "src/public/icons";
const SRC = path.join(ICON_DIR, "youtube-gear.svg");
const SIZES = [16, 32, 48, 128];

for (const size of SIZES) {
  await sharp(SRC, { density: 300 })
    .resize(size, size)
    .png()
    .toFile(path.join(ICON_DIR, `icon-${size}.png`));
}
