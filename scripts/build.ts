import { mkdir, rm, copyFile, readdir, stat } from "fs/promises";
import { join, extname, dirname } from "path";
import { build } from "esbuild";
import { $ } from "bun";

const DIST = "dist";

async function ensureDir(path: string) {
  await mkdir(path, { recursive: true });
}

async function copyRecursive(src: string, dest: string) {
  const info = await stat(src);
  if (info.isDirectory()) {
    await ensureDir(dest);
    for (const entry of await readdir(src)) {
      await copyRecursive(join(src, entry), join(dest, entry));
    }
    return;
  }
  if (extname(src) === ".scss") return;
  await ensureDir(dirname(dest));
  await copyFile(src, dest);
}

// STATIC COPY (INPUT → OUTPUT)
const STATIC_ENTRIES = [
  { input: "src/manifest.json", output: join(DIST, "manifest.json") },
  { input: "src/background", output: join(DIST, "background") },
  { input: "src/public", output: join(DIST, "public") },
];

console.log("clean dist");
await rm(DIST, { recursive: true, force: true });
await ensureDir(DIST);

// copy static
for (const entry of STATIC_ENTRIES) {
  try {
    const info = await stat(entry.input);
    if (info.isDirectory()) {
      await copyRecursive(entry.input, entry.output);
    } else {
      await copyFile(entry.input, entry.output);
    }
  } catch {
    console.warn(`WARNING: ${entry.input} tidak ditemukan`);
  }
}

const SITES = await readdir("src/content-scripts");

for (const site of SITES) {
  console.log(`\n📦 bundle ${site}...`);
  const siteDir = `src/content-scripts/${site}`;
  const siteOutputDir = join(DIST, site);
  await ensureDir(siteOutputDir);

  // 1️⃣ Bundle injected-bridge.ts - ISOLATED world (run first)
  try {
    await build({
      entryPoints: [join(siteDir, "bridge", "injected-bridge.ts")],
      outfile: join(siteOutputDir, "injected-bridge.js"),
      bundle: true,
      minify: true,
      sourcemap: false,
      target: "es2020",
      format: "iife", // IIFE agar langsung execute
    });
    console.log(`  ✓ injected-bridge.js (ISOLATED world)`);
  } catch (err) {
    console.warn(`  ⚠ Skip injected-bridge (${err})`);
  }

  // 2️⃣ Bundle main.ts - MAIN world
  await build({
    entryPoints: [join(siteDir, "main.ts")],
    outfile: join(siteOutputDir, "index.js"),
    bundle: true,
    minify: true,
    sourcemap: false,
    target: "es2020",
    format: "esm",
  });
  console.log(`  ✓ index.js (MAIN world)`);

  // 3️⃣ Compile SCSS → CSS
  try {
    await $`bunx sass \
      ${join(siteDir, "style.scss")} \
      ${join(siteOutputDir, "style.css")} \
      --load-path=src/content-scripts/${site}/styles \
      --load-path=src/styles \
      --style=compressed \
      --no-source-map`;
    console.log(`  ✓ style.css`);
  } catch (err) {
    console.warn(`  ⚠ Skip SCSS compilation`);
  }
}

// ZIP FINAL
console.log("\n📦 zip addon");
await $`cd ${DIST} && zip -r -9 ../yt-enhancer.zip .`;
console.log("✅ done");
